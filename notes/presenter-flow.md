# Presenter flow

The whole night, minute by minute. **Slide** is the deck's own number (what the presenter view shows and what you type after `g`). **Plan** lists the `PLAN.md` slides it stands for; the presenter view shows the same tag in the top right corner of each slide.

This version of the deck has no slides about code. The slides carry the ideas; the code happens in VS Code. Each concept slide's notes hold the whole coding stretch that follows it, with a clock time on every `→ SWITCH TO` line, so the presenter view keeps showing the right notes while the projector shows VS Code, the terminal, or the browser. Everything you type is in `notes/cheat-sheet.md`, in order.

Modes: **SLIDES**, **VS CODE**, **TERMINAL**, **BROWSER**. Every row that leaves the slides says where to go and what has to be true before you come back.

| Clock | Slide | Plan | Mode | What happens | Transition cue | If behind |
|---|---|---|---|---|---|---|
| 6:30 | 1 | 0 | SLIDES | Setup slide on the projector. People arrive, eat, clone, run the commands. Helpers circulate. | Say the setup line at 6:40 and 6:50. | Start at 6:55 anyway; helpers keep going. |
| 6:50 | 1 | 0 | TERMINAL | Your own project: `main`, fresh `db.sqlite3`, `runserver` running. Browser tabs open (see screen-setup.md). | Back to the slides window. | |
| 6:55 | 2 | 1 | SLIDES | Title. Welcome, thank the club and helpers. | → | |
| 6:56 | 3 | 2 | SLIDES | Tonight. Show of hands: Python? Django? called an API? | 3 clicks. | |
| 6:58 | 4 | 3 | SLIDES | What a backend does. Restaurant line. | 3 clicks. | |
| 6:59 | 5 | 4 | SLIDES | What the backend owns. "Never trust the client." | 4 clicks. | |
| 7:01 | 6 | 5 | SLIDES | Video V1 loops; talk over it. | → | |
| 7:03 | 7 | 6 | SLIDES | Why build an API? | 4 clicks. | |
| 7:04 | 8 | 7 | SLIDES | Anatomy of a request: method, URL, headers, body, status, response body. | 6 clicks. | |
| 7:07 | 9 | 8 | SLIDES | Methods and status codes tonight. | → | |
| 7:08 | 10 | 9 | SLIDES | Resources and URLs; the six routes; actions preview. | 2 clicks. | |
| 7:10 | 11 | 10 | SLIDES | The map, built left to right. "We build it right to left." | 7 clicks. | |
| 7:12 | 12 | 11 | SLIDES | Video V2, stepped: 6 clicks, one per stop (0:04, 0:11, 0:15, 0:19.5, 0:23.5, 0:29). | 6 clicks. | |
| 7:14 | 13 | 12 | SLIDES | Your starter repo: files, checkpoint branches, how to switch. | → | |
| 7:15 | 14 | 13 | SLIDES | Lesson 1 section slide. "The slides are the ideas; the code happens in the editor." | → | |
| 7:16 | 15 | 14–15 | SLIDES | Models become tables: each field becomes a column. | 6 clicks. | |
| 7:18 | 15 | | VS CODE | Write the model in `questions/models.py` (cheat sheet 1). | → SWITCH TO VS CODE. | Leave `models.py` on the projector to copy. |
| 7:20 | 15 | | TERMINAL | `makemigrations questions`, `migrate`. Expect `Applying questions.0001_initial... OK`. | Back when most have the OK. | |
| 7:23 | 16 | 16–17 | SLIDES | Serializers translate and check: 9999 ignored, blank is 400. | 3 clicks. | |
| 7:25 | 16 | | VS CODE | Write `questions/serializers.py` (cheat sheet 2). Point at `read_only_fields`. | → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 7:28 | 17 | 18–21 | SLIDES | One ViewSet, six routes; `AllowAny` for now. | 2 clicks. | |
| 7:30 | 17 | | VS CODE | `views.py`, then `config/urls.py` (cheat sheet 3, 4). | → SWITCH TO VS CODE. | `git switch checkpoint-1-crud` for anyone stuck. |
| 7:34 | 17 | | BROWSER | `/api/questions/` shows "Question List". | | |
| 7:35 | 17 | | VS CODE → TERMINAL → BROWSER | `admin.py` (cheat sheet 5); `createsuperuser` (`mod`); log in to `/admin/`, add a question, see it in the API. | | **Cut 2:** skip the admin demo, keep the line in `admin.py`. |
| 7:37 | 17 | | BROWSER | Try it: create → 201, blank → 400, `/999/` → 404. Optional curl aside. | Back when most have a 201 and a 400. | **Cut 1:** skip the curl aside. |
| 7:41 | 18 | 22 | SLIDES | What's still broken? Ask how voting should work. | → | |
| **7:45** | | | | **Time check: lesson 1 not finished by 7:45 → skip the "your turn" exercise (slide 20).** | | |
| 7:42 | 19 | 23–25 | SLIDES | Lesson 2. Why not just PATCH the votes? Actions; `detail=True`. | 3 clicks. | |
| 7:45 | 19 | | VS CODE | Imports and `upvote` in `views.py` (cheat sheet 6). | → SWITCH TO VS CODE. | Type `toggle_answered` too if skipping the exercise. |
| 7:49 | 20 | 26–27 | SLIDES | Your turn: write `toggle_answered`. Timer on click 1, hint on click 2. | 2 clicks. | **Cut 3:** no timer; paste the code. |
| 7:51 | 20 | | VS CODE | Write the answer with the room. | → SWITCH TO VS CODE. | |
| 7:52 | 20 | | BROWSER | Try it: POST to `upvote` twice, `toggle_answered` twice. | Back at 7:55. | Do it once yourself. |
| 7:55 | 21 | 28 | SLIDES | You built a REST API. Catch-up: `git switch checkpoint-2-actions`. | Back at 7:58 at the latest. | |
| 7:58 | 22 | 29 | BROWSER → SLIDES | Ask, then demo: upvote ten times logged out. Reveal the three flaws. | 3 clicks. | |
| **8:05** | | | | **Time check: pause not started by 8:05 → lesson 4 becomes a 3-minute demo from `checkpoint-4-m2m`.** | | |
| 8:02 | 23 | 30 | SLIDES | Authentication vs. authorization. | 3 clicks. | |
| 8:03 | 24 | 31, 34 | SLIDES | The rules table; staff, not superuser. | 1 click. | |
| 8:05 | 25 | 32–33, 35 | SLIDES | How DRF decides; permission check appears on the map. | 3 clicks. | |
| 8:07 | 25 | | VS CODE | Permissions in `views.py`, then the `api-auth/` line in `config/urls.py` (cheat sheet 7, 8). | → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 8:09 | 25 | | TERMINAL → BROWSER | `createsuperuser` if needed; create `sam` (no staff, no superuser) on `/admin/auth/user/add/`. | | **Cut 4:** describe the second user instead. |
| 8:11 | 25 | | BROWSER | Try it as logged out, `sam`, `mod`. Optional `curl -u sam:…` for the edit 403. | Back at 8:13. | **Cut 4:** show only `mod`. |
| 8:13 | 26 | 36 | SLIDES | What's still broken? sam upvotes 1, 2, 3. | → | |
| 8:14 | 27 | 37–38 | SLIDES | Video V3, stepped: 5 clicks (0:04, 0:08.5, 0:13.5, 0:18, 0:24). Totals reset, and why. | 5 clicks. | Keep this video even when lesson 4 is a demo. |
| 8:16 | 27 | | VS CODE → TERMINAL | Change the field (cheat sheet 9); `makemigrations questions --name votes_many_to_many`; `migrate`. | → SWITCH TO VS CODE. | **Cut 5:** demo from `checkpoint-4-m2m` (switch, `migrate`). |
| 8:18 | 27 | | BROWSER | `/api/questions/` shows `"votes": []`: the JSON changed shape. | Back at 8:19. | Skip when demoing from the branch. |
| 8:19 | 28 | 39–41 | SLIDES | The API doesn't change: same JSON before and after; `/upvote/` is gone. | 2 clicks. | Keep this slide even as a demo. |
| 8:21 | 28 | | VS CODE | Serializer line, then `upvote` becomes `toggle_vote` (cheat sheet 10, 11). | → SWITCH TO VS CODE. | Paste both. |
| 8:23 | 28 | | BROWSER | sam toggles 1 then 0; mod votes 1. | Back at 8:25. | Show it yourself. |
| **8:25** | | | | **Time check: wrap-up starts at 8:25 regardless.** | | |
| 8:25 | 29 | 42 | SLIDES | What you built: real names on the map. | 1 click. | |
| 8:26 | 30 | 43 | SLIDES | Where to go next. QR code. | → | |
| 8:27 | 31 | 44–45 | SLIDES | Questions; thanks; next event; repo QR. Never cut. Leave it up. | End. | |

