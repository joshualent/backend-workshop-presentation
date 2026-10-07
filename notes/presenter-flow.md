# Presenter flow: Monday, October 19, 2026 · Floyd Hall D-109

One table for the whole night: every switch between the slides, VS Code, the browser (local browsable API), and the live board. Slide numbers are the plan's (P1, 1–35). **Slidev's own number is the plan number + 1** (P1 is Slidev slide 1), so to jump to plan slide 24 press `g`, type `25`, Enter. Presenter view shows the plan number on a yellow tag.

`§` refers to `notes/cheat-sheet.md`. `b` on a live-board slide jumps to its screenshot fallback and back.

**Cut list, in order:** ① curl callback (step 3) → ② "your turn" exercise (type it yourself instead) → ③ v2 ordering fix → ④ admin-only permission → ⑤ all of v2 Part B (demo from `tier-3-m2m` in ~3 min) → ⑥ v2 Part A (explain with slide 29 only). **Never cut** the v1 build or the closing Q&A.

| Clock | Slide(s) | Mode | What happens | Transition cue | Cut if behind |
|---|---|---|---|---|---|
| 6:00 | A21 (projector check) | SLIDES | Room check: swatches, 16 px text from the back row, clip plays, live board loads. Open the four browser tabs (screen-setup.md). | `g` `1` → P1 | — |
| 6:30–6:55 | P1 | SLIDES | Pre-show loop: setup commands, two QR codes, countdown to 6:55. Helpers fix `uv` installs (A19). Announce at 6:45: "Ten minutes; post a question." | 6:55: `→` to slide 1 | Start at 6:55 regardless |
| 6:55 | 1 | SLIDES | Title. One-line intro. | `→` | — |
| 6:56 | 2 | LIVE BOARD | The finished board with tonight's questions. | `b` if the frame fails | One sentence |
| 6:57 | 3 | SLIDES | Show of hands · code along + checkpoint branches · stuck signal (3 clicks). | `→` | Skip the show of hands |
| 7:00 | 4 | SLIDES | Request → server works → JSON back (3 clicks). | `→` | Skip the Ask |
| 7:01 | 5 | SLIDES | Restaurant: ticket, dish, labels (3 clicks). | `→` | Skip the menu line |
| 7:02 | 6 | SLIDES | Store data · rules · security · "Never trust the client." (4 clicks) | `→` | Reveal all, land the callout |
| 7:03 | 7 | SLIDES | Clip 1: server-rendered vs. API (loops while you talk). | `→` | One sentence |
| 7:05 | 8 | SLIDES | Why an API: three benefits + caveat (4 clicks). | `→` | Caveat only |
| 7:07 | 9 | SLIDES | HTTP anatomy builds part by part (5 clicks). | `→` | Skip the Ask |
| 7:09 | 10 | SLIDES | Methods and status codes (static). | `→` | 2xx/4xx/5xx line only |
| 7:10 | 11 | SLIDES | REST: URL morphs collection → item → action (2 clicks). | `→` | Jump to the third form |
| 7:12 | 12 | SLIDES | The map: packet walks, JSON returns, build order (7 clicks). | `→` | Last click + last line |
| 7:14 | 13 | SLIDES | Starter repo tour. "Is runserver still running?" | `→` | Third line only |
| 7:15 | 14 | SLIDES | Step 1 concept: clip 2, class → table. | `→` | Three "is a" lines |
| 7:16 | 15 | SLIDES | Step card 1. | **→ SWITCH TO VS CODE** | Paste the model |
| 7:17–7:22 | — | VS CODE | §1: type the model, `makemigrations`, `migrate`. Thumbs up on "OK". | **→ SWITCH TO SLIDES**, slide 16 (`g` `17`) | Paste instead of type |
| 7:23 | 16 | SLIDES | Serializer: translator + bouncer (3 clicks). | `→` | Skip click 3's explanation |
| 7:24 | 17 | SLIDES | Step card 2. Ask the 9,999 question. | **→ SWITCH TO VS CODE** | Paste the serializer |
| 7:25–7:28 | — | VS CODE | §2: serializer. Point at runserver: no red text. | **→ SWITCH TO SLIDES**, slide 18 | — |
| 7:29 | 18 | SLIDES | ViewSet splits into five; router writes URLs (2 clicks). | `→` | Router line only |
| 7:30 | 19 | SLIDES | Step card 3. Room predicts 201 / 400 / 404 (3 clicks). | **→ SWITCH TO VS CODE** | — |
| 7:32–7:34 | — | VS CODE | §3a views.py, §3b uncomment the router. | **→ SWITCH TO BROWSER** | — |
| 7:34–7:38 | — | BROWSER | `/api/questions/`: POST → 201, empty → 400, `/999/` → 404, `"votes": 9999` → 0. Optional §3c curl. | **→ SWITCH TO SLIDES**, slide 20 | ① curl callback |
| 7:39 | 20 | SLIDES | Custom actions: PATCH 9999 ignored, upvote 3 → 4 (2 clicks). | **→ SWITCH TO VS CODE** | Paste upvote |
| **7:40** | **TIME CHECK** | — | **Router (step 3) still not working for most of the room at 7:40 → cut step 5 (ordering): skip slides 22–23 and point at `tier-1-done`.** | | |
| 7:40–7:44 | — | VS CODE → BROWSER | §4: imports + `upvote`; POST `/api/questions/1/upvote/`. | **→ SWITCH TO SLIDES**, slide 21 | — |
| 7:45 | 21 | SLIDES | Your turn: 2-minute timer (click 1), hint at ~1:00 left (click 2). | **→ SWITCH TO VS CODE** when time's up | ② Skip; type it yourself |
| 7:47–7:48 | — | VS CODE → BROWSER | §4b: type `mark_answered` live; POST `/1/mark_answered/`. | **→ SWITCH TO SLIDES**, slide 22 | — |
| 7:48 | 22 | SLIDES | Ordering: cards reorder on `?ordering=-votes` (1 click). | `→` | Skip if cut at 7:40 |
| 7:49 | 23 | SLIDES | Step card 5 + commit. | **→ SWITCH TO VS CODE** | Skip if cut at 7:40 |
| 7:50–7:54 | — | VS CODE → BROWSER | §5: OrderingFilter; `?ordering=-votes`; `git add -A`, `git commit`. | **→ SWITCH TO SLIDES**, slide 24 | — |
| 7:55 | 24 | SLIDES | You built a REST API: every box checks, one burst (1 click). Catch-up commands on screen. | `→` | Click, one line |
| 7:56 | 25 | LIVE BOARD | Vote now. Helpers catch people up with `tier-1-done`. Delete spam via the board's /admin/ tab. | `b` if the frame fails | 1 min instead of 3 |
| 7:59 | 26 | SLIDES | "What's wrong with our app?" Ask first; 3 reveals; vote counter loops. | `→` | Reveal all at once |
| 8:01 | 27 | SLIDES | Authentication vs. authorization; tokens note (3 clicks). | `→` | Skip the token sentence |
| 8:03 | 28 | SLIDES | Clip 3: counter → voters → join table. | `→` | First and last lines |
| **8:05** | **TIME CHECK** | — | **Checkpoint pause (slide 24) started after 8:05 → skip Part B (⑤): after Part A, demo `tier-3-m2m` in ~3 min.** | | |
| 8:05 | 29 | SLIDES | Part A step card; logged out 403 / logged in 201 (2 clicks). | **→ SWITCH TO VS CODE** | ⑥ Slide only, no code |
| 8:06–8:12 | — | VS CODE → BROWSER | §A1 `createsuperuser`, §A2 uncomment `api-auth/` + permissions, §A3 curl → 403, log in → 201. Optional §A4. | **→ SWITCH TO SLIDES**, slide 30 | ④ admin-only |
| 8:13 | 30 | SLIDES | Heads up: votes reset (1 click). | `→` | First sentence |
| 8:14 | 31 | SLIDES | Part B step card. Paste, don't type. | **→ SWITCH TO VS CODE** | ⑤ Demo from `tier-3-m2m` |
| 8:15–8:24 | — | VS CODE → BROWSER | §B1–B3 paste, `makemigrations`, `migrate`; §B4 upvote twice → 400; second user; §B5 ordering fix. | **→ SWITCH TO SLIDES**, slide 32 at 8:25 sharp | ③ ordering fix |
| **8:25** | **TIME CHECK** | — | **Wrap-up starts at 8:25 no matter what.** | | |
| 8:25 | 32 | SLIDES | What you built: labels morph to code names (1 click). | `→` | Click, one line |
| 8:26 | 33 | SLIDES | Where to go next + resources QR. | `→` | Leave it up briefly |
| 8:27 | 34 | LIVE BOARD | Top-voted questions answered live (3–5). | `b` if the frame fails | Top two only |
| 8:29:30 | 35 | SLIDES | Thanks. Next event, starter repo QR. Leave up while people pack. | — | — |

