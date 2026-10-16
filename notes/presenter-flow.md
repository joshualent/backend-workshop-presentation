# Presenter flow

The whole night, minute by minute. **Slide** is the deck's own number (what the presenter view shows and what you type after `g`). **Plan** lists the `PLAN.md` slides it stands for; the presenter view shows the same tag in the top right corner of each slide.

This version of the deck has no slides about code. The slides carry the ideas; the code happens in VS Code. Each concept slide's notes include the coding that follows it, with a clock time on every `→ SWITCH TO` line, so the presenter view keeps showing the right notes while the projector shows VS Code, the terminal, or the browser. Everything you type is in `notes/cheat-sheet.md`, in order.

Modes: **SLIDES**, **VS CODE**, **TERMINAL**, **BROWSER**. Every row that leaves the slides says where to go and what has to be true before you come back.

| Clock | Slide | Plan | Mode | What happens | Transition cue | If behind |
|---|---|---|---|---|---|---|
| 6:30 | 1 | 0 | SLIDES | Setup slide on the projector. People arrive, eat, clone the repo, and run the commands. Helpers walk the room. | Say the setup line at 6:40 and 6:50. | Start at 6:55 anyway. Helpers keep helping. |
| 6:50 | 1 | 0 | TERMINAL | Your own project: `main`, a fresh `db.sqlite3`, `runserver` running. Browser tabs open (see screen-setup.md). | Back to the slides window. | |
| 6:55 | 2 | 1 | SLIDES | Title. Welcome, thank the club and helpers, say what we build, show of hands, how checkpoints and helpers work. | → | |
| 6:58 | 3 | 3 | SLIDES | What a backend does. | 3 clicks. | |
| 6:59 | 4 | 4 | SLIDES | What the backend is responsible for. | 3 clicks. | |
| 7:01 | 5 | 5 | SLIDES | Video V1 loops. Talk over it. | → | |
| 7:03 | 6 | 6 | SLIDES | Why build an API? | 3 clicks. | |
| 7:04 | 7 | 7 | SLIDES | Anatomy of a request: method, URL, headers, body, status, response body. | 6 clicks. | |
| 7:07 | 8 | 8 | SLIDES | The methods and status codes we use tonight. | → | |
| 7:08 | 9 | 9 | SLIDES | Resources and URLs, the six routes, and a preview of actions. | 2 clicks. | |
| 7:10 | 10 | 10 | SLIDES | The parts of our API, in build order from SQLite to the client. "We build from the left." | 7 clicks. | |
| 7:12 | 11 | 11 | SLIDES | Video V2, stepped: 6 clicks, one per stop (0:04, 0:11, 0:15, 0:19.5, 0:23.5, 0:29). | 6 clicks. | |
| 7:14 | 12 | 12 | SLIDES | Your starter repo: files, checkpoint branches, and how to switch. | → | |
| 7:15 | 13 | 13 | SLIDES | Lesson 1 section slide. | → | |
| 7:16 | 14 | 14–15 | SLIDES | A model becomes a database table: one column for each field. | 6 clicks. | |
| 7:18 | 14 | | VS CODE | Write the model in `questions/models.py` (cheat sheet 1). | → SWITCH TO VS CODE. | Leave `models.py` on the projector for people to copy. |
| 7:20 | 14 | | TERMINAL | `makemigrations questions`, `migrate`. Expect `Applying questions.0001_initial... OK`. | Back when most people have the OK. | |
| 7:23 | 15 | 16–17 | SLIDES | A serializer converts and validates data: 9999 is ignored, blank text gets a 400. | 3 clicks. | |
| 7:25 | 15 | | VS CODE | Write `questions/serializers.py` (cheat sheet 2). Point at `read_only_fields`. | → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 7:28 | 16 | 18–21 | SLIDES | One ViewSet handles six routes. `AllowAny` for now. | 2 clicks. | |
| 7:30 | 16 | | VS CODE | `views.py`, then `config/urls.py` (cheat sheet 3, 4). | → SWITCH TO VS CODE. | `git switch checkpoint-1-crud` for anyone stuck. |
| 7:34 | 16 | | BROWSER | `/api/questions/` shows "Question List". | | |
| 7:35 | 16 | | VS CODE → TERMINAL → BROWSER | `admin.py` (cheat sheet 5), `createsuperuser` (`mod`), log in to `/admin/`, add a question, and show it in the API. | | **Cut 2:** skip the admin demo, but keep the line in `admin.py`. |
| 7:37 | 16 | | BROWSER | Try it: create → 201, blank → 400, `/999/` → 404. Optional curl example. | Back when most people have a 201 and a 400. | **Cut 1:** skip the curl example. |
| 7:41 | 17 | 22 | SLIDES | What's still broken? Ask how voting should work. | → | |
| **7:45** | | | | **Time check: if lesson 1 isn't finished by 7:45, paste lesson 2's code instead of typing it.** | | |
| 7:42 | 18 | 23–25, 27 | SLIDES | Lesson 2. Why not let clients PATCH the vote count? Actions and `detail=True`. | 3 clicks. | |
| 7:45 | 18 | | VS CODE | Imports, `upvote`, and `toggle_answered` in `views.py` (cheat sheet 6). | → SWITCH TO VS CODE. | Paste both methods. |
| 7:51 | 18 | | BROWSER | Try it: POST to `upvote` twice and to `toggle_answered` twice. | Back at 7:55. | Do it once yourself. |
| 7:55 | 19 | 28 | SLIDES | You built a REST API. Catch-up: `git switch checkpoint-2-actions`. | Back at 7:58 at the latest. | |
| 7:58 | 20 | 29 | BROWSER → SLIDES | Ask first, then upvote ten times while logged out. Show the three problems. | 3 clicks. | |
| **8:05** | | | | **Time check: if the checkpoint pause didn't start by 8:05, lesson 4 becomes a 3-minute demo from `checkpoint-4-m2m`.** | | |
| 8:02 | 21 | 30 | SLIDES | Authentication and authorization. | 3 clicks. | |
| 8:03 | 22 | 31, 34 | SLIDES | Who can do what: the rules table, then staff status vs. superuser status. | 1 click. | |
| 8:05 | 23 | 32–33, 35 | SLIDES | How DRF checks permissions. The permission check appears on the diagram. | 3 clicks. | |
| 8:07 | 23 | | VS CODE | Permissions in `views.py`, then the `api-auth/` line in `config/urls.py` (cheat sheet 7, 8). | → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 8:09 | 23 | | TERMINAL → BROWSER | `createsuperuser` if needed. Create `sam` (no staff, no superuser) on `/admin/auth/user/add/`. | | **Cut 3:** describe the second user instead. |
| 8:11 | 23 | | BROWSER | Try it as logged out, `sam`, and `mod`. Optional `curl -u sam:…` for the 403 on an edit. | Back at 8:13. | **Cut 3:** show only `mod`. |
| 8:13 | 24 | 36, 38 | SLIDES | What's still broken? sam upvotes three times. Click: lesson 4 stores who voted. Explain the join table and why the totals reset. | 1 click. | |
| 8:15 | 24 | | VS CODE → TERMINAL | Change the field (cheat sheet 9), `makemigrations questions --name votes_many_to_many`, `migrate`. | → SWITCH TO VS CODE. | **Cut 4:** demo from `checkpoint-4-m2m` (switch, `migrate`). |
| 8:18 | 24 | | BROWSER | `/api/questions/` shows `"votes": []`: the JSON changed. | Back at 8:19. | Skip this when demoing from the branch. |
| 8:19 | 25 | 39–41 | SLIDES | Keep the JSON compatible: `votes` is still a number, `has_voted` is new, `/upvote/` is gone. | 2 clicks. | Show this slide even when lesson 4 is a demo. |
| 8:21 | 25 | | VS CODE | Serializer (`votes`, `has_voted`), then `upvote` becomes `toggle_vote` (cheat sheet 10, 11). | → SWITCH TO VS CODE. | Paste both. |
| 8:23 | 25 | | BROWSER | sam toggles to 1, then 0. mod votes: 1. | Back at 8:25. | Show it yourself. |
| **8:25** | | | | **Time check: the wrap-up starts at 8:25, even if people are still typing.** | | |
| 8:25 | 26 | 42 | SLIDES | What you built: the real names next to each part. | 1 click. | |
| 8:26 | 27 | 43 | SLIDES | Where to go next. QR code. | → | |
| 8:27 | 28 | 44–45 | SLIDES | Questions, thanks, the next event, and the repo QR code. Never cut this. Leave it up. | End. | |

