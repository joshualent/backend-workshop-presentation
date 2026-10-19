import { useState } from 'react'
import { checkpoints } from './data'

export interface Settings {
  branches: string[]
  order: 'in-order' | 'shuffled'
}

const storageKey = 'practice-settings'

function load(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '') as Settings
    const branches = saved.branches.filter(b => checkpoints.some(c => c.branch === b))
    if (branches.length)
      return { branches, order: saved.order === 'shuffled' ? 'shuffled' : 'in-order' }
  }
  catch {}
  return { branches: checkpoints.map(c => c.branch), order: 'in-order' }
}

export default function Start({ onStart }: { onStart: (settings: Settings) => void }) {
  const [settings, setSettings] = useState(load)
  const { branches, order } = settings

  const toggle = (branch: string) =>
    setSettings({
      ...settings,
      // Keep the workshop's order no matter which order they were ticked in.
      branches: checkpoints
        .map(c => c.branch)
        .filter(b => (b === branch) !== branches.includes(b)),
    })

  const count = checkpoints
    .filter(c => branches.includes(c.branch))
    .reduce((n, c) => n + c.steps.length, 0)

  const start = () => {
    localStorage.setItem(storageKey, JSON.stringify(settings))
    onStart(settings)
  }

  return (
    <main className="start">
      <h1>Checkpoint code quiz</h1>
      <p className="lead">
        Each question opens one file as it is at the previous checkpoint. Type the
        changes for the part, then press Check to compare your file with the
        checkpoint branch.
      </p>

      <fieldset>
        <legend>Checkpoints</legend>
        {checkpoints.map(c => (
          <label key={c.branch} className="checkpoint">
            <input
              type="checkbox"
              checked={branches.includes(c.branch)}
              onChange={() => toggle(c.branch)}
            />
            <span>
              <strong>{c.title}</strong>
              <code className="branch">{c.branch}</code>
              <span className="files">
                {c.steps.map(s => s.path).join(', ')}
              </span>
            </span>
          </label>
        ))}
        <div className="row">
          <button
            type="button"
            className="link"
            onClick={() => setSettings({ ...settings, branches: checkpoints.map(c => c.branch) })}
          >
            Select all
          </button>
          <button
            type="button"
            className="link"
            onClick={() => setSettings({ ...settings, branches: [] })}
          >
            Clear
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Order</legend>
        <label className="option">
          <input
            type="radio"
            name="order"
            checked={order === 'in-order'}
            onChange={() => setSettings({ ...settings, order: 'in-order' })}
          />
          In order, as you type them in the workshop
        </label>
        <label className="option">
          <input
            type="radio"
            name="order"
            checked={order === 'shuffled'}
            onChange={() => setSettings({ ...settings, order: 'shuffled' })}
          />
          Shuffled
        </label>
      </fieldset>

      <button type="button" className="primary" disabled={!count} onClick={start}>
        Start the quiz
        {count > 0 && ` (${count} ${count === 1 ? 'file' : 'files'})`}
      </button>
    </main>
  )
}
