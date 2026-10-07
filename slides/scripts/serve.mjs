#!/usr/bin/env node
/**
 * Serves the built deck (dist/) on http://localhost:3031 with no network and
 * no extra dependencies. The deck uses hash routing, so every path is a file.
 *
 *   node scripts/serve.mjs [--port 3031]
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const portArg = process.argv.indexOf('--port')
const port = portArg > -1 ? Number(process.argv[portArg + 1]) : 3031

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No dist/ yet. Run `pnpm build` first.')
  process.exit(1)
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  let file = normalize(join(dist, url))
  if (!file.startsWith(dist)) {
    res.writeHead(403).end()
    return
  }
  if (!existsSync(file) || statSync(file).isDirectory())
    file = join(dist, 'index.html')
  const size = statSync(file).size
  const type = TYPES[extname(file)] || 'application/octet-stream'
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/)
  if (range) {
    // Videos need range requests to loop smoothly.
    const start = range[1] ? Number(range[1]) : 0
    const end = range[2] ? Number(range[2]) : size - 1
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
    createReadStream(file, { start, end }).pipe(res)
    return
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' })
  createReadStream(file).pipe(res)
}).listen(port, () => {
  console.log(`Deck:      http://localhost:${port}/#/1`)
  console.log(`Presenter: http://localhost:${port}/#/presenter/1`)
})
