#!/usr/bin/env node
/**
 * End-to-end QA of the deck, the way the presenter drives it (plan section 10, phase 6).
 *
 *   pnpm build && pnpm serve     # in one terminal
 *   pnpm qa                      # in another; or: node scripts/qa-deck.mjs --url http://localhost:3030
 *
 * Source checks:
 *   - every plan slide (0–45) is covered by exactly one show slide: `plan:` lists
 *     the plan slides each one stands for ("14–15", "31, 34"), since this deck
 *     merges the code slides into the concept slides' notes
 *   - every slide has notes; show slides start with "[H:MM · N min] [MODE]" (plan 8.1),
 *     and slides whose mode isn't SLIDES have an explicit "→ SWITCH TO" line
 *   - the clock adds up: each slide starts when the previous one ends, and the
 *     sections start on the run of show's times (plan section 3)
 *   - stepped videos: `clicks:` matches the rendered stops, and the notes give a
 *     timestamp for every stop
 *   - none of the plan 5.2 patterns (gradients, shadows, all-caps, emoji, …) in the sources
 * Browser checks (all requests outside the deck's host are blocked and reported):
 *   - pressing → from slide 1 visits exactly the show slides, never the backstage ones
 *   - each slide's click steps match the [click] markers in its notes
 *   - every backstage slide renders; the presenter view shows notes; ?projector works
 *   - no console errors
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-chromium'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const urlArg = process.argv.indexOf('--url')
const base = (urlArg > -1 ? process.argv[urlArg + 1] : 'http://localhost:3031').replace(/\/$/, '')
const host = new URL(base).host
const problems = []
const warnings = []

// ---------- parse the sources ----------
const entry = readFileSync(join(root, 'slides.md'), 'utf8')
const files = [...entry.matchAll(/^src: (.+)$/gm)].map(m => m[1].trim())
const slides = []
for (const f of files) {
  const md = readFileSync(join(root, f), 'utf8')
  // Each slide is `---` frontmatter `---` body; bodies never contain a bare `---` line.
  const parts = md.split(/^---$/m).slice(1)
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const fm = parts[i]
    const body = parts[i + 1]
    const start = body.lastIndexOf('<!--')
    const notes = start > -1 && /-->\s*$/.test(body) ? body.slice(start + 4, body.lastIndexOf('-->')) : ''
    const video = body.match(/<StepVideo name="([^"]+)"(?![^>]*\bstill\b)(?![^>]*\bloop\b)/)
    slides.push({
      no: slides.length + 1,
      file: f,
      plan: (fm.match(/^plan: (.+)$/m) || [])[1],
      backstage: /^backstage: true$/m.test(fm),
      clicksFm: Number((fm.match(/^clicks: (\d+)$/m) || [])[1] ?? Number.NaN),
      title: (body.match(/^# (.+)$/m) || [])[1] ?? '',
      notes: notes.trim(),
      markers: (notes.match(/\[click(?::\d+)?\]/g) || []).length,
      video: video?.[1],
    })
  }
}
const show = slides.filter(s => !s.backstage)
const where = s => `slide ${s.no} (plan ${s.plan}, "${s.title}")`

// The plan slides a show slide stands for: "13", "14–15", "32–33, 35".
const planNumbers = (tag = '') => String(tag).split(',').flatMap((part) => {
  const [a, b = a] = part.trim().split(/[–-]/).map(Number)
  return Array.from({ length: b - a + 1 }, (_, i) => a + i)
})
const firstPlan = s => planNumbers(s.plan)[0]
const covered = new Map()
for (const s of show) {
  for (const n of planNumbers(s.plan)) {
    if (Number.isNaN(n))
      problems.push(`${where(s)}: can't read its plan tag`)
    else if (covered.has(n))
      problems.push(`plan slide ${n} is on both slide ${covered.get(n)} and slide ${s.no}`)
    else
      covered.set(n, s.no)
  }
}
for (let n = 0; n <= 45; n++) {
  if (!covered.has(n))
    problems.push(`plan slide ${n} isn't covered by any show slide (add it to a slide's plan tag)`)
}

// Notes format and the clock.
const toMin = hm => Number(hm.split(':')[0]) * 60 + Number(hm.split(':')[1])
const SECTIONS = { 1: '6:55', 13: '7:15', 23: '7:42', 28: '7:55', 30: '8:02', 37: '8:14', 42: '8:25' }
let clock = null
for (const s of slides) {
  if (!s.notes) {
    problems.push(`${where(s)} has no presenter notes`)
    continue
  }
  const first = s.notes.split('\n')[0].trim()
  if (s.backstage) {
    if (!/^\[backstage\] \[(SLIDES|VS CODE|TERMINAL|BROWSER)\]$/.test(first))
      problems.push(`${where(s)}: notes should start with "[backstage] [MODE]", got "${first}"`)
    continue
  }
  const m = first.match(/^\[(\d{1,2}:\d{2}) · (\d+) min\] \[(SLIDES|VS CODE|TERMINAL|BROWSER)\]$/)
  if (!m) {
    problems.push(`${where(s)}: notes should start with "[H:MM · N min] [MODE]", got "${first}"`)
    continue
  }
  const [, at, mins, mode] = m
  if (clock != null && firstPlan(s) !== 0 && toMin(at) !== clock)
    problems.push(`${where(s)} starts at ${at}, but the previous slide ends at ${Math.floor(clock / 60)}:${String(clock % 60).padStart(2, '0')}`)
  if (SECTIONS[firstPlan(s)] && SECTIONS[firstPlan(s)] !== at)
    problems.push(`${where(s)} should start at ${SECTIONS[firstPlan(s)]} (plan section 3), notes say ${at}`)
  clock = firstPlan(s) === 0 ? toMin('6:55') : toMin(at) + Number(mins)
  if (mode !== 'SLIDES' && !/→ SWITCH TO /.test(s.notes))
    problems.push(`${where(s)} is in ${mode} mode but its notes have no "→ SWITCH TO" line`)
  if (/SWITCH TO/.test(s.notes) && !/→ SWITCH TO (VS CODE|TERMINAL|BROWSER|SLIDES)/.test(s.notes))
    problems.push(`${where(s)}: a SWITCH line doesn't name VS CODE, TERMINAL, BROWSER, or SLIDES`)
}
if (clock !== toMin('8:30'))
  problems.push(`the show ends at ${Math.floor(clock / 60)}:${String(clock % 60).padStart(2, '0')}, not 8:30`)

// Stepped videos.
const videos = JSON.parse(readFileSync(join(root, 'data', 'videos.json'), 'utf8'))
const stamp = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}${t % 1 ? `.${String(t).split('.')[1]}` : ''}`
for (const s of show.filter(x => x.video)) {
  const v = videos[s.video]
  if (!v) {
    problems.push(`${where(s)}: video "${s.video}" isn't rendered (animations/render.mjs)`)
    continue
  }
  if (s.clicksFm !== v.stops.length - 1)
    problems.push(`${where(s)}: frontmatter clicks: ${s.clicksFm}, but the video has ${v.stops.length - 1} steps`)
  for (const t of v.stops.slice(1)) {
    if (!s.notes.includes(`–${stamp(t)}`))
      problems.push(`${where(s)}: notes have no narration line ending at ${stamp(t)}`)
  }
}

// Plan 5.2: patterns that read as generic slide design.
const FORBIDDEN = [
  [/linear-gradient|radial-gradient|conic-gradient/, 'gradient'],
  [/box-shadow:\s*(?!none)/, 'drop shadow'],
  [/text-shadow/, 'text shadow / glow'],
  [/backdrop-filter/, 'frosted panel'],
  [/text-transform:\s*uppercase/, 'all-caps label'],
  [/letter-spacing:\s*0\.[1-9]/, 'wide letter-spacing'],
  [/background-clip:\s*text/, 'gradient text'],
  [/[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}]/u, 'emoji'],
]
const sources = [
  ...files.map(f => join(root, f)),
  ...readdirSync(join(root, 'components')).map(f => join(root, 'components', f)),
  ...readdirSync(join(root, 'layouts')).map(f => join(root, 'layouts', f)),
  join(root, 'styles', 'global.css'),
  join(root, 'styles', 'tokens.css'),
]
for (const file of sources) {
  const text = readFileSync(file, 'utf8')
  for (const [re, what] of FORBIDDEN) {
    if (re.test(text))
      problems.push(`${file.replace(`${root}/`, '')}: ${what} (plan 5.2)`)
  }
}

// Placeholders still to fill in (plan section 11): reported, not failures.
const config = readFileSync(join(root, 'workshop.config.ts'), 'utf8')
for (const m of config.matchAll(/\{\{([A-Z_]+)\}\}/g))
  warnings.push(`placeholder ${m[1]} is still set in workshop.config.ts`)

// The built deck must not reference anything off the machine (fonts, favicon, scripts).
const distIndex = join(root, 'dist', 'index.html')
try {
  const html = readFileSync(distIndex, 'utf8')
  for (const m of html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g))
    problems.push(`dist/index.html loads ${m[1]} (the deck must run offline)`)
}
catch {
  warnings.push('no dist/index.html yet: run pnpm build to check the built deck')
}

// ---------- browser ----------
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const external = new Set()
await context.route('**/*', (route) => {
  const u = new URL(route.request().url())
  if (u.host === host || ['data:', 'blob:'].includes(u.protocol))
    return route.continue()
  external.add(u.href)
  return route.abort()
})
const page = await context.newPage()
const errors = new Set()
// Headless Chrome refuses wake locks; Slidev's FloatingVue patch is for twoslash, which is off.
const IGNORE = [/FloatingVue/, /Wake Lock/]
page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.some(r => r.test(m.text()))) errors.add(m.text().slice(0, 200)) })
page.on('pageerror', (e) => { if (!IGNORE.some(r => r.test(String(e)))) errors.add(String(e).slice(0, 200)) })

