#!/usr/bin/env node
/**
 * End-to-end QA of the deck, the way the presenter drives it.
 *
 *   node scripts/qa-deck.mjs [--url http://localhost:3031]   (serve dist/ first: pnpm serve)
 *
 * - Blocks every request that isn't to the deck's own host and reports any
 *   attempt (the deck must run offline).
 * - Presses → from slide 1 until it stops, recording every slide/click step:
 *   checks that backstage slides are skipped and that each slide's click count
 *   matches the [click] markers in its presenter notes.
 * - Checks `b` jumps from each live-board slide to its fallback and back.
 * - Opens every backstage slide and the presenter view; reports console errors.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-chromium'

const here = dirname(fileURLToPath(import.meta.url))
const urlArg = process.argv.indexOf('--url')
const base = (urlArg > -1 ? process.argv[urlArg + 1] : 'http://localhost:3031').replace(/\/$/, '')
const host = new URL(base).host

// ---------- parse the sources ----------
const entry = readFileSync(join(here, '..', 'slides.md'), 'utf8')
const files = [...entry.matchAll(/^src: (.+)$/gm)].map(m => m[1].trim())
const slides = []
for (const f of files) {
  const md = readFileSync(join(here, '..', f), 'utf8')
  // Each slide is `---` frontmatter `---` body; bodies never contain a bare `---` line.
  const parts = md.split(/^---$/m).slice(1)
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const fm = parts[i]
    const body = parts[i + 1]
    const notes = (body.match(/<!--([\s\S]*?)-->\s*$/) || [])[1] || ''
    slides.push({
      no: slides.length + 1,
      plan: (fm.match(/^plan: (.+)$/m) || [])[1],
      backstage: /^backstage: true$/m.test(fm),
      fallback: (fm.match(/^fallback: (.+)$/m) || [])[1],
      alias: (fm.match(/^routeAlias: (.+)$/m) || [])[1],
      clickMarkers: (notes.match(/\[click(?::\d+)?\]/g) || []).length,
      hasNotes: notes.trim().length > 0,
    })
  }
}

const problems = []
const front = slides.filter(s => !s.backstage)
for (const s of slides) {
  if (!s.hasNotes)
    problems.push(`slide ${s.no} (plan ${s.plan}) has no presenter notes`)
}

// ---------- browser ----------
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const external = new Set()
await context.route('**/*', (route) => {
  const u = new URL(route.request().url())
  if (u.host === host || u.protocol === 'data:' || u.protocol === 'blob:')
    return route.continue()
  external.add(u.href)
  return route.abort()
})
const page = await context.newPage()
const errors = new Set()
// Headless Chrome refuses wake locks; twoslash's FloatingVue patch is unused (twoslash is off).
const IGNORE = [/FloatingVue/, /Wake Lock/]
page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.some(r => r.test(m.text()))) errors.add(m.text().slice(0, 200)) })
page.on('pageerror', (e) => { if (!IGNORE.some(r => r.test(String(e)))) errors.add(String(e).slice(0, 200)) })

// URLs use the routeAlias when a slide has one (#/title), else the number.
const where = () => {
  const m = page.url().match(/#\/([^?/]+)(?:\?(.*))?$/)
  if (!m)
    return null
  const id = decodeURIComponent(m[1])
  const no = /^\d+$/.test(id) ? Number(id) : slides.find(s => s.alias === id)?.no
  const clicks = Number(new URLSearchParams(m[2] || '').get('clicks') || 0)
  return no ? { no, clicks } : null
}

// 1. walk the show with →
await page.goto(`${base}/#/1`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const maxClicks = new Map()
const order = []
let last = ''
let stuck = 0
for (let i = 0; i < 400 && stuck < 3; i++) {
  const w = where()
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
  await page.waitForTimeout(w.clicks === 0 ? 450 : 220)
}

const expectedOrder = front.map(s => s.no)
if (order.join(',') !== expectedOrder.join(','))
  problems.push(`→ visited ${order.join(',')} but the show is ${expectedOrder.join(',')}`)
for (const s of front) {
  const got = maxClicks.get(s.no) ?? 0
  if (got !== s.clickMarkers)
    problems.push(`slide ${s.no} (plan ${s.plan}): ${got} click step(s), notes have ${s.clickMarkers} [click] marker(s)`)
}

// 2. b: live board ↔ fallback
for (const s of front.filter(x => x.fallback)) {
  const fb = slides.find(x => x.alias === s.fallback)
  await page.goto(`${base}/#/${s.no}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.keyboard.press('b')
  await page.waitForTimeout(500)
  const a = where()
  await page.keyboard.press('b')
  await page.waitForTimeout(500)
  const back = where()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(500)
  if (a?.no !== fb?.no || back?.no !== s.no)
    problems.push(`b on slide ${s.no}: went to ${a?.no} and back to ${back?.no} (expected ${fb?.no} and ${s.no})`)
  // → from the fallback continues after the live slide
  await page.goto(`${base}/#/${fb.no}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(500)
  const next = front[front.findIndex(x => x.no === s.no) + 1]
  if (next && where()?.no !== next.no)
    problems.push(`→ on fallback slide ${fb.no} went to ${where()?.no}, expected ${next.no}`)
}

// 3. every backstage slide renders
for (const s of slides.filter(x => x.backstage)) {
  await page.goto(`${base}/#/${s.no}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const text = await page.evaluate(() => document.querySelector('.slidev-page')?.textContent?.trim().length ?? 0)
  if (!text)
    problems.push(`backstage slide ${s.no} (plan ${s.plan}) rendered empty`)
}

// 4. presenter view shows notes
await page.goto(`${base}/#/presenter/2`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const notes = await page.evaluate(() => document.body.innerText)
if (!/\[6:55 · 1 min\]|6:55 · 1 min/.test(notes))
  problems.push('presenter view did not show slide 2\'s notes')

await browser.close()

console.log(`Slides: ${slides.length} (${front.length} in the show, ${slides.length - front.length} backstage)`)
console.log(`Click steps in the show: ${[...maxClicks.values()].reduce((a, b) => a + b, 0)}`)
if (external.size)
  problems.push(`external requests attempted (blocked): ${[...external].join(', ')}`)
if (errors.size)
  problems.push(`console errors:\n    ${[...errors].join('\n    ')}`)
if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):`)
  problems.forEach(p => console.log(`  - ${p}`))
  process.exit(1)
}
console.log('✓ offline, navigation, click counts, fallbacks, backstage, presenter view all OK')
