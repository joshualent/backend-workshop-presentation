import raw from './data/checkpoints.json'

export interface Step {
  /** `branch:path`, unique across the quiz. */
  id: string
  path: string
  hint: string
  /** The file at the previous checkpoint: what the editor starts with. */
  before: string
  /** The file at this checkpoint: the answer. */
  after: string
}

export interface Checkpoint {
  branch: string
  previous: string
  commit: string
  title: string
  steps: Step[]
}

export interface Question extends Step {
  checkpoint: Checkpoint
  /** 1-based position of this file within its part. */
  stepNumber: number
}

export const checkpoints: Checkpoint[] = raw

export const allQuestions: Question[] = checkpoints.flatMap(checkpoint =>
  checkpoint.steps.map((step, i) => ({ ...step, checkpoint, stepNumber: i + 1 })),
)

/**
 * Trailing spaces, line endings, and blank lines at the end of the file
 * don't count. Indentation does, since it matters in Python.
 */
export function normalize(code: string): string {
  return code
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n+$/, '')
}

export interface Score {
  /** Lines of the checkpoint file that are missing from the answer or typed differently. */
  missing: number
  /** Lines of the answer that aren't in the checkpoint file. */
  extra: number
  /** Lines in the checkpoint file. */
  total: number
}

/** Compares line by line, using the longest run of lines the two share. */
export function score(answer: string, expected: string): Score {
  const a = normalize(answer).split('\n')
  const b = normalize(expected).split('\n')
  const row = new Array<number>(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i++) {
    let diagonal = 0
    for (let j = 1; j <= b.length; j++) {
      const above = row[j]
      row[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : Math.max(row[j], row[j - 1])
      diagonal = above
    }
  }
  const common = row[b.length]
  return { missing: b.length - common, extra: a.length - common, total: b.length }
}

export const matches = ({ missing, extra }: Score) => missing === 0 && extra === 0

const lines = (n: number) => `${n} ${n === 1 ? 'line' : 'lines'}`

export function describe(s: Score): string {
  if (matches(s))
    return 'Your file matches the checkpoint.'
  const parts = []
  if (s.missing)
    parts.push(`${s.missing} of the checkpoint's ${s.total} lines ${s.missing === 1 ? 'is' : 'are'} missing or different.`)
  if (s.extra)
    parts.push(`${s.missing ? 'You also have' : 'You have'} ${lines(s.extra)} that ${s.extra === 1 ? "isn't" : "aren't"} in the checkpoint.`)
  return parts.join(' ')
}

/** Short form for the results table. */
export function summarize(s: Score): string {
  if (matches(s))
    return 'Matches'
  return [s.missing && `${s.missing} missing or different`, s.extra && `${s.extra} extra`]
    .filter(Boolean)
    .join(', ')
}

export function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
