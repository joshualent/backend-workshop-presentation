#!/usr/bin/env node
/**
 * Saves a fresh screenshot of the deployed board for the offline fallback
 * (slides 2, 25, 34 and backstage 38–40). Run it the afternoon of the talk,
 * then rebuild the deck.
 *
 *   node scripts/capture-board.mjs [--url https://board.example.com/...]
 *
 * Defaults to liveBoardUrl from workshop.config.ts.
 */
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-chromium'

const here = dirname(fileURLToPath(import.meta.url))
const urlArg = process.argv.indexOf('--url')
let url = urlArg > -1 ? process.argv[urlArg + 1] : null
if (!url) {
  const config = await readFile(join(here, '..', 'workshop.config.ts'), 'utf8')
  url = config.match(/liveBoardUrl:\s*'([^']+)'/)?.[1]
}
if (!url || /^\{\{.*\}\}$/.test(url)) {
  console.error('Set liveBoardUrl in workshop.config.ts first (or pass --url).')
  process.exit(1)
}

// Same aspect as the LiveBoard viewport on the slides (≈ 870 × 356 CSS px), rendered at 2x.
const out = join(here, '..', 'public', 'media', 'board', 'board-fallback.png')
await mkdir(dirname(out), { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 870, height: 396 }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.screenshot({ path: out })
await browser.close()
console.log(`Saved ${out} from ${url}`)
