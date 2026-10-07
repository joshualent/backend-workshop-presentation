# Showpiece clips

Sources for the three pre-rendered clips, authored in [HyperFrames](https://hyperframes.heygen.com) (HTML + CSS + a paused GSAP timeline, rendered frame by frame through headless Chrome + FFmpeg).

| Clip | Slide | Length | Shows |
|---|---|---|---|
| `server-vs-api/` | 7 | 12 s | Left: a heavy HTML page crosses to one browser, which flashes and reloads. Right: light JSON packets fan out to a web app, a phone, a terminal, and a service. |
| `orm-class-to-table/` | 14 | 13 s | The `Question` class's fields fly into column headers, three objects drop in as rows, then migration files line up like commits. |
| `counter-to-m2m/` | 28 | 13 s | The number 3 becomes three voters; a questions table and a users table appear and the join table slides in between them. |

## Render

Requires Node 22+, FFmpeg, and a Chromium. `render.mjs` uses Playwright's cached headless shell if there is one (as installed by the deck's `playwright-chromium`); otherwise set `HYPERFRAMES_BROWSER_PATH` or run `npx hyperframes browser ensure`.

```bash
cd animations
pnpm install
pnpm render                         # all three, then installs them in the deck
node render.mjs counter-to-m2m      # just one
node render.mjs server-vs-api --sheet   # draft render + a 4×3 contact sheet in renders/ for review
npx hyperframes preview             # live preview studio
```

Each render writes, into `../slides/public/media/clips/`:

- `<name>.mp4`: H.264, 1920×1080, 30 fps, no audio
- `<name>.webm`: VP9, same
- `<name>.png`: the poster frame (also what the PDF export and the backstage clip stills show)

`render.mjs` fails if a clip is longer than 15 s or either video is over 5 MB (plan section 6). Current sizes: 0.3–0.8 MB each.

## Rules these sources follow

- **Seamless loops.** The last frame equals the first: each timeline ends by returning everything to its frame-0 state (first-vs-last-frame PSNR ≈ 50 dB). Late `fromTo` tweens use `immediateRender: false` so they don't change frame 0.
- **Readable at slide size.** The clips are shown 752 px wide on the 980 px canvas (scale 0.39), so in-clip text is at least 42 px (≥ 16 px on the slide) and code is 46 px (≥ 18 px).
- **Tokens only.** `shared/clip.css` repeats the deck's color tokens; fonts (Inter, JetBrains Mono, Oswald) and GSAP are local files in `shared/`, so rendering needs no network.
- **Code matches Appendix A.** The class in `orm-class-to-table` is a `<pre data-code-check>` block that `slides/scripts/check-code.mjs` verifies.
- **Never hand-edit the outputs.** Change the HTML and re-render.
