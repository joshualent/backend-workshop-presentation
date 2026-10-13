#!/usr/bin/env node
/**
 * Screenshots slides for review, at their final click state.
 *
 *   node scripts/screenshot.mjs [--url http://localhost:3030] [--projector] [--clicks first|last|all] [slides…]
 *
 * Slides are numbers or ranges ("3", "10-14"); default is every slide.
 * Writes shots/<NN>[-cK][-projector].png at 1960 × 1104 (the 980 × 552 canvas at 2×).
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-chromium'

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i > -1 ? args[i + 1] : fallback
}
const base = opt('url', 'http://localhost:3030').replace(/\/$/, '')
const projector = args.includes('--projector')
const clicksMode = opt('clicks', 'last')
const wanted = args.filter((a, i) => !a.startsWith('--') && !['--url', '--clicks'].includes(args[i - 1]))

const out = join(here, '..', 'shots')
mkdirSync(out, { recursive: true })

// Slide count from the sources (production builds don't expose window.__slidev__).
const entry = readFileSync(join(here, '..', 'slides.md'), 'utf8')
const total = [...entry.matchAll(/^src: (.+)$/gm)]
  .map(m => readFileSync(join(here, '..', m[1].trim()), 'utf8').split(/^---$/m).slice(1).length / 2)
  .reduce((a, b) => a + b, 0)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 980, height: 552 }, deviceScaleFactor: 2 })
/** Go to slide `no` at click `c`; Slidev clamps `c` to the slide's last click. Returns the click it landed on. */
async function go(no, c) {
  const q = projector ? 'projector&' : ''
  await page.goto(`${base}/?${q}#/${no}?clicks=${c}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  return Number(new URLSearchParams(page.url().split('?').at(-1)).get('clicks') ?? 0)
}
/** The slide's real click count: only the dev server exposes it. */
const clicksTotal = () => page.evaluate(() => window.__slidev__?.nav?.clicksTotal)

const list = wanted.length
  ? wanted.flatMap((w) => {
      const [a, b] = w.split('-').map(Number)
      return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]
    })
  : Array.from({ length: total }, (_, i) => i + 1)

for (const no of list) {
  await go(no, 0)
  // ?clicks=99 renders the final state; Slidev keeps the number in the URL as given.
  const max = (await clicksTotal()) ?? await go(no, 99)
  if (clicksMode === 'all' && max === 99)
    throw new Error('--clicks all needs the dev server (pnpm dev), which reports each slide\'s click count')
  const states = clicksMode === 'all' ? Array.from({ length: max + 1 }, (_, i) => i) : clicksMode === 'first' ? [0] : [max]
  for (const c of states) {
    await go(no, c)
    const name = `${String(no).padStart(2, '0')}${clicksMode === 'all' ? `-c${c}` : ''}${projector ? '-projector' : ''}.png`
    await page.screenshot({ path: join(out, name) })
  }
  process.stdout.write(`${no}(${max}) `)
}
console.log(`\n→ ${out}`)
await browser.close()
