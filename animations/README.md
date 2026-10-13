# Explainer videos

The three pre-rendered videos from plan section 6.3. Each is an HTML page with a paused GSAP timeline (the HyperFrames approach, without its CLI); `render.mjs` seeks the timeline frame by frame in headless Chromium and pipes the frames to FFmpeg.

| Video | Slide (plan) | Length | Stops | Shows |
|---|---|---|---|---|
| `v1-one-backend-many-clients/` | 6 (5) | 15 s loop | none | Left: the server sends a whole HTML page to one browser, which reloads. Right: the same server sends small JSON to a web app, a phone, and a terminal at once. |
| `v2-life-of-a-post/` | 12 (11) | 29.5 s | 4, 11, 15, 19.5, 23.5, 29 | `POST /api/questions/` with `"votes": 9999` through the router, serializer (votes dropped; blank text bounces back as 400), model, an INSERT and a new row, back to JSON, and `201 Created` with `"votes": 0`. |
| `v3-count-to-voters/` | 38 (37) | 24.5 s | 4, 8.5, 13.5, 18, 24 | Migration 0002: the `votes` column is removed, `questions_question_votes` appears, rows link question 1 to sam and mod, sam's row is deleted, and the JSON still says `"votes": 1`. |

Every value on screen comes from the workshop code: the router line, the 400 body, the INSERT captured from `checkpoint-1-crud`, the table names from `sqlmigrate`, and the serializer line from `checkpoint-4-m2m`.

## Render

Needs Node 22+, FFmpeg, and Playwright's Chromium (`pnpm install` here; the version matches the deck's).

```bash
pnpm install
pnpm render                              # all three; about 4 minutes
node render.mjs v3-count-to-voters       # one
node render.mjs v2-life-of-a-post --stops            # contact sheet of the stops only, in renders/
node render.mjs v1-one-backend-many-clients --stops --at 0,3,7,12   # contact sheet of chosen times
```

Outputs, in `../slides/public/media/videos/`:

- `<name>.mp4`: H.264, 1920 × 1080, 30 fps, no audio
- `<name>.webm`: VP9, same
- `<name>.png`: the final stop, a complete static summary; used as the poster, in the PDF export, and on the appendix stills (for V1, the frame where both halves are done)

and each video's duration and stops in `../slides/data/videos.json`. `StepVideo` reads the stops from there, so a re-render never puts the slide out of step with the file. If you change a stop time, update the timestamps in that slide's notes; `pnpm qa` checks them.

## Preview

Open any `index.html` in a browser: it plays in a loop. Add `?t=12.5` to hold on one moment.

## Rules these sources follow

- **Same look as the slides.** `shared/stage.css` repeats the deck's tokens at video scale: the videos show about 760 px wide on the slide (× 0.4), so 40 px labels here are 16 px on the slide, 46 px code is 18 px, and 5 px strokes are 2 px.
- **Stops are holds.** Each step ends in a still moment, so pausing exactly on a stop never catches a transition.
- **V1 loops seamlessly.** Its last frame equals its first.
- **Fonts and GSAP are local** (`shared/fonts/`, `node_modules/gsap`); rendering needs no network.
- **Never edit the outputs.** Change the HTML and re-render.
