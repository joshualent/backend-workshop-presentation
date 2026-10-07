#!/usr/bin/env node
/**
 * Renders the showpiece clips from source and installs them in the deck.
 *
 *   node render.mjs                     # all clips, final quality
 *   node render.mjs server-vs-api       # one clip
 *   node render.mjs server-vs-api --sheet   # draft render + contact sheet of frames, for review
 *
 * Per clip: HyperFrames renders renders/<name>.mp4 (1920×1080, 30 fps), then
 * FFmpeg makes the H.264 MP4, the VP9 WebM, and the PNG poster frame in
 * ../slides/public/media/clips/. Fails if a clip is over 15 s or 5 MB.
 *
 * Uses Playwright's cached headless shell when HYPERFRAMES_BROWSER_PATH is
 * unset, so no extra Chrome download is needed.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'slides', 'public', 'media', 'clips')
const renders = join(here, 'renders')

/** posterAt: the frame that stands in for the clip in PDF export and the backstage stills. */
const CLIPS = {
  'server-vs-api': { posterAt: 1.0 },
  'orm-class-to-table': { posterAt: 7.0 },
  'counter-to-m2m': { posterAt: 9.6 },
}

const args = process.argv.slice(2)
const sheet = args.includes('--sheet')
const names = args.filter(a => !a.startsWith('--'))
const selected = names.length ? names : Object.keys(CLIPS)

const env = { ...process.env, HYPERFRAMES_NO_TELEMETRY: '1', HYPERFRAMES_SKIP_SKILLS: '1', HYPERFRAMES_NO_UPDATE_CHECK: '1' }
if (!env.HYPERFRAMES_BROWSER_PATH) {
  const pw = join(homedir(), '.cache', 'ms-playwright')
  const shell = existsSync(pw) && readdirSync(pw).filter(d => d.startsWith('chromium_headless_shell-')).sort().pop()
  const bin = shell && join(pw, shell, 'chrome-headless-shell-linux64', 'chrome-headless-shell')
  if (bin && existsSync(bin))
    env.HYPERFRAMES_BROWSER_PATH = bin
}

const run = (cmd, argv) => execFileSync(cmd, argv, { cwd: here, env, stdio: ['ignore', 'pipe', 'inherit'] }).toString()
const ff = argv => run('ffmpeg', ['-loglevel', 'error', '-y', ...argv])
const duration = file => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).trim())
const mb = file => statSync(file).size / 1024 / 1024

mkdirSync(renders, { recursive: true })
mkdirSync(outDir, { recursive: true })

let failed = false
for (const name of selected) {
  const clip = CLIPS[name]
  if (!clip) {
    console.error(`Unknown clip "${name}". Known: ${Object.keys(CLIPS).join(', ')}`)
    process.exit(1)
  }
  const raw = join(renders, `${name}.mp4`)
  console.log(`▶ ${name}: rendering…`)
  run('npx', ['hyperframes', 'render', '.', '-c', `${name}/index.html`, '-o', raw, '-q', sheet ? 'draft' : 'delivery', '--quiet'])
  const secs = duration(raw)

  if (sheet) {
    // 12 evenly spaced frames, 4×3, for reviewing motion and layout.
    const tiles = join(renders, `${name}-frames`)
    rmSync(tiles, { recursive: true, force: true })
    mkdirSync(tiles)
    for (let i = 0; i < 12; i++)
      ff(['-ss', (secs * i / 12).toFixed(2), '-i', raw, '-frames:v', '1', '-vf', 'scale=640:360', join(tiles, `${String(i).padStart(2, '0')}.png`)])
    ff(['-i', join(tiles, '%02d.png'), '-vf', 'tile=4x3:padding=6:color=white', '-frames:v', '1', join(renders, `${name}-sheet.png`)])
    console.log(`  sheet: ${join(renders, `${name}-sheet.png`)} (${secs.toFixed(2)} s)`)
    continue
  }

  const mp4 = join(outDir, `${name}.mp4`)
  const webm = join(outDir, `${name}.webm`)
  const png = join(outDir, `${name}.png`)
  ff(['-i', raw, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4])
  ff(['-i', raw, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', webm])
  ff(['-ss', String(clip.posterAt), '-i', raw, '-frames:v', '1', png])

  const report = `${secs.toFixed(2)} s · mp4 ${mb(mp4).toFixed(2)} MB · webm ${mb(webm).toFixed(2)} MB · poster ${mb(png).toFixed(2)} MB`
  const ok = secs <= 15.01 && mb(mp4) <= 5 && mb(webm) <= 5
  failed ||= !ok
  console.log(`  ${ok ? '✓' : '✗'} ${report}`)
}
if (failed) {
  console.error('A clip is over 15 s or 5 MB (plan section 6).')
  process.exit(1)
}