## Cut list, in order

1. The curl aside in lesson 1 (slide 17's notes).
2. The admin registration demo (slide 17's notes); keep the one line in `admin.py`.
3. The "your turn" exercise in lesson 2 (slide 20); paste the code instead.
4. The second-user test in lesson 3 (slide 25's notes); describe it.
5. Lesson 4 coding: demo it from `checkpoint-4-m2m` in about 3 minutes, still showing the V3 video (slide 27) and *The API doesn't change* (slide 28).

Never cut lessons 1–2 or the closing questions.

## What changed from the plan's slide list

`PLAN.md` section 7 has 46 slides, including a "write it" code slide, a Magic Move, or a "try it" results slide for every coding step. This deck keeps every idea and drops the slides whose main job was showing code:

| Gone as a slide | Where it went |
|---|---|
| Write the model, Write the serializer, Write the view and routes, See it in the admin (plan 15, 17, 19, 20) | VS Code, run from the notes of slides 15–17 |
| Add the actions, Add permissions, Change the field, Upvote becomes toggle (plan 25, 33, 38, 40) | VS Code, run from the notes of slides 19, 25, 27, 28 |
| The three "Try it" result slides (plan 21, 27, 35, 41) | The browser, with the expected results in the notes |
| Lesson 2 section slide (plan 23) | Said aloud at the top of slide 19 |
| Staff, not superuser (plan 34) | The last click on *The rules* (slide 24) |
| Thanks (plan 45) | Merged into *Questions?* (slide 31) |
| Final code in the appendix | The `checkpoint-4-m2m` branch and the cheat sheet |

The concept slides that stayed but used to show code now show the idea instead: *Models become tables* maps each field to its column, *One ViewSet, six routes* shows the routes the router makes, *Why not just PATCH the votes?* names actions without the decorator listing, and *The API doesn't change* compares the JSON clients see.

## Backstage slides (press `g`, type the number)

| Slide | What |
|---|---|
| 32 | Appendix index (numbers update themselves) |
| 33 | Switching checkpoints, including going back from `checkpoint-4-m2m` |
| 34 | Troubleshooting: port in use, no such table, uv not found |
| 35–37 | Final-frame stills of V1, V2, V3 (use if a video won't play) |
| 38 | Projector check |

The clicker and arrow keys never land on these. To get back, press `g` and type the slide you came from.
