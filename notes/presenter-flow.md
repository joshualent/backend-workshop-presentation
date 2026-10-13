# Presenter flow

The whole night, minute by minute. **Slide** is the deck's own number (what the presenter view shows and what you type after `g`); **plan** is the number in `PLAN.md`. They differ by one because the setup slide is slide 1. The presenter view shows the plan number in the top right corner of each slide.

Modes: **SLIDES**, **VS CODE**, **TERMINAL**, **BROWSER**. Every row that leaves the slides says where to go and what has to be true before you come back.

| Clock | Slide (plan) | Mode | What happens | Transition cue | If behind |
|---|---|---|---|---|---|
| 6:30 | 1 (0) | SLIDES | Setup slide on the projector. People arrive, eat, clone, run the commands. Helpers circulate. | Say the setup line at 6:40 and 6:50. | Start at 6:55 anyway; helpers keep going. |
| 6:50 | 1 (0) | TERMINAL | Your own project: `main`, fresh `db.sqlite3`, `runserver` running. Browser tabs open (see screen-setup.md). | Back to the slides window. | |
| 6:55 | 2 (1) | SLIDES | Title. Welcome, thank the club and helpers. | → | |
| 6:56 | 3 (2) | SLIDES | Tonight. Show of hands: Python? Django? called an API? | 3 clicks. | |
| 6:58 | 4 (3) | SLIDES | What a backend does. Restaurant line. | 3 clicks. | |
| 6:59 | 5 (4) | SLIDES | What the backend owns. "Never trust the client." | 4 clicks. | |
| 7:01 | 6 (5) | SLIDES | Video V1 loops; talk over it. | → | |
| 7:03 | 7 (6) | SLIDES | Why build an API? | 4 clicks. | |
| 7:04 | 8 (7) | SLIDES | Anatomy of a request: method, URL, headers, body, status, response body. | 6 clicks. | |
| 7:07 | 9 (8) | SLIDES | Methods and status codes tonight. | → | |
| 7:08 | 10 (9) | SLIDES | Resources and URLs; the six routes; actions preview. | 2 clicks. | |
| 7:10 | 11 (10) | SLIDES | The map, built left to right. "We build it right to left." | 7 clicks. | |
| 7:12 | 12 (11) | SLIDES | Video V2, stepped: 6 clicks, one per stop (0:04, 0:11, 0:15, 0:19.5, 0:23.5, 0:29). | 6 clicks. | |
| 7:14 | 13 (12) | SLIDES | Your starter repo: files, checkpoint branches, how to switch. | → | |
| 7:15 | 14 (13) | SLIDES | Lesson 1 section slide. | → | |
| 7:16 | 15 (14) | SLIDES | Models become tables: fields line up with columns. | 6 clicks. | |
| 7:18 | 16 (15) | VS CODE | Write the model in `questions/models.py`. | → SWITCH TO VS CODE. | Room pastes from the slide. |
| 7:20 | 16 (15) | TERMINAL | `makemigrations questions`, `migrate`. Expect `Applying questions.0001_initial... OK`. | Back when most have the OK. | |
| 7:23 | 17 (16) | SLIDES | Serializers translate and check: 9999 ignored, blank is 400. | 3 clicks. | |
| 7:25 | 18 (17) | VS CODE | Write `questions/serializers.py`. | 1 click, then → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 7:28 | 19 (18) | SLIDES | One ViewSet, six routes. | 1 click. | |
| 7:30 | 20 (19) | VS CODE | `views.py`, then `config/urls.py`. Point out `AllowAny`. | 2 clicks, then → SWITCH TO VS CODE. | `git switch checkpoint-1-crud` for anyone stuck. |
| 7:34 | 20 (19) | BROWSER | `/api/questions/` shows "Question List". | Back when most see it. | |
| 7:35 | 21 (20) | VS CODE → TERMINAL → BROWSER | `admin.py`; `createsuperuser` (`mod`); log in to `/admin/`, add a question, see it in the API. | Back when shown in both places. | **Cut 2:** skip the admin demo, keep the code line. |
| 7:37 | 22 (21) | BROWSER | Try it: create → 201, blank → 400, `/999/` → 404. Optional curl aside. | 3 clicks as each one runs. | **Cut 1:** skip the curl aside. |
| 7:41 | 23 (22) | SLIDES | What's still broken? Ask how voting should work. | → | |
| **7:45** | | | **Time check: lesson 1 not finished by 7:45 → skip the "your turn" exercise (slide 27).** | | |
| 7:42 | 24 (23) | SLIDES | Lesson 2 section slide. | → | |
| 7:43 | 25 (24) | SLIDES | Why not just PATCH the votes? `detail=True`. | 3 clicks. | |
| 7:45 | 26 (25) | VS CODE | Magic Move of `views.py`; type the imports and `upvote`. | 3 clicks, then → SWITCH TO VS CODE. | Type `toggle_answered` too if skipping the exercise. |
| 7:49 | 27 (26) | SLIDES | Your turn: write `toggle_answered`. Timer on click 1, hint on click 2. | 2 clicks. | **Cut 3:** skip it; paste the code. |
| 7:52 | 28 (27) | BROWSER | Try it: POST to `upvote` twice, `toggle_answered` twice. | → SWITCH TO BROWSER. | Do it once yourself. |
| 7:55 | 29 (28) | SLIDES | You built a REST API. Catch-up: `git switch checkpoint-2-actions`. | Back at 7:58 at the latest. | |
| 7:58 | 30 (29) | BROWSER → SLIDES | Ask, then demo: upvote ten times logged out. Reveal the three flaws. | 3 clicks. | |
| **8:05** | | | **Time check: pause not started by 8:05 → lesson 4 becomes a 3-minute demo from `checkpoint-4-m2m`.** | | |
| 8:02 | 31 (30) | SLIDES | Authentication vs. authorization. | 3 clicks. | |
| 8:03 | 32 (31) | SLIDES | The rules table. | → | |
| 8:04 | 33 (32) | SLIDES | How DRF decides; permission check appears on the map. | 3 clicks. | |
| 8:06 | 34 (33) | VS CODE | Magic Move of `views.py`, then `config/urls.py`. Type the changes. | 4 clicks, then → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 8:08 | 34 (33) | TERMINAL → BROWSER | `createsuperuser` if needed; create `sam` (no staff, no superuser) on `/admin/auth/user/add/`. | Back when most have both users. | **Cut 4:** describe the second user instead. |
| 8:10 | 35 (34) | SLIDES | Staff, not superuser. | → | |
| 8:11 | 36 (35) | BROWSER | Try it as logged out, `sam`, `mod`. Optional `curl -u sam:…` for the edit 403. | 3 clicks, one per user. | **Cut 4:** show only `mod`. |
| 8:13 | 37 (36) | SLIDES | What's still broken? sam upvotes 1, 2, 3. | → | |
| 8:14 | 38 (37) | SLIDES | Video V3, stepped: 5 clicks (0:04, 0:08.5, 0:13.5, 0:18, 0:24). | 5 clicks. | Keep this video even when lesson 4 is a demo. |
| 8:16 | 39 (38) | VS CODE → TERMINAL | Change the field; `makemigrations questions --name votes_many_to_many`; `migrate`. Totals reset. | 1 click, then → SWITCH TO VS CODE. | **Cut 5:** demo from `checkpoint-4-m2m` (switch, `migrate`). |
| 8:19 | 40 (39) | VS CODE | Serializer line; before/after JSON is identical. | 1 click, then → SWITCH TO VS CODE. | Keep this slide even as a demo. |
| 8:21 | 41 (40) | VS CODE | `upvote` becomes `toggle_vote`. `/upvote/` is gone. | 2 clicks, then → SWITCH TO VS CODE. | Paste it. |
| 8:23 | 42 (41) | BROWSER | sam toggles 1 then 0; mod votes 1. | 3 clicks. | Show it yourself. |
| **8:25** | | | **Time check: wrap-up starts at 8:25 regardless.** | | |
| 8:25 | 43 (42) | SLIDES | What you built: real names on the map. | 1 click. | |
| 8:26 | 44 (43) | SLIDES | Where to go next. QR code. | → | |
| 8:27 | 45 (44) | SLIDES | Questions. Never cut. | → | |
| 8:29 | 46 (45) | SLIDES | Thanks; next event; repo QR. Leave it up. | End. | |

## Cut list, in order

1. The curl aside in lesson 1 (slide 22).
2. The admin registration demo (slide 21); keep the one line of code.
3. The "your turn" exercise in lesson 2 (slide 27); show the code instead.
4. The second-user test in lesson 3 (slides 34 and 36); describe it.
5. Lesson 4 coding: demo it from `checkpoint-4-m2m` in about 3 minutes, still showing the V3 video (slide 38) and the serializer slide (slide 40).

Never cut lessons 1–2 or the closing questions.

## Backstage slides (press `g`, type the number)

| Slide | What |
|---|---|
| 47 | Appendix index (numbers update themselves) |
| 48 | Switching checkpoints, including going back from `checkpoint-4-m2m` |
| 49 | Troubleshooting: port in use, no such table, uv not found |
| 50–58 | Final code: `config/urls.py`, `models.py`, `serializers.py`, `views.py` (3 slides), `admin.py`, migration 0002 (2 slides) |
| 59–61 | Final-frame stills of V1, V2, V3 (use if a video won't play) |
| 62 | Projector check |

The clicker and arrow keys never land on these. To get back, press `g` and type the slide you came from.
