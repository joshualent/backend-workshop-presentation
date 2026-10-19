# Checkpoint code quiz

A small local app for memorizing the code you type in each part of the
workshop. Each question opens one file as it is at the previous checkpoint
branch, in a Monaco editor. Type the part's changes, press **Check**
(or Ctrl+Enter), and you get a side-by-side diff of your file against the
checkpoint branch.

```bash
cd practice
pnpm install    # once
pnpm dev        # http://localhost:5173
```

On the start page, pick one or more parts, and choose whether the files come
in workshop order or shuffled. Your choice is remembered.

What counts as a match: trailing spaces and blank lines at the end of the
file are ignored. Indentation counts, since it matters in Python.

## Where the code comes from

`src/data/checkpoints.json` holds every file you edit in each part, before
and after, copied from the checkpoint branches of
[joshualent/questions-api](https://github.com/joshualent/questions-api).
Migrations are left out because `makemigrations` writes them. If the
workshop code changes, refresh the file:

```bash
pnpm extract                        # reads ../vendor/questions-api
pnpm extract /path/to/questions-api # or any other clone
```

The script fetches the clone, reads the `origin/` branches, and stops with
an error if a part changes a file that isn't in its list of steps in
`scripts/extract.mjs`.
