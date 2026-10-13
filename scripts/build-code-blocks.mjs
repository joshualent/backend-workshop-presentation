#!/usr/bin/env node
/**
 * Writes the Magic Move and code-window blocks into the slides from the real
 * snippet files (see scripts/code-blocks.config.mjs).
 *
 *   node scripts/build-code-blocks.mjs          # rewrite slides/pages/*.md in place
 *   node scripts/build-code-blocks.mjs --check  # exit 1 if any block is out of date
 *
 * Each block lives between these markers in a slide, and everything between
 * them is replaced:
 *   <!-- code-block: views-1-to-2 -->
 *   <!-- /code-block -->
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import specs from './code-blocks.config.mjs'
import { changedLines, parseBlocks, removeBlock, replaceBlock, toRanges } from './lib/python-blocks.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const snippets = join(root, 'slides', 'snippets')
const pagesDir = join(root, 'slides', 'pages')
const check = process.argv.includes('--check')

const read = file => readFileSync(join(snippets, file), 'utf8')
const lang = file => (file.endsWith('.py') ? 'python' : file.split('.').pop())

/** The full file content for a step, before windowing. */
function stateOf(step) {
  let text = read(step.file)
  for (const name of step.remove ?? [])
    text = removeBlock(text, name)
  for (const [name, other] of Object.entries(step.use ?? {}))
    text = replaceBlock(text, name, read(other))
  return text
}

function windowOf(text, step) {
  const { lines, blocks } = parseBlocks(text)
  if (!step.window)
    return [0, lines.length - 1]
  const [from, to] = step.window
  if (!blocks[from] || !blocks[to])
    throw new Error(`${step.file}: no block "${blocks[from] ? to : from}" (have: ${Object.keys(blocks).join(', ')})`)
  const start = blocks[from][0]
  const end = step.lines ? start + step.lines - 1 : blocks[to][1]
  return [start, end]
}

function render(id, spec) {
  let previous = null
  const blocks = spec.steps.map((step, i) => {
    const text = stateOf(step)
    const [start, end] = windowOf(text, step)
    const lines = text.replace(/\n$/, '').split('\n')
    const shown = lines.slice(start, end + 1)

    let meta = ''
    const highlight = step.highlight ?? (i > 0 ? 'changes' : false)
    if (highlight === 'changes') {
      const before = step.against ? read(step.against) : previous
      if (!before)
        throw new Error(`${id}: step ${i + 1} highlights changes but has nothing to compare with`)
      const changed = [...changedLines(before, text)]
        .filter(n => n >= start && n <= end && lines[n].trim() !== '')
        .map(n => n - start)
      if (changed.length)
        meta = ` {${toRanges(changed)}}`
    }
    else if (Array.isArray(highlight)) {
      const parts = highlight.map((h) => {
        if (h === '*')
          return '*'
        const hits = shown.map((l, n) => (l.includes(h.match) ? n : -1)).filter(n => n >= 0)
        if (!hits.length)
          throw new Error(`${id}: no line contains "${h.match}"`)
        return toRanges(hits)
      })
      meta = ` {${parts.join('|')}}`
    }
    previous = text
    return `\`\`\`${lang(step.file)}${meta}\n${shown.join('\n')}\n\`\`\``
  })

  if (spec.magicMove)
    return `\`\`\`\`md magic-move\n${blocks.join('\n')}\n\`\`\`\``
  return blocks.join('\n\n')
}

const MARKER = /(<!-- code-block: ([\w-]+) -->\n)([\s\S]*?)(<!-- \/code-block -->)/g
const used = new Set()
const stale = []

for (const name of readdirSync(pagesDir).filter(f => f.endsWith('.md')).sort()) {
  const path = join(pagesDir, name)
  const before = readFileSync(path, 'utf8')
  const after = before.replace(MARKER, (_, open, id, _body, close) => {
    const spec = specs[id]
    if (!spec)
      throw new Error(`${name}: unknown code block "${id}" (see scripts/code-blocks.config.mjs)`)
    used.add(id)
    return `${open}${render(id, spec)}\n${close}`
  })
  if (after !== before) {
    stale.push(name)
    if (!check)
      writeFileSync(path, after)
  }
}

const unused = Object.keys(specs).filter(id => !used.has(id))
if (unused.length)
  console.warn(`Code blocks defined but not used on any slide: ${unused.join(', ')}`)

if (check) {
  if (stale.length) {
    console.error(`Out of date code blocks in: ${stale.join(', ')}. Run scripts/extract-snippets.sh.`)
    process.exit(1)
  }
  console.log(`Code blocks: ${used.size} up to date`)
}
else {
  console.log(`Code blocks: ${used.size} written${stale.length ? ` (updated ${stale.join(', ')})` : ''}`)
}
