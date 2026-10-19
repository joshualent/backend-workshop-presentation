import { matches, score, summarize, type Question } from './data'

export interface Result {
  question: Question
  answer: string
  /** How many times Check was pressed. */
  checks: number
}

interface Props {
  results: Result[]
  onRetry: (questions: Question[]) => void
  onStart: () => void
}

export default function Results({ results, onRetry, onStart }: Props) {
  const missed = results.filter(r => !matches(score(r.answer, r.question.after)))
  const matched = results.length - missed.length

  return (
    <main className="start">
      <h1>Results</h1>
      <p className="lead">
        {matched} of {results.length} {results.length === 1 ? 'file matches' : 'files match'} the checkpoint.
      </p>

      <table className="results">
        <thead>
          <tr><th>Checkpoint</th><th>File</th><th>Result</th><th>Checks</th></tr>
        </thead>
        <tbody>
          {results.map(({ question, answer, checks }) => {
            const result = score(answer, question.after)
            return (
              <tr key={question.id}>
                <td><code>{question.checkpoint.branch}</code></td>
                <td><code>{question.path}</code></td>
                <td className={matches(result) ? 'right' : 'wrong'}>{summarize(result)}</td>
                <td>{checks}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="actions">
        {missed.length > 0 && (
          <button type="button" className="primary" onClick={() => onRetry(missed.map(r => r.question))}>
            Retry the {missed.length} that {missed.length === 1 ? "doesn't" : "don't"} match
          </button>
        )}
        <button type="button" onClick={() => onRetry(results.map(r => r.question))}>Retry all</button>
        <button type="button" onClick={onStart}>Back to start</button>
      </div>
    </main>
  )
}
