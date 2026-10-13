/**
 * Just enough Python structure to cut real files into named blocks, so code
 * windows and Magic Move steps can be described by name ("the upvote method")
 * instead of line numbers that would drift when the workshop repo changes.
 *
 * Block names:
 *   imports       first import through the last top-level import
 *   class         the whole top-level class
 *   header        the class line plus the attributes before the first method
 *   <name>        a method (with its decorators), nested class, or attribute
 *                 (`operations`, `permission_classes`) inside the class, or a
 *                 top-level def / assignment (`urlpatterns`, `router`)
 *   start, end    the first / last line of the file
 * Ranges are [first, last] 0-based line indexes, inclusive.
 */

const indentOf = line => line.match(/^\s*/)[0].length
const isBlank = line => line.trim() === ''

function lastNonBlank(lines, from, to) {
  let i = to
  while (i > from && isBlank(lines[i])) i--
  return i
}

/** Top-level statements: a line at indent 0 plus its indented or closing-bracket continuation lines. */
function statements(lines, start, end, indent) {
  const out = []
  let i = start
  while (i <= end) {
    if (isBlank(lines[i]) || indentOf(lines[i]) !== indent) {
      i++
      continue
    }
    let j = i + 1
    while (j <= end && (isBlank(lines[j]) || indentOf(lines[j]) > indent || /^\s*[)\]}]/.test(lines[j]))) j++
    out.push([i, lastNonBlank(lines, i, j - 1)])
    i = j
  }
  return out
}

export function parseBlocks(text) {
  const lines = text.replace(/\n$/, '').split('\n')
  const blocks = { start: [0, 0], end: [lines.length - 1, lines.length - 1] }
  const top = statements(lines, 0, lines.length - 1, 0)

  const imports = top.filter(([s]) => /^(from|import)\s/.test(lines[s]))
  if (imports.length)
    blocks.imports = [imports[0][0], imports.at(-1)[1]]

  for (const [s, e] of top) {
    const line = lines[s]
    let m
    if ((m = line.match(/^class (\w+)/))) {
      blocks.class = [s, e]
      blocks[m[1]] = [s, e]
      parseClassBody(lines, s, e, blocks)
    }
    else if ((m = line.match(/^def (\w+)/))) {
      blocks[m[1]] = [s, e]
    }
    else if ((m = line.match(/^([\w.]+)\s*(=|\()/))) {
      const name = m[1]
      blocks[name] = blocks[name] ? [blocks[name][0], e] : [s, e]
    }
  }
  return { lines, blocks }
}

function parseClassBody(lines, classStart, classEnd, blocks) {
  const members = statements(lines, classStart + 1, classEnd, 4)
  // Decorators are their own statements; attach them to the def that follows.
  let pendingDecorator = null
  for (const [s, e] of members) {
    const line = lines[s]
    if (/^\s*@/.test(line)) {
      pendingDecorator ??= s
      continue
    }
    const m = line.match(/^\s*(?:def|class) (\w+)/)
    if (m)
      blocks[m[1]] = [pendingDecorator ?? s, e]
    const assign = line.match(/^\s*(\w+)\s*=/)
    if (assign && !m)
      blocks[assign[1]] = [s, e]
    pendingDecorator = null
  }
  // The header is everything before the first def, decorator, or nested class.
  const first = members.find(([s]) => /^\s*(@|def |class )/.test(lines[s]))
  blocks.header = [classStart, first ? lastNonBlank(lines, classStart, first[0] - 1) : classEnd]
}

/** Remove a block and the blank lines in front of it; trims trailing blank lines. */
export function removeBlock(text, name) {
  const { lines, blocks } = parseBlocks(text)
  const range = blocks[name]
  if (!range)
    throw new Error(`No block "${name}" to remove`)
  let [s, e] = range
  while (s > 0 && isBlank(lines[s - 1])) s--
  const kept = [...lines.slice(0, s), ...lines.slice(e + 1)]
  while (kept.length && isBlank(kept.at(-1))) kept.pop()
  return `${kept.join('\n')}\n`
}

/** Replace a block with the same-named block from another version of the file. */
export function replaceBlock(text, name, otherText) {
  const a = parseBlocks(text)
  const b = parseBlocks(otherText)
  if (!a.blocks[name] || !b.blocks[name])
    throw new Error(`Block "${name}" missing in one of the versions`)
  const [s, e] = a.blocks[name]
  const [os, oe] = b.blocks[name]
  return `${[...a.lines.slice(0, s), ...b.lines.slice(os, oe + 1), ...a.lines.slice(e + 1)].join('\n')}\n`
}

/** Line indexes of `after` that are not part of the longest common subsequence with `before`. */
export function changedLines(before, after) {
  const a = before.replace(/\n$/, '').split('\n')
  const b = after.replace(/\n$/, '').split('\n')
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  }
  const changed = new Set(b.map((_, j) => j))
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      changed.delete(j)
      i++
      j++
    }
    else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++
    }
    else {
      j++
    }
  }
  return changed
}

/** Turn 0-based line indexes into Slidev's `{2,4-6}` highlight syntax. */
export function toRanges(indexes) {
  const sorted = [...indexes].sort((x, y) => x - y).map(i => i + 1)
  const out = []
  for (const n of sorted) {
    const last = out.at(-1)
    if (last && last[1] === n - 1)
      last[1] = n
    else
      out.push([n, n])
  }
  return out.map(([s, e]) => (s === e ? `${s}` : `${s}-${e}`)).join(',')
}
