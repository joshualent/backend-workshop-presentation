#!/usr/bin/env node
/**
 * Verifies that every Python snippet on the slides, in notes/cheat-sheet.md,
 * and in the clip sources is a character-for-character, contiguous slice of a
 * block in Appendix A of docs/presentation-plan.md.
 *
 *   node scripts/check-code.mjs        (exit 1 on any mismatch)
 *
 * A leading "# path/to/file.py…" comment that matches an Appendix A block
 * header is treated as a label, not code. Magic Move blocks (URLs, not
 * Python) are skipped. In HTML clip sources, only <pre data-code-check>
 * blocks are checked (tags stripped, entities decoded).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = p => readFileSync(join(root, p), 'utf8')

function pythonBlocks(markdown) {
  const lines = markdown.split('\n')
  const blocks = []
  let outer = null // ```` fence (magic-move) depth
  let cur = null
  lines.forEach((line, i) => {
    if (/^````/.test(line)) {
      outer = outer ? null : line
      return
    }
    if (outer)
      return
    const open = line.match(/^```python\b/)
    if (!cur && open) {
      cur = { start: i + 2, lines: [] }
      return
    }
    if (cur && /^```\s*$/.test(line)) {
      blocks.push(cur)
      cur = null
      return
    }
    if (cur)
      cur.lines.push(line)
  })
  return blocks
}

function htmlBlocks(html) {
  const blocks = []
  const re = /<pre[^>]*data-code-check[^>]*>([\s\S]*?)<\/pre>/g
  let m
  while ((m = re.exec(html))) {
    const text = m[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&')
    const start = html.slice(0, m.index).split('\n').length
    blocks.push({ start, lines: text.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n') })
  }
  return blocks
}

// ---------- Appendix A ----------
const plan = read('docs/presentation-plan.md')
const appendix = plan.slice(plan.indexOf('## Appendix A'))
const reference = pythonBlocks(appendix).map((b) => {
  const header = b.lines[0].startsWith('#') ? b.lines[0] : null
  return { header, body: header ? b.lines.slice(1) : b.lines }
})
const headers = new Set(reference.map(r => r.header).filter(Boolean))

function isSlice(body) {
  if (!body.length)
    return false
  return reference.some(({ body: ref }) => {
    for (let i = 0; i + body.length <= ref.length; i++) {
      if (body.every((l, j) => l === ref[i + j]))
        return true
    }
    return false
  })
}

// ---------- Targets ----------
function walk(dir, exts, out = []) {
  let entries = []
  try {
    entries = readdirSync(join(root, dir))
  }
  catch { return out }
  for (const e of entries) {
    const p = join(dir, e)
    if (['node_modules', 'renders', '.hyperframes', 'dist'].includes(e))
      continue
    if (statSync(join(root, p)).isDirectory())
      walk(p, exts, out)
    else if (exts.some(x => e.endsWith(x)))
      out.push(p)
  }
  return out
}

const targets = [
  ...walk('slides/pages', ['.md']).map(p => [p, pythonBlocks(read(p))]),
  ['notes/cheat-sheet.md', (() => { try { return pythonBlocks(read('notes/cheat-sheet.md')) } catch { return [] } })()],
  ...walk('animations', ['.html']).map(p => [p, htmlBlocks(read(p))]),
]

let checked = 0
const failures = []
for (const [file, blocks] of targets) {
  for (const b of blocks) {
    let body = b.lines
    if (body[0] && headers.has(body[0]))
      body = body.slice(1)
    checked++
    if (!isSlice(body))
      failures.push(`${relative(root, join(root, file))}:${b.start}\n    ${body.slice(0, 3).join('\n    ')}${body.length > 3 ? '\n    …' : ''}`)
  }
}

if (failures.length) {
  console.error(`✗ ${failures.length} of ${checked} snippet(s) don't match Appendix A:\n`)
  failures.forEach(f => console.error(`  ${f}\n`))
  process.exit(1)
}
console.log(`✓ ${checked} snippet(s) match Appendix A exactly.`)
