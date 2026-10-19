#!/usr/bin/env node
/**
 * Writes src/data/checkpoints.json: for every file you edit in each part,
 * the file as it is before the part (the previous checkpoint branch) and
 * after it (the part's checkpoint branch), read straight from
 * joshualent/questions-api so the quiz can't drift from the workshop code.
 *
 *   pnpm extract                        # uses ../vendor/questions-api
 *   pnpm extract /path/to/questions-api
 *
 * The clone is fetched first, and files are read from its origin/ refs.
 * Migrations are left out: makemigrations writes them.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(process.argv[2] ?? join(here, '..', '..', 'vendor', 'questions-api'))
const target = join(here, '..', 'src', 'data', 'checkpoints.json')

if (!existsSync(join(repo, '.git'))) {
  console.error(`No git clone at ${repo}. Clone it first:\n  git clone https://github.com/joshualent/questions-api.git ${repo}`)
  process.exit(1)
}

const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' })

// Each part's steps, in the order you type them during the workshop.
const checkpoints = [
  {
    branch: 'checkpoint-1-crud',
    title: 'Part 1: Our model becomes a table',
    steps: [
      ['questions/models.py', 'Replace the stub with the Question model.'],
      ['questions/serializers.py', 'The file exists but is empty. Write the serializer.'],
      ['questions/views.py', 'Replace the stub with the ViewSet.'],
      ['config/urls.py', 'Add the imports, the router, and the api/ line.'],
    ],
  },
  {
    branch: 'checkpoint-2-actions',
    title: 'Part 2: How should voting work?',
    steps: [
      ['questions/views.py', 'Two new imports at the top, then the upvote and toggle_answered actions at the end of QuestionViewSet.'],
    ],
  },
  {
    branch: 'checkpoint-3-auth',
    title: 'Part 3: Who can do what',
    steps: [
      ['questions/views.py', 'One new import line, get_permissions right after serializer_class, and a permission_classes argument on each @action.'],
      ['config/urls.py', 'One new line at the end of urlpatterns, for the browsable API\'s log in page.'],
    ],
  },
  {
    branch: 'checkpoint-4-m2m',
    title: 'Part 4: One vote per user',
    steps: [
      ['questions/models.py', 'Import settings and change votes to a ManyToManyField of users.'],
      ['questions/serializers.py', 'Two fields above class Meta, has_voted in fields, and the get_has_voted method.'],
      ['questions/views.py', 'upvote becomes toggle_vote, which adds or removes the logged-in user.'],
    ],
  },
]

git('fetch', '--quiet', '--prune', 'origin')

const show = (branch, path) => git('show', `origin/${branch}:${path}`)

let previous = 'checkpoint-0-setup'
const data = checkpoints.map(({ branch, title, steps }) => {
  const changed = git('diff', '--name-only', `origin/${previous}`, `origin/${branch}`).split('\n').filter(Boolean)
  const expected = changed.filter(path => !path.includes('/migrations/')).sort()
  const listed = steps.map(([path]) => path).sort()
  if (expected.join() !== listed.join())
    throw new Error(`${branch} changes ${expected.join(', ')}, but the steps list ${listed.join(', ')}. Update the steps in scripts/extract.mjs.`)

  const out = {
    branch,
    previous,
    commit: git('rev-parse', '--short', `origin/${branch}`).trim(),
    title,
    steps: steps.map(([path, hint]) => ({
      id: `${branch}:${path}`,
      path,
      hint,
      before: show(previous, path),
      after: show(branch, path),
    })),
  }
  previous = branch
  return out
})

writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`)
console.log(`Wrote ${target}`)
for (const c of data)
  console.log(`  ${c.branch} (${c.commit}): ${c.steps.map(s => s.path).join(', ')}`)
