import { useState } from 'react'
import { allQuestions, shuffle, type Question } from './data'
import Results, { type Result } from './Results'
import Quiz from './Quiz'
import Start, { type Settings } from './Start'

type Screen =
  | { name: 'start' }
  | { name: 'quiz', questions: Question[], run: number }
  | { name: 'results', results: Result[] }

function pick(settings: Settings): Question[] {
  const chosen = allQuestions.filter(q => settings.branches.includes(q.checkpoint.branch))
  return settings.order === 'shuffled' ? shuffle(chosen) : chosen
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })

  if (screen.name === 'quiz') {
    return (
      <Quiz
        // A new key starts a fresh quiz even when the questions repeat.
        key={screen.run}
        questions={screen.questions}
        onFinish={results => setScreen({ name: 'results', results })}
        onQuit={() => setScreen({ name: 'start' })}
      />
    )
  }

  if (screen.name === 'results') {
    return (
      <Results
        results={screen.results}
        onRetry={questions => setScreen({ name: 'quiz', questions, run: Date.now() })}
        onStart={() => setScreen({ name: 'start' })}
      />
    )
  }

  return <Start onStart={settings => setScreen({ name: 'quiz', questions: pick(settings), run: Date.now() })} />
}