// The URL is #/<no>?clicks=<n> (production builds don't expose window.__slidev__).
async function position() {
  const m = page.url().match(/#\/(\d+)(?:\?(.*))?$/)
  return { no: Number(m?.[1]), clicks: Number(new URLSearchParams(m?.[2] || '').get('clicks') || 0) }
}

// 1. walk the show with →
await page.goto(`${base}/#/1`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const maxClicks = new Map()
const order = []
let last = ''
let stuck = 0
for (let i = 0; i < 600 && stuck < 3; i++) {
  const w = await position()
  const key = `${w.no}:${w.clicks}`
  if (key === last) {
    stuck++
  }
  else {
    stuck = 0
    if (order.at(-1) !== w.no)
      order.push(w.no)
    maxClicks.set(w.no, Math.max(maxClicks.get(w.no) ?? 0, w.clicks))
  }
  last = key
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(w.clicks === 0 ? 350 : 150)
}
const expectedOrder = show.map(s => s.no)
if (order.join(',') !== expectedOrder.join(','))
  problems.push(`→ visited ${order.join(',')} but the show is ${expectedOrder.join(',')}`)
for (const s of show) {
  const got = maxClicks.get(s.no) ?? 0
  if (got !== s.markers)
    problems.push(`${where(s)}: ${got} click step(s), notes have ${s.markers} [click] marker(s)`)
}

// 2. ↓ on the last show slide stays put instead of entering the backstage appendix
await page.goto(`${base}/#/${show.at(-1).no}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.keyboard.press('ArrowDown')
await page.waitForTimeout(400)
if ((await position()).no !== show.at(-1).no)
  problems.push('↓ on the last show slide left the show (it should stay put)')

// 3. every backstage slide renders
for (const s of slides.filter(x => x.backstage)) {
  await page.goto(`${base}/#/${s.no}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const text = await page.evaluate(() => document.querySelector('.slidev-page')?.textContent?.trim().length ?? 0)
  if (!text)
    problems.push(`backstage ${where(s)} rendered empty`)
}

// 4. presenter view shows notes; projector simulation switches on
await page.goto(`${base}/#/presenter/2`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
if (!(await page.evaluate(() => document.body.innerText)).includes('[6:55 · 1 min]'))
  problems.push('presenter view did not show slide 2\'s notes')
await page.goto(`${base}/?projector#/1`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
if (!(await page.evaluate(() => document.documentElement.classList.contains('projector-sim'))))
  problems.push('?projector did not switch the projector simulation on')

await browser.close()

console.log(`Slides: ${slides.length} (${show.length} in the show, ${slides.length - show.length} backstage)`)
console.log(`Click steps in the show: ${[...maxClicks.values()].reduce((a, b) => a + b, 0)}`)
if (external.size)
  problems.push(`requests outside the deck were attempted (blocked): ${[...external].join(', ')}`)
if (errors.size)
  problems.push(`console errors:\n    ${[...errors].join('\n    ')}`)
for (const w of warnings)
  console.log(`  ! ${w}`)
if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):`)
  problems.forEach(p => console.log(`  - ${p}`))
  process.exit(1)
}
console.log('✓ notes, clock, videos, style rules, offline, navigation, click counts, backstage, presenter view all OK')