## Cut list, in order

1. The curl example in lesson 1 (slide 16's notes).
2. The admin registration demo (slide 16's notes). Keep the one line in `admin.py`.
3. The second-user test in lesson 3 (slide 23's notes). Describe it instead.
4. Lesson 4 coding: demo it from `checkpoint-4-m2m` in about 3 minutes, but still show *Keep the JSON compatible* (slide 25).

Never cut lessons 1–2 or the closing questions.

## What changed from the plan's slide list

`PLAN.md` section 7 has 46 slides, including a "write it" code slide, a Magic Move, or a "try it" results slide for every coding step. This deck drops the slides whose main job was showing code, and three slides the presenter cut:

| Gone as a slide | Where it went |
|---|---|
| Write the model, Write the serializer, Write the view and routes, See it in the admin (plan 15, 17, 19, 20) | VS Code, run from the notes of slides 14–16 |
| Add the actions, Add permissions, Change the field, Upvote becomes toggle (plan 25, 33, 38, 40) | VS Code, run from the notes of slides 18, 23, 24, 25 |
| The four "Try it" result slides (plan 21, 27, 35, 41) | The browser, with the expected results in the notes |
| Lesson 2 section slide (plan 23) | Said aloud at the start of slide 18 |
| Staff, not superuser (plan 34) | The last click on *Who can do what* (slide 22) |
| Thanks (plan 45) | Merged into *Questions?* (slide 28) |
| Tonight (plan 2) | Cut. The show of hands and how checkpoints work are in the title slide's notes. |
| Your turn: `toggle_answered` with a timer (plan 26) | Cut. You type `toggle_answered` with the room right after `upvote`. |
| Video V3, From a count to a list of voters (plan 37) | Cut. Slide 24's notes explain the join table and why the totals reset. |
| Final code in the appendix | The `checkpoint-4-m2m` branch and the cheat sheet |

The concept slides that used to show code now show the idea: *A model becomes a database table* maps each field to its column, *One ViewSet handles six routes* lists the routes the router creates, *Why not let clients PATCH the vote count?* introduces actions without the decorator code, and *Keep the JSON compatible* compares the JSON before and after lesson 4.

The diagram of the API's parts (slide 10, the small versions on later slides, and video V2) is in build order: SQLite on the left, the client on the right. Requests go right to left, and the JSON goes back along the bottom.

## Backstage slides (press `g`, type the number)

| Slide | What |
|---|---|
| 29 | Appendix index (the numbers update automatically) |
| 30 | Switching checkpoints, including going back from `checkpoint-4-m2m` |
| 31 | Troubleshooting: port in use, no such table, uv not found |
| 32–33 | Final-frame stills of V1 and V2 (use them if a video won't play) |
| 34 | Projector check |

The clicker and arrow keys never land on these. To get back, press `g` and type the slide you came from.
