#!/usr/bin/env node
/**
 * Renders the explainer videos from source and installs them in the deck.
 *
 *   node render.mjs                         # all of them
 *   node render.mjs v2-life-of-a-post       # one
 *   node render.mjs v2-life-of-a-post --sheet   # also a contact sheet of every stop, for review
 *   node render.mjs v2-life-of-a-post --stops   # only the contact sheet, no video (fast)
 *   node render.mjs v1-one-backend-many-clients --stops --at 0,2,4,8,12   # sheet of chosen times
 *
 * For each video: headless Chromium (Playwright) seeks the page's GSAP
 * timeline frame by frame at 1920 × 1080, 30 fps; FFmpeg encodes the frames.
 * Output in ../slides/public/media/videos/:
 *   <name>.mp4   H.264, no audio
 *   <name>.webm  VP9, no audio
 *   <name>.png   the final stop's frame (a complete summary): poster and PDF export
 * and the stop times in ../slides/data/videos.json, which StepVideo reads.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright-chromium'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'slides', 'public', 'media', 'videos')
const manifest = join(here, '..', 'slides', 'data', 'videos.json')
const renders = join(here, 'renders')
const VIDEOS = ['v1-pages-vs-api', 'v1-one-backend-many-clients', 'v2-life-of-a-post', 'v3-count-to-voters']

const args = process.argv.slice(2)
const stopsOnly = args.includes('--stops')
const sheet = stopsOnly || args.includes('--sheet')
const atArg = args.indexOf('--at')
const atTimes = atArg > -1 ? args[atArg + 1].split(',').map(Number) : null
const names = args.filter((a, i) => !a.startsWith('--') && (atArg < 0 || i !== atArg + 1))
for (const n of names) {
  if (!VIDEOS.includes(n)) {
    console.error(`Unknown video "${n}". Known: ${VIDEOS.join(', ')}`)
    process.exit(1)
  }
}
const selected = names.length ? names : VIDEOS

mkdirSync(outDir, { recursive: true })
mkdirSync(renders, { recursive: true })

function ffmpeg(argv, input) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-loglevel', 'error', '-y', ...argv], { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] })
    p.on('error', reject)
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
    if (input)
      input(p.stdin)
  })
}

const mb = file => (statSync(file).size / 1024 / 1024).toFixed(2)
const videos = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : {}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })

for (const name of selected) {
  const url = `${pathToFileURL(join(here, name, 'index.html')).href}?render`
  await page.goto(url, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const meta = await page.evaluate(() => window.__video)
  if (!meta)
    throw new Error(`${name}: the page didn't call registerVideo()`)
  const { fps, duration, stops } = meta
  const frames = Math.round(duration * fps)
  const seek = t => page.evaluate(t => window.__seek(t), t)
  console.log(`▶ ${name}: ${frames} frames (${duration} s), stops ${stops.join(', ')}`)

  const contactSheet = async () => {
    const dir = join(renders, `${name}-stops`)
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    for (const [i, t] of (atTimes ?? stops).entries()) {
      await seek(t)
      await page.screenshot({ path: join(dir, `${String(i).padStart(2, '0')}.png`) })
    }
    const count = (atTimes ?? stops).length
    const cols = Math.min(count, 3)
    const rows = Math.ceil(count / cols)
    await ffmpeg(['-framerate', '1', '-i', join(dir, '%02d.png'), '-vf', `scale=960:540,tile=${cols}x${rows}:padding=8:color=white`, '-frames:v', '1', join(renders, `${name}-stops.png`)])
    console.log(`  sheet: renders/${name}-stops.png`)
  }
  if (stopsOnly) {
    await contactSheet()
    continue
  }

  // Lossless-ish master straight from the frames.
  const master = join(renders, `${name}.mp4`)
  await ffmpeg(['-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', master], async (stdin) => {
    for (let i = 0; i < frames; i++) {
      await seek(i / fps)
      const png = await page.screenshot({ type: 'png' })
      if (!stdin.write(png))
        await new Promise(r => stdin.once('drain', r))
      if (i % 90 === 0)
        process.stdout.write(`  ${Math.round(i / fps)}s`)
    }
    stdin.end()
    process.stdout.write('\n')
  })

  const mp4 = join(outDir, `${name}.mp4`)
  const webm = join(outDir, `${name}.webm`)
  const poster = join(outDir, `${name}.png`)
  await ffmpeg(['-i', master, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4])
  await ffmpeg(['-i', master, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', webm])

  // The poster is the final stop: a complete static summary.
  await seek(meta.poster ?? stops.at(-1))
  await page.screenshot({ path: poster, type: 'png' })

  if (sheet)
    await contactSheet()

  videos[name] = { duration, stops }
  console.log(`  ✓ mp4 ${mb(mp4)} MB · webm ${mb(webm)} MB · poster ${mb(poster)} MB`)
}

await browser.close()
if (stopsOnly)
  process.exit(0)
writeFileSync(manifest, `${JSON.stringify(videos, null, 2)}\n`)
console.log(`Stops written to slides/data/videos.json`)
