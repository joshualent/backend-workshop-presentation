/**
 * Code shown on slides that isn't a whole file: Magic Move steps and windows
 * into a file. scripts/build-code-blocks.mjs turns each entry into markdown
 * between `<!-- code-block: <id> -->` and `<!-- /code-block -->` in
 * slides/pages/*.md. Code always comes from slides/snippets/ (the real
 * checkpoint files), never from this file.
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
const cp2 = 'checkpoint-2-actions'
const cp3 = 'checkpoint-3-auth'
const cp4 = 'checkpoint-4-m2m'

export default {
  // Plan slide 14: the fields line up with columns, one click each.
  'models-fields': {
    steps: [{
      file: `${cp1}/questions/models.py`,
      window: ['header', 'header'],
      highlight: ['*', { match: 'text =' }, { match: 'votes =' }, { match: 'answered =' }, { match: 'created_at =' }, '*'],
    }],
  },

  // Plan slide 18: the ViewSet the router reads.
  'viewset-cp1': {
    steps: [{ file: `${cp1}/questions/views.py`, window: ['header', 'header'], highlight: false }],
  },

  // Plan slide 24: the decorator that shapes the URL.
  'upvote-decorator': {
    steps: [{ file: `${cp2}/questions/views.py`, window: ['upvote', 'upvote'], lines: 2, highlight: false }],
  },

  // Plan slide 25: views.py, checkpoint 1 → 2. Imports, then upvote, then toggle_answered.
  'views-1-to-2': {
    magicMove: true,
    steps: [
      { file: `${cp1}/questions/views.py`, highlight: false },
      { file: `${cp2}/questions/views.py`, remove: ['upvote', 'toggle_answered'] },
      { file: `${cp2}/questions/views.py`, remove: ['toggle_answered'], window: ['header', 'upvote'] },
      { file: `${cp2}/questions/views.py`, window: ['upvote', 'toggle_answered'] },
    ],
  },

  // Plan slide 33: views.py, checkpoint 2 → 3. Imports, get_permissions + upvote, toggle_answered.
  'views-2-to-3': {
    magicMove: true,
    steps: [
      { file: `${cp2}/questions/views.py`, window: ['imports', 'header'], highlight: false },
      { file: `${cp2}/questions/views.py`, use: { imports: `${cp3}/questions/views.py` }, window: ['imports', 'header'] },
      { file: `${cp3}/questions/views.py`, use: { toggle_answered: `${cp2}/questions/views.py` }, window: ['get_permissions', 'upvote'] },
      { file: `${cp3}/questions/views.py`, window: ['upvote', 'toggle_answered'] },
    ],
  },

  // Plan slide 33, last click: the one-line config/urls.py change.
  'urls-cp3': {
    steps: [{ file: `${cp3}/config/urls.py`, window: ['urlpatterns', 'urlpatterns'], highlight: 'changes', against: `${cp2}/config/urls.py` }],
  },

  // Plan slide 38: IntegerField → ManyToManyField.
  'models-3-to-4': {
    magicMove: true,
    steps: [
      { file: `${cp3}/questions/models.py`, window: ['start', 'header'], highlight: false },
      { file: `${cp4}/questions/models.py`, window: ['start', 'header'] },
    ],
  },

  // Plan slide 39: the serializer keeps "votes" an integer.
  'serializer-cp4': {
    steps: [{ file: `${cp4}/questions/serializers.py`, window: ['class', 'class'], highlight: 'changes', against: `${cp3}/questions/serializers.py` }],
  },

  // Appendix projector check: one highlighted line, two dimmed ones, short enough for half the slide.
  'projector-check': {
    steps: [{ file: `${cp1}/questions/models.py`, window: ['header', 'header'], lines: 3, highlight: [{ match: 'text =' }] }],
  },

  // Appendix: the finished views.py and migration 0002, in windows that fit at 18 px.
  'final-views-1': { steps: [{ file: `${cp4}/questions/views.py`, window: ['imports', 'header'], highlight: false }] },
  'final-views-2': { steps: [{ file: `${cp4}/questions/views.py`, window: ['get_permissions', 'toggle_vote'], highlight: false }] },
  'final-views-3': { steps: [{ file: `${cp4}/questions/views.py`, window: ['toggle_answered', 'toggle_answered'], highlight: false }] },
  'final-migration-1': { steps: [{ file: `${cp4}/questions/migrations/0002_votes_many_to_many.py`, window: ['start', 'dependencies'], highlight: false }] },
  'final-migration-2': { steps: [{ file: `${cp4}/questions/migrations/0002_votes_many_to_many.py`, window: ['operations', 'operations'], highlight: false }] },

  // Plan slide 40: upvote becomes toggle_vote.
  'upvote-to-toggle': {
    magicMove: true,
    steps: [
      { file: `${cp3}/questions/views.py`, window: ['upvote', 'upvote'], highlight: false },
      { file: `${cp4}/questions/views.py`, window: ['toggle_vote', 'toggle_vote'], highlight: false },
    ],
  },
}
