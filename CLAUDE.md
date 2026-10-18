# Questions API workshop slides

Slidev deck and presenter notes for the Developer Club backend workshop: a live code-along that builds a Q&A REST API with Django and Django REST Framework (Monday, October 19, 2026, 6:30–8:30 PM, Floyd Hall D-109).

**Start here:** read `PLAN.md` in full before doing anything. It is the source of truth for the run of show, the code at each checkpoint, every slide, visual rules, motion rules, presenter notes, and build phases.

## The workshop code

- Repo: https://github.com/joshualent/questions-api (Python 3.14, Django 6.1, DRF 3.18, uv).
- Checkpoint branches, in order: `checkpoint-0-setup` (= `main`), `checkpoint-1-crud`, `checkpoint-2-actions`, `checkpoint-3-auth`, `checkpoint-4-m2m`.
- Clone it as a read-only reference at `vendor/questions-api` (gitignored). Code on slides comes from these branches through `scripts/extract-snippets.sh`, never retyped.
- Commands in the deck use `uv run manage.py …`, matching the workshop README.

## Standing rules

- **Minimal styling.** One solid dark background on every slide. No background patterns, textures, gradients, or ambient animation, especially not deck-wide. Color only carries meaning: one accent for focus, plus HTTP method and status colors.
- **No generic AI slide patterns.** That means no all-caps letter-spaced eyebrow labels, no callouts with rounded colored left borders, no icon-card grids, emoji, fake window chrome, gradient text, or glows. The full list is in plan section 5.2. Check every slide against it.
- **Motion:** one normal deck-wide slide transition (a quick fade). Click builds and Shiki Magic Move for most teaching. Pre-rendered explainer videos only for V1–V3 in plan section 6.3, where motion is the point. Don't add more without asking.
- **Front-loaded concepts:** at most 12 slides and about 20 minutes. Propose cuts rather than adding intro slides.
- **Projector:** respect the minimum sizes in plan section 5.1 and keep every slide readable with the projector-simulation toggle on.
- **Offline at runtime:** fonts, videos, and QR codes are local files. No CDNs.
- **Never iframe the Django app.** It sends `X-Frame-Options: DENY`. Notes tell the presenter to switch to the browser.
- **Every slide gets presenter notes** in plan section 8.1's format, with explicit `→ SWITCH TO …` lines and click markers.
- **Real responses only.** Status codes and JSON on slides must match plan section 2.
- **Stop at each review checkpoint** in plan section 10 and wait for the presenter's sign-off.
- Use placeholders for the inputs in plan section 11 until the presenter provides them.

## Commands

```bash
cd slides && pnpm install          # once (Node 22+, pnpm)
cd slides && pnpm dev              # dev server, http://localhost:3030
cd slides && pnpm build && pnpm serve   # offline build, http://localhost:3031
cd slides && pnpm export           # PDF backup: slides/questions-api-workshop.pdf
cd slides && pnpm qa               # against pnpm serve; notes, clock, clicks, offline, style rules
cd slides && pnpm shots --projector    # screenshots in slides/shots/ (dev server; --url for the build)
scripts/extract-snippets.sh        # refresh snippets, Magic Move blocks, and notes/cheat-sheet.md
node scripts/check-code.mjs        # code and responses on slides match the workshop repo
scripts/verify-responses.sh        # run plan section 2's requests against every checkpoint (needs uv)
cd animations && pnpm render       # re-render V1–V3 into slides/public/media/videos (FFmpeg)
```

## How the deck is built (decisions already made)

- **This branch (`next`) builds the deck around the run of show.** The night has five parts: setup while people arrive (6:30–7:00), the opening (title and *Check your setup*), the API basics, four lessons with a break after lesson 2, and the wrap-up. Each lesson has one or two slides before its code. Then the code runs in VS Code and the browser until the lesson's checkpoint works, with **no slides in between**; don't add a slide inside a coding stretch or a slide that presents a snippet (small inline identifiers are fine). The lesson's first slide holds the notes for the whole coding stretch, with a clock time on each `→ SWITCH TO` line, and `notes/cheat-sheet.md` has the code. `dev` has the earlier 28-slide version; `main` has the full plan-by-plan deck.
- Each lesson's browser check ends by showing the problem the next lesson fixes, and the next lesson's first slide (titled "Lesson N: …") starts from it. There are no "What's still broken?" slides. The first slide of lessons 2–4 and the halfway break end with `<CatchUp branch="…">`, the one line to run if you're behind.
- Each show slide has a `part:` (Setup, Opening, API basics, Lesson 1–4, Halfway, Wrap-up; Appendix for backstage). The presenter view shows it, and `pnpm qa` checks that each part starts at its time in `PARTS` in `slides/scripts/qa-deck.mjs` and that the show ends at 8:30.
- Don't mention helpers on slides or in the notes as if they'll be there: the presenter may be the only one helping. "Walk the room", "ask the person next to you", and "put your hand up" are fine.
- The diagram of the API's parts (`RequestMap`, `BuiltMap`, and video V2) follows the request: the client on the left (or top), SQLite on the right (or bottom). We build it right to left; the presenter tried build order and preferred this.
- The HTTP slides go from small to whole: *Resources and URLs* (which names REST), then *HTTP methods* (the six routes, built row by row), then *Anatomy of a request* (status code families only, ending on the one-sentence summary of REST). Specific status codes come up in the browser during the lessons, and 403 is also on the lesson 3 slide; the backstage *Status codes in our API* lists them all. The route table appears only once.
- Slide text is plain and literal: whole sentences with one idea each, active voice, no slogans or comma-spliced fragments like "Same API, no browser".
- The hidden appendix uses `backstage: true`, not `hide: true` (Slidev 53 drops hidden slides at parse time). `setup/shortcuts.ts` makes the clicker skip them; reach them with `g`.
- Code that isn't a whole file is generated between `<!-- code-block: id -->` markers from `scripts/code-blocks.config.mjs`; never edit inside the markers. Only the projector check uses one on this branch.
- Stepped videos: stop times live in `slides/data/videos.json` (written by `animations/render.mjs`); the slide's `clicks:` must equal stops − 1, and notes give a timestamp per stop.
- Event inputs and placeholders live in `slides/workshop.config.ts`.
