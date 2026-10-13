#!/usr/bin/env node
/**
 * Checks that the code and responses on the slides are the real ones.
 *
 *   node scripts/check-code.mjs
 *
 * 1. Every file in slides/snippets/ matches its checkpoint branch in
 *    vendor/questions-api (skipped, with a warning, if the clone is missing).
 * 2. The generated Magic Move / code-window blocks and notes/cheat-sheet.md
 *    are up to date with the snippets.
 * 3. Every `<<<` snippet import exists, and its highlighted lines exist, aren't
 *    blank, and contain what the slide is pointing at.
 * 4. Every request/response pair on a slide (the <Exchange> rows) is one of
 *    the real responses from plan section 2, checked by scripts/verify-responses.sh.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const snippets = join(root, 'slides', 'snippets')
const pagesDir = join(root, 'slides', 'pages')
const repo = join(root, 'vendor', 'questions-api')
const problems = []

// 1. snippets vs. branches
const walk = dir => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : [p]
})
if (existsSync(join(repo, '.git'))) {
  let checked = 0
  for (const file of walk(snippets)) {
    const rel = relative(snippets, file)
    const [branch, ...rest] = rel.split('/')
    if (!branch.startsWith('checkpoint-') || rest.join('/') === 'tree.txt')
      continue
    const real = execFileSync('git', ['-C', repo, 'show', `refs/remotes/origin/${branch}:${rest.join('/')}`]).toString()
    if (real !== readFileSync(file, 'utf8'))
      problems.push(`slides/snippets/${rel} differs from ${branch}`)
    checked++
  }
  console.log(`Snippets: ${checked} files match their branches`)
}
else {
  console.warn('! vendor/questions-api is missing: run scripts/extract-snippets.sh to compare snippets with the branches')
}

// 2. generated blocks
for (const script of ['build-code-blocks.mjs', 'build-cheat-sheet.mjs']) {
  try {
    console.log(execFileSync('node', [join(root, 'scripts', script), '--check']).toString().trim())
  }
  catch (e) {
    problems.push(`${script} --check failed: ${e.stdout?.toString().trim() || e.message}`)
  }
}

// 3. snippet imports and their highlights. What each highlighted line must contain,
// by snippet path and line number, e.g. { 'checkpoint-1-crud/questions/views.py': { 11: 'AllowAny' } }.
// No slide imports a snippet in this version of the deck; the check stays for any that do.
const EXPECT = {}
const pages = readdirSync(pagesDir).filter(f => f.endsWith('.md'))
let imports = 0
for (const name of pages) {
  const text = readFileSync(join(pagesDir, name), 'utf8')
  for (const m of text.matchAll(/^<<< @\/snippets\/(\S+)(?: \{([^}]*)\})?/gm)) {
    imports++
    const [, path, ranges] = m
    const file = join(snippets, path)
    if (!existsSync(file)) {
      problems.push(`${name}: <<< ${path} doesn't exist`)
      continue
    }
    const lines = readFileSync(file, 'utf8').replace(/\n$/, '').split('\n')
    for (const part of (ranges ?? '').split('|')) {
      if (!part || part === '*')
        continue
      for (const r of part.split(',')) {
        const [a, b = a] = r.split('-').map(Number)
        for (let n = a; n <= b; n++) {
          if (n < 1 || n > lines.length || !lines[n - 1].trim())
            problems.push(`${name}: ${path} highlights line ${n}, which is ${n > lines.length ? 'past the end' : 'blank'}`)
          const want = EXPECT[path]?.[n]
          if (want && !lines[n - 1]?.includes(want))
            problems.push(`${name}: ${path} line ${n} should contain "${want}" but is "${lines[n - 1]?.trim()}"`)
        }
      }
    }
  }
}
console.log(`Snippet imports: ${imports} checked`)

// 4. responses on slides: status + body must be a real pair (plan section 2)
const REAL = new Map([
  ['201', ['{"id": 1, "text": "What does a serializer do?", "votes": 0, …}', '{"id": 2, "text": "hi", "votes": 0, …}']],
  ['400', ['{"text": ["This field may not be blank."]}']],
  ['404', ['{"detail": "No Question matches the given query."}']],
  ['200', [
    '{"id": 1, …, "votes": 1, "answered": false, …}',
    '{"id": 1, …, "votes": 2, "answered": false, …}',
    '{"id": 1, …, "votes": 2, "answered": true, …}',
    '"votes": 1',
    '"votes": 2',
    '"votes": 3',
    '"votes": 0',
  ]],
])
let pairs = 0
for (const name of pages) {
  const text = readFileSync(join(pagesDir, name), 'utf8')
  for (const m of text.matchAll(/<Exchange\b([^>]*)\/>/g)) {
    pairs++
    const attrs = m[1]
    const status = (attrs.match(/:status="(\d+)"/) || [])[1]
    const response = (attrs.match(/response='([^']*)'/) || [])[1]
    if (response && !(REAL.get(status) ?? []).includes(response))
      problems.push(`${name}: ${status} with ${response} isn't a known real response (scripts/verify-responses.sh)`)
  }
}
console.log(`Responses: ${pairs} request/response rows checked`)

if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):`)
  problems.forEach(p => console.log(`  - ${p}`))
  process.exit(1)
}
console.log('✓ code and responses on the slides match the workshop repo')
