import { DiffEditor, Editor, type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor/editor/editor.api'
import { useEffect, useRef, useState } from 'react'
import { describe, matches, score, type Question } from './data'
import type { Result } from './Results'

interface Props {
  questions: Question[]
  onFinish: (results: Result[]) => void
  onQuit: () => void
}

const editorOptions = {
  fontSize: 15,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 4,
  insertSpaces: true,
  detectIndentation: false,
  // No suggestions built from words already in the file: that would give answers away.
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  wordBasedSuggestions: 'off',
} as const

export default function Quiz({ questions, onFinish, onQuit }: Props) {
  const [index, setIndex] = useState(0)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [checks, setChecks] = useState<Record<string, number>>({})
  const [checking, setChecking] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
  // Monaco keeps one model per path, so a draft (and its undo history)
  // survives a trip to the diff. The run id keeps a new quiz from reusing
  // drafts from the last one.
  const [run] = useState(() => Date.now())

  const question = questions[index]
  const draft = drafts[question.id] ?? question.before
  const last = index === questions.length - 1
  const result = score(draft, question.after)

  const check = () => {
    setChecks(c => ({ ...c, [question.id]: (c[question.id] ?? 0) + 1 }))
    setChecking(true)
  }

  const next = () => {
    if (last) {
      onFinish(questions.map(q => ({
        question: q,
        answer: drafts[q.id] ?? q.before,
        checks: checks[q.id] ?? 0,
      })))
      return
    }
    setIndex(index + 1)
    setChecking(false)
    setShowHint(false)
  }

  // Ctrl+Enter (Cmd+Enter on a Mac) checks, then goes on to the next file.
  // The ref keeps Monaco's command pointing at the latest handlers.
  const shortcut = useRef(() => {})
  shortcut.current = checking ? next : check
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        shortcut.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => shortcut.current())
    editor.focus()
  }

  // An edit rather than setValue, so Ctrl+Z can bring the draft back.
  const reset = () => {
    const editor = editorRef.current
    const model = editor?.getModel()
    if (!editor || !model)
      return
    editor.executeEdits('reset', [{ range: model.getFullModelRange(), text: question.before }])
    editor.focus()
  }

  const { checkpoint } = question

  return (
    <main className="quiz">
      <header>
        <div className="progress">
          <span>Question {index + 1} of {questions.length}</span>
          <button type="button" className="link" onClick={onQuit}>Quit</button>
        </div>
        <h2>
          <code>{question.path}</code>
        </h2>
        <p className="meta">
          {checkpoint.title}, file {question.stepNumber} of {checkpoint.steps.length}.
          {' '}The editor starts from <code>{checkpoint.previous}</code>; make it
          match <code>{checkpoint.branch}</code>.
        </p>
        {showHint
          ? <p className="hint">{question.hint}</p>
          : <button type="button" className="link" onClick={() => setShowHint(true)}>Show hint</button>}
      </header>

      {checking
        ? (
            <>
              <p className={matches(result) ? 'verdict right' : 'verdict wrong'}>
                {describe(result)}
              </p>
              <div className="labels">
                <span>Your file</span>
                <span>{checkpoint.branch}</span>
              </div>
              <div className="editor">
                <DiffEditor
                  key={question.id}
                  original={draft}
                  modified={question.after}
                  language="python"
                  theme="vs-dark"
                  keepCurrentOriginalModel
                  keepCurrentModifiedModel
                  options={{
                    ...editorOptions,
                    readOnly: true,
                    originalEditable: false,
                    renderSideBySide: true,
                    useInlineViewWhenSpaceIsLimited: false,
                    ignoreTrimWhitespace: false,
                    renderOverviewRuler: false,
                  }}
                  onMount={(editor, monaco) => {
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => shortcut.current())
                  }}
                />
              </div>
              <div className="actions">
                <button type="button" onClick={() => setChecking(false)}>Edit again</button>
                <button type="button" className="primary" onClick={next}>
                  {last ? 'See results' : 'Next file'}
                </button>
                <span className="key">Ctrl+Enter</span>
              </div>
            </>
          )
        : (
            <>
              <div className="editor">
                <Editor
                  path={`file:///${run}/${question.id.replace(':', '/')}`}
                  defaultValue={question.before}
                  keepCurrentModel
                  language="python"
                  theme="vs-dark"
                  options={editorOptions}
                  onChange={value => setDrafts(d => ({ ...d, [question.id]: value ?? '' }))}
                  onMount={onMount}
                />
              </div>
              <div className="actions">
                <button type="button" onClick={reset}>Reset the file</button>
                <button type="button" className="primary" onClick={check}>Check</button>
                <span className="key">Ctrl+Enter</span>
              </div>
            </>
          )}
    </main>
  )
}
