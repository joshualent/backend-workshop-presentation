/**
 * Code shown on slides that isn't a whole file: Magic Move steps and windows
 * into a file. scripts/build-code-blocks.mjs turns each entry into markdown
 * between `<!-- code-block: <id> -->` and `<!-- /code-block -->` in
 * slides/pages/*.md. Code always comes from slides/snippets/ (the real
 * checkpoint files), never from this file.
 *
 * In this version of the deck no slide is about code: the code lives in
 * VS Code and notes/cheat-sheet.md. The only block left is the projector
 * check's sample. The step fields below still work if a slide needs one.
 *
 * Step fields:
 *   file       snippet path under slides/snippets/
 *   remove     blocks to take out (an intermediate state between two checkpoints)
 *   use        { block: otherFile } swaps a block in from another checkpoint
 *   window     [fromBlock, toBlock]: show only that part (default: whole file)
 *   highlight  'changes' (lines that differ from the previous step, or from
 *              `against`), false, or a list of highlight steps for clicks:
 *              '*' or { match: 'text' } (lines containing text)
 *   against    file to compare with for 'changes' on the first step
 *
 * Block names are explained in scripts/lib/python-blocks.mjs.
 */

const cp1 = 'checkpoint-1-crud'

export default {
  // Appendix projector check: one highlighted line, two dimmed ones, short enough for half the slide.
  'projector-check': {
    steps: [{ file: `${cp1}/questions/models.py`, window: ['header', 'header'], lines: 3, highlight: [{ match: 'text =' }] }],
  },
}