## Section budgets (from the plan, section 3)

| Block | Budget | Slides | Planned |
|---|---|---|---|
| Opening and concepts | 6:55–7:15 (20 min) | 1–13 | 20 min (sum of the per-slide notes) |
| Build v1 | 7:15–7:55 (40 min) | 14–23 | 6 concept/card min + 34 coding min |
| Checkpoint pause | 7:55–8:05 (10 min) | 24–28 | 10.5 min. Trim slide 25 to 2.5 min if needed |
| Build v2 | 8:05–8:25 (20 min) | 29–31 | 3 slide min + 17 coding min |
| Wrap-up | 8:25–8:30 (5 min) | 32–35 | 5 min |

## Backstage slides (Slidev numbers, reach with `g`)

| Slidev # | What |
|---|---|
| 37 | Backstage index (lists all of these) |
| 38 / 39 / 40 | Screenshot fallbacks for slides 2 / 25 / 34 (or press `b` on the live slide) |
| 41 / 42 / 43 | Clip stills for slides 7 / 14 / 28 |
| 44–55 | Reference code: v1, v2 Part A, v2 Part B |
| 56 / 57 | Troubleshooting: setup (`uv`, port) / database (no such table, no such column) |
| 58 | Projector check |
| 59 / 60 | Title directions B and C |

From any backstage slide, `→` continues the show after the slide it stands in for (fallbacks) or moves through the appendix; `g` + a number returns you anywhere.
