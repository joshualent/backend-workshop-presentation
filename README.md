# Questions API workshop: slides and notes

The deck and presenter notes for the Developer Club backend workshop, **Build a Q&A API with Python & Django** (Monday, October 19, 2026, 6:30–8:30 PM, Floyd Hall D-109). Attendees code along with [joshualent/questions-api](https://github.com/joshualent/questions-api); every line of code on a slide comes from that repo's checkpoint branches.

[`PLAN.md`](PLAN.md) is the source of truth: run of show, code at each checkpoint, every slide, visual and motion rules, and the build phases.

**This is the `dev` branch: the slim version of the deck.** With one projector, the slides are the presentation aid between coding stretches, not a second place to read code. So no slide's main job is showing code: the slides cover the opening, the concepts each lesson needs, and the close, and the code happens in VS Code. Each concept slide's notes run the coding stretch that follows it, and `notes/cheat-sheet.md` has every line to type. The full plan-by-plan deck (46 slides, with code slides and Magic Move) is on `main`. `notes/presenter-flow.md` lists what moved where.

## What's here

| Path | What |
|---|---|
| `slides/` | The Slidev deck: `slides.md` (settings) and `pages/` (28 show slides plus a 6-slide hidden appendix), components, styles, and the rendered videos in `public/media/videos/`. |
| `slides/questions-api-workshop.pdf` | PDF backup: every slide at its final state, videos as their final frames. |
| `slides/snippets/` | Real files from each checkpoint branch, plus each checkpoint's diff. Generated; don't edit. |
| `animations/` | Sources for the three explainer videos (HTML + GSAP) and the script that renders them. |
| `notes/presenter-flow.md` | Minute-by-minute run of show: clock, slide, mode, switches, time checks, cuts. |
| `notes/cheat-sheet.md` | Everything you type or paste, in order, by lesson, and which slide it follows. Generated from the checkpoint diffs. |
| `notes/screen-setup.md` | Displays, window switching, VS Code and browser setup, and the pre-talk checklist. |
| `scripts/` | Snippet extraction, the cheat-sheet generator (and the code-block generator, used only by the projector check now), and the code and response checks. |

## Requirements

Node 22+ with pnpm, Git, FFmpeg (videos only), and uv (response checks only). Install once, with network:

```bash
cd slides && pnpm install
cd ../animations && pnpm install   # only to re-render the videos
```

Playwright's Chromium is used by PDF export, QA, and video rendering. If it isn't cached yet: `cd slides && npx playwright-core install chromium chromium-headless-shell`.

## Run and present

```bash
cd slides
pnpm dev        # live-reloading deck at http://localhost:3030
pnpm build      # static deck in dist/
pnpm serve      # serves dist/ offline at http://localhost:3031
```

Present from the built copy: projector window at `http://localhost:3031/#/1`, presenter view on the laptop at `http://localhost:3031/#/presenter/1`, both in the same browser so they stay in sync. Everything (fonts, videos, QR codes) is local; the deck runs with Wi-Fi off.

Keys: `→`/`Space`/clicker for the next click, `←` back, `g` then a number to jump, `o` for the overview. The clicker and arrow keys skip the hidden appendix (slides 32–38); reach it with `g` (slide 32 lists it). `?projector` in the URL (or `p` in `pnpm dev`) applies the weak-projector simulation from plan section 5.1.

Each slide's `plan:` frontmatter lists the `PLAN.md` slides it stands for: `13`, or `14–15` when a concept slide's notes now carry the code slide that followed it. The presenter view shows the tag in each slide's corner, and `pnpm qa` checks that every plan slide from 0 to 45 is covered exactly once.

Why not `hide: true` for the appendix: Slidev 53 removes hidden slides when it parses the deck, so they couldn't be shown during the talk. Appendix slides use `backstage: true` and a keyboard guard in `slides/setup/shortcuts.ts` instead.

## Export the PDF

```bash
cd slides
pnpm export     # writes questions-api-workshop.pdf
```

## Refresh the code from the workshop repo

```bash
scripts/extract-snippets.sh
```

This clones (or fetches) `joshualent/questions-api` into `vendor/questions-api`, copies every changed file at every checkpoint into `slides/snippets/`, writes the diffs, and regenerates `notes/cheat-sheet.md` and the projector check's code sample (between `<!-- code-block: … -->` markers, defined in `scripts/code-blocks.config.mjs`). If the workshop repo changes, that's the only step; then rebuild.

## Re-render the videos

```bash
cd animations
pnpm render                                  # all three, 1920 × 1080, 30 fps
node render.mjs v2-life-of-a-post --stops    # just a contact sheet of the stops, for review
```

Each video writes `<name>.mp4`, `.webm`, and `.png` (the final frame) to `slides/public/media/videos/`, and its stop times to `slides/data/videos.json`, which the stepped player reads. See [`animations/README.md`](animations/README.md).

## Checks

```bash
node scripts/check-code.mjs      # snippets match the branches; generated blocks and cheat sheet are current;
                                 # every response on a slide is real
scripts/verify-responses.sh      # runs every request from plan section 2 against each checkpoint, plus
                                 # lesson 4's in-between state ("votes": [] before the serializer line)
cd slides && pnpm build && pnpm serve   # then, in another terminal:
pnpm qa                          # plan coverage, notes format and clock, video stops, plan 5.2 style rules,
                                 # offline, navigation, click counts vs. [click] markers, appendix, presenter view
pnpm shots --projector           # screenshots of every slide with the projector simulation, in shots/
                                 # (against pnpm dev; add --url http://localhost:3031 for the build)
```

## Before the event

Fill in the placeholders in `slides/workshop.config.ts` (plan section 11): the Developer Club logo file, the next event, the resource-list URL for the "where to go next" QR code, and whether there's a public instance. Until then the slides show dashed placeholder boxes, and `pnpm qa` lists what's left. Then work through the checklist at the end of `notes/screen-setup.md`.
