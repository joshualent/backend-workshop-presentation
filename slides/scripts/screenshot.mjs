#!/usr/bin/env node
/**
 * QA screenshots of the running deck (dev server or `vite preview` of dist/).
 *
 *   node scripts/screenshot.mjs [--url http://localhost:3030] [--slides 1-36]
 *        [--clicks final|0|all] [--projector] [--width 1280] [--out shots]
 *
 * --clicks all writes one image per click step. Console errors are printed.
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-chromium'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--'))
      acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
    return acc
  }, []),
)

const base = (args.url || 'http://localhost:3030').replace(/\/$/, '')
const width = Number(args.width || 1280)
const height = Math.round(width * 9 / 16)
const out = args.out || 'shots'
const clicksMode = args.clicks || 'final'
const projector = !!args.projector

function parseRange(r, max) {
  if (!r)
    return Array.from({ length: max }, (_, i) => i + 1)
  return r.split(',').flatMap((part) => {
    const [a, b] = part.split('-').map(Number)
    return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]
  })
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push(String(e)))

async function go(no, clicks) {
  const q = new URLSearchParams()
  if (clicks)
    q.set('clicks', String(clicks))
  if (projector)
    q.set('projector', '')
  const qs = q.toString() ? `?${q.toString().replace('projector=', 'projector')}` : ''
  await page.goto(`${base}/#/${no}${qs}`, { waitUntil: "networkidle" })
  await page.reload({ waitUntil: "networkidle" })
  await page.waitForTimeout(900)
}

await page.goto(`${base}/`, { waitUntil: 'networkidle' })
const total = await page.evaluate(() => {
  const el = document.querySelector('.slidev-nav-total') // not always present
  return el ? Number(el.textContent) : null
})
const slides = parseRange(args.slides, total || 60)
await mkdir(out, { recursive: true })

for (const no of slides) {
  if (clicksMode === 'all') {
    await go(no, 0)
    const max = await page.evaluate(() => {
      const nav = window.__slidev__?.nav
      return nav ? nav.clicksTotal : 0
    })
    for (let c = 0; c <= max; c++) {
      await go(no, c)
      await page.waitForTimeout(400)
      await page.screenshot({ path: join(out, `${String(no).padStart(2, '0')}-c${c}${projector ? '-proj' : ''}.png`) })
    }
  }
  else {
    await go(no, clicksMode === 'final' ? 999 : 0)
    await page.screenshot({ path: join(out, `${String(no).padStart(2, '0')}${projector ? '-proj' : ''}.png`) })
  }
}

await browser.close()
if (errors.length) {
  console.log(`Console errors (${errors.length}):`)
  for (const e of [...new Set(errors)])
    console.log(' -', e.slice(0, 300))
}
console.log(`Saved ${slides.length} slide(s) to ${out}/`)
