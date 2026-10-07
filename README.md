# Backend Workshop: slides and presenter notes

Slides, presenter notes, and animation sources for the Developer Club backend workshop: a live code-along that builds a Q&A board REST API with Django and Django REST Framework.

**Monday, October 19, 2026 · 6:30–8:30 PM · Floyd Hall D-109**

- Plan and source of truth: [`docs/presentation-plan.md`](docs/presentation-plan.md)
- Starter repo attendees clone: [joshualent/questions-api](https://github.com/joshualent/questions-api) (checkpoint branches `tier-1-done`, `tier-2-auth`, `tier-3-m2m`)

## Run it

Requires Node 22+ and pnpm. Everything below runs from `slides/`.

```bash
cd slides
pnpm install
pnpm dev            # live-reloading deck at http://localhost:3030, presenter view at /#/presenter/1
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload (port 3030). `p` toggles the projector simulation here. |
| `pnpm build` | Static, fully offline build in `dist/` |
| `pnpm serve` | Serves `dist/` at http://localhost:3031 with no network (`/#/presenter/1` for the presenter view) |
| `pnpm export` | PDF backup with every slide in its final click state → `backend-workshop-slides.pdf` |
| `pnpm export:clicks` | PDF with one page per click step |
| `pnpm check:code` | Verifies every snippet on the slides, in the cheat sheet, and in the clips matches Appendix A exactly |
| `pnpm qa` | Against `pnpm serve`: blocks the network, walks the whole show with →, checks click counts against the notes' `[click]` markers, the `b` fallbacks, backstage slides, and the presenter view |
| `pnpm capture:board` | Saves a fresh screenshot of the deployed board as the offline fallback |
| `pnpm shots --slides 1-36 [--projector]` | QA screenshots at 1280×720 into `shots/` |

## Present it

Read [`notes/screen-setup.md`](notes/screen-setup.md) first: displays, windows, keys, VS Code settings, browser tabs, and the pre-talk checklist. Then:

- [`notes/presenter-flow.md`](notes/presenter-flow.md): the whole night minute by minute, every screen switch, time checks, and the cut list.
- [`notes/cheat-sheet.md`](notes/cheat-sheet.md): every snippet in paste order.
- Each slide's notes (presenter view) follow the plan's section 8.1 format: time, mode, talking points, `[click]` cues, `→ SWITCH TO …` lines, and what to cut.

Keys: `→`/`Space`/clicker advance and **skip backstage slides**; `b` on a live-board slide jumps to its screenshot fallback and back; `g` + number goes anywhere. Slidev's slide number is the plan's number + 1 (the pre-show loop is slide 1); presenter view shows the plan number on a yellow tag.

## Before the night: inputs still needed

Everything the plan asks the presenter for (section 10) lives in [`slides/workshop.config.ts`](slides/workshop.config.ts). Values still wrapped in `{{…}}` render as marked placeholders:

| Input | Field | Status |
|---|---|---|
| Live board URL (Pangolin) | `liveBoardUrl` | placeholder |
| Live board `/admin/` URL | `liveBoardAdminUrl` | placeholder |
| Starter repo URL | `starterRepoUrl` | set: github.com/joshualent/questions-api (must be **public** by the 19th) |
| Developer Club wordmark | `logoSrc` (file in `slides/public/media/brand/`) | placeholder |
| Next club event | `nextEvent` | placeholder |
| Resources link for the "where next" QR code | `resourcesUrl` | placeholder |

Also: the deployed board must allow being framed by the deck (see "The deployed board in an iframe" in `notes/screen-setup.md`), and the fallback screenshot in `slides/public/media/board/` is a stand-in made from the `tier-1-done` app until `pnpm capture:board` replaces it.

## Clips

Three pre-rendered showpiece clips (slides 7, 14, 28) are authored in [HyperFrames](https://hyperframes.heygen.com) under [`animations/`](animations/) and rendered with `cd animations && pnpm install && pnpm render`. See [`animations/README.md`](animations/README.md).

## How it's built

```
docs/presentation-plan.md   the plan (source of truth)
slides/                     Slidev project
  slides.md                 headmatter + section imports
  pages/                    00-preshow … 06-appendix (one file per section)
  components/               RequestFlowMap, Packet, Method/StatusBadge, HttpMessage, StepCard,
                            CountdownTimer, QrCode, LiveBoard, and the per-slide animations
  composables/              click-step registration, backstage navigation, projector simulation
  setup/                    shortcuts (backstage guard, b, p), app setup, Shiki theme
  styles/                   tokens.css (the only colors/sizes) + global.css
  public/media/             clips, board fallback screenshot
  workshop.config.ts        event inputs
  scripts/                  check-code, qa-deck, serve, capture-board, screenshot
animations/                 HyperFrames sources + render.mjs for the three clips
notes/                      presenter-flow, cheat-sheet, screen-setup
```

Decisions worth knowing:

- **Backstage slides instead of `hide: true`.** Slidev 53 drops hidden slides from the build, so the appendix (fallbacks, clip stills, reference code, troubleshooting, projector check, alternate title directions) uses `backstage: true`. Keyboard and clicker navigation skip them; `g` and `b` reach them.
- **Live boards fall back by themselves.** `LiveBoard` probes the board URL and shows the screenshot when the network is down; `b` covers failures a probe can't see (e.g. the board refusing to be framed).
- **Click-driven components own their clicks.** Animated diagrams register their steps with Slidev (`composables/useStepClicks.ts`), so the presenter view, `[click]` notes, and PDF export all agree. Every step is ≤ 700 ms; PDF export shows final states.
- **Offline.** Fonts are bundled (`@fontsource-variable`), QR codes are generated in the browser from the bundled `qrcode` library, Google Fonts are disabled (`fonts.provider: none`), and `pnpm qa` fails on any non-local request.
- **Contrast.** Body text is 8.6–15.9:1 against its background, labels and badges 5.9–11:1, and every slide was checked with the projector simulation at half size.
- **CSS minification is off** (`slides/vite.config.ts`): Vite 8's minifier rejects a rule in Slidev 53's own code-block CSS.
- **Title direction:** slide 1 uses direction A (stacked display type). B (title + terminal) and C (request line) are backstage slides 59 and 60; switch with `variant` in `pages/01-opening.md`.
