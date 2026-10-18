# Presenter flow

The whole night, minute by minute. **Slide** is the deck's own number (what the presenter view shows and what you type after `g`). **Part** is the slide's `part:` tag, which the presenter view shows in the top right corner.

## How the night is built

The night has five parts:

1. **Setup** (6:30–7:00): one slide on the projector while people arrive.
2. **Opening** (7:00–7:04): welcome, then a check that everyone has the login page and a second terminal.
3. **API basics** (7:04–7:17): what an API is, REST (resources and URLs, methods, the parts of a request), and the parts of our Django API.
4. **Four lessons** (7:17–8:25), with a five-minute break after lesson 2.
5. **Wrap-up** (8:25–8:30).

Every lesson follows the same pattern. One or two slides come first. Then you write the code in VS Code and try it in the browser until the lesson's checkpoint works, with no slides in between. Each lesson's browser check ends by showing the problem the next lesson fixes, and the next lesson's first slide starts from that problem. The first slide of lessons 2–4 ends with the one line to run if you're behind.

The presenter view keeps showing the lesson's first slide while you're in VS Code, so its notes hold the whole coding stretch, with a clock time on every `→ SWITCH TO` line. Everything you type is in `notes/cheat-sheet.md`, in order.

Modes: **SLIDES**, **VS CODE**, **TERMINAL**, **BROWSER**.

| Clock | Slide | Part | Mode | What happens | Transition cue | If behind |
|---|---|---|---|---|---|---|
| 6:30 | 1 | Setup | SLIDES | *Set up while you wait* on the projector. People arrive, eat, install Git, uv, and VS Code, clone the repo, and run the commands. Walk the room. | Say the setup line at 6:40 and 6:50. | Start at 7:00 anyway. |
| 6:50 | 1 | Setup | TERMINAL | Your own project: `main`, a fresh `db.sqlite3`, `runserver` running. Browser tabs open (see screen-setup.md). | Back to the slides window. | |
| 7:00 | 2 | Opening | SLIDES | Title. Welcome, thank the club, say what we build, show of hands, how the night works. | → | |
| 7:02 | 3 | Opening | SLIDES → VS CODE → SLIDES | *Check your setup*: hands up for the login page. Show `runserver` and a second terminal in VS Code. Checkpoints. | 2 clicks. | Anyone still installing keeps going; the next 15 minutes are slides. |
| 7:04 | 4 | API basics | SLIDES | What a backend does. | 3 clicks. | |
| 7:05 | 5 | API basics | SLIDES | Video V1 loops. Talk over it. | → | |
| 7:07 | 6 | API basics | SLIDES | Resources and URLs. Names REST. | 3 clicks. | |
| 7:08 | 7 | API basics | SLIDES | HTTP methods: the six routes, row by row. PUT vs. PATCH. | 4 clicks. | |
| 7:10 | 8 | API basics | SLIDES | Anatomy of a request: method and URL, headers, the JSON body, the status code family, the response body. Ends with the one-sentence summary of REST. | 5 clicks. | |
| 7:13 | 9 | API basics | SLIDES | The parts of our API, from the client to SQLite, and the file for each. "We build from the right, starting with the model." | 7 clicks. | |
| 7:15 | 10 | API basics | SLIDES | Video V2, stepped: 6 clicks, one per stop (0:04, 0:11, 0:15, 0:19.5, 0:23.5, 0:29). | 6 clicks. | |
| 7:17 | 11 | Lesson 1 | SLIDES | *Lesson 1: A model becomes a table*: one column for each field, then the migration commands. | 6 clicks. | |
| 7:19 | 11 | | VS CODE | Write the model in `questions/models.py` (cheat sheet 1). | → SWITCH TO VS CODE. | Leave `models.py` on the projector for people to copy. |
| 7:21 | 11 | | TERMINAL | `makemigrations questions`, `migrate`. Expect `Applying questions.0001_initial... OK`. | | |
| 7:23 | 11 | | VS CODE | `serializers.py` (cheat sheet 2). Point at `read_only_fields`. | | Paste from the cheat sheet. |
| 7:26 | 11 | | VS CODE | `views.py`, then `config/urls.py` (cheat sheet 3, 4). Say what a ViewSet and the router do. | | |
| 7:30 | 11 | | BROWSER | `/api/questions/` shows "Question List". | | |
| 7:31 | 11 | | VS CODE → TERMINAL → BROWSER | `admin.py` (cheat sheet 5), `createsuperuser` (`mod`), log in to `/admin/`, add a question, and show it in the API. | | **Cut 2:** skip the admin demo, but keep the line in `admin.py`. |
| 7:35 | 11 | | BROWSER | Try it: create → 201, blank → 400, `/999/` → 404. Optional curl example. Last: `"votes": 9999` → 201 with `"votes": 0`. | Back when most people have a 201 and a 400 (7:42). | **Cut 1:** skip the curl example. |
| 7:42 | 12 | Lesson 2 | SLIDES | *Lesson 2: How should voting work?* Ask the room first. PATCH vs. an action URL. Catch-up line for `checkpoint-1-crud`. | 3 clicks. | |
| **7:45** | | | | **Time check: if lesson 1 isn't finished by 7:45, paste lesson 2's code instead of typing it.** | | |
| 7:45 | 12 | | VS CODE | Imports, `upvote`, and `toggle_answered` in `views.py` (cheat sheet 6). | → SWITCH TO VS CODE. | Paste both methods. |
| 7:50 | 12 | | BROWSER | Try it: POST to `upvote` twice and to `toggle_answered` twice. Last: upvote again while logged out, and ask what else anyone can do. | Back at 7:55. | Do it once yourself. |
| 7:55 | 13 | Halfway | SLIDES | Halfway break. Catch-up line for `checkpoint-2-actions`. Go to raised hands. | Back at 8:00 at the latest. | |
| **8:05** | | | | **Time check: if the break didn't start by 8:05, lesson 4 becomes a 3-minute demo from `checkpoint-4-m2m`.** | | |
| 8:00 | 14 | Lesson 3 | SLIDES | *Lesson 3: Who can do what*: authentication and authorization, the rules with their permission classes, 403. Catch-up line for `checkpoint-2-actions`. | 2 clicks. | |
| 8:03 | 14 | | VS CODE | Permissions in `views.py`, then the `api-auth/` line in `config/urls.py` (cheat sheet 7, 8). | → SWITCH TO VS CODE. | Paste from the cheat sheet. |
| 8:06 | 14 | | TERMINAL → BROWSER | `createsuperuser` if needed. Create `sam` (no staff, no superuser) on `/admin/auth/user/add/`. | | **Cut 3:** describe the second user instead. |
| 8:08 | 14 | | BROWSER | Try it as logged out, `sam`, and `mod`. Optional `curl -u sam:…` for the 403 on an edit. Last: sam upvotes three times. | Back at 8:13. | **Cut 3:** show only `mod`. |
| 8:13 | 15 | Lesson 4 | SLIDES | *Lesson 4: One vote per user*: the join table, and why the vote counts reset. Catch-up line for `checkpoint-3-auth`. | 2 clicks. | |
| 8:15 | 16 | Lesson 4 | SLIDES | *Keep the JSON compatible*: `votes` stays a number, `has_voted` is new, `/upvote/` is gone. | 2 clicks. | Show both lesson 4 slides even when lesson 4 is a demo. |
| 8:17 | 16 | | VS CODE → TERMINAL | Change the field (cheat sheet 9), `makemigrations questions --name votes_many_to_many`, `migrate`. | → SWITCH TO VS CODE. | **Cut 4:** demo from `checkpoint-4-m2m` (switch, `migrate`). |
| 8:19 | 16 | | BROWSER | `/api/questions/` shows `"votes": []`: the problem the slide described. | | Skip this when demoing from the branch. |
| 8:20 | 16 | | VS CODE | Serializer (`votes`, `has_voted`), then `upvote` becomes `toggle_vote` (cheat sheet 10, 11). | | Paste both. |
| 8:23 | 16 | | BROWSER | sam toggles to 1, then 0. mod votes: 1. `/upvote/` is 404. | Back at 8:25. | Show it yourself. |
| **8:25** | | | | **Time check: the wrap-up starts at 8:25, even if people are still typing.** | | |
| 8:25 | 17 | Wrap-up | SLIDES | What you built: the real names next to each part. | 1 click. | |
| 8:26 | 18 | Wrap-up | SLIDES | Where to go next. QR code. | → | |
| 8:27 | 19 | Wrap-up | SLIDES | Questions, thanks, the next event, and the repo QR code. Never cut this. Leave it up. | End. | |

## Cut list, in order

1. The curl example in lesson 1 (slide 11's notes).
2. The admin registration demo (slide 11's notes). Keep the one line in `admin.py`.
3. The second-user test in lesson 3 (slide 14's notes). Describe it instead.
4. Lesson 4 coding: demo it from `checkpoint-4-m2m` in about 3 minutes, but still show both lesson 4 slides (15 and 16).

Never cut lessons 1–2 or the closing questions.

## What changed from the dev deck

The `dev` deck had 28 show slides and went back to the slides in the middle of lessons 1 and 4. This deck has 19:

| Gone | Where its content went |
|---|---|
| What the backend is responsible for, Why build an API? | Cut. Their one useful line each is in the notes of *What a backend does* and video V1. Validation and permissions are taught in lessons 1 and 3. |
| Your starter repo | The files are on *The parts of our API* (slide 9). Checkpoints are on *Check your setup* (slide 3) and the catch-up line on each lesson's first slide. |
| Lesson 1 section slide | Each lesson's first slide has "Lesson N" in its title. |
| A serializer converts and validates data, One ViewSet handles six routes | Video V2 shows what the serializer and router do. The notes for slide 11 say what each file does while you type it. The 400 and 404 show up in the browser. |
| The three "What's still broken?" slides | Each lesson's browser check ends by showing the next problem live, and the next lesson's first slide starts from it. |
| Why not let clients PATCH the vote count? | Now *Lesson 2: How should voting work?* (slide 12). |
| You built a REST API | The halfway break (slide 13). The diagram with every part comes once, at the end. |
| Authentication and authorization, Who can do what, How DRF checks permissions | One slide, *Lesson 3: Who can do what* (slide 14): the two definitions, each rule with its permission class, and 403. Where each rule goes in the code is in the notes. |

New: *Check your setup* (slide 3) and *Lesson 4: One vote per user* (slide 15), which shows the join table that video V3 would have shown.

The HTTP slides go from the smallest idea to the whole message: a URL names the data (slide 6), a method says what to do with it (slide 7), and slide 8 takes apart one full request and response. Specific status codes come up in the browser: 201, 400, and 404 in lesson 1, 405 in lesson 2, and 403 in lesson 3 (also on slide 14). Slide 26 lists them all.

The diagram of the API's parts (slide 9, the small version on slide 11, and video V2) follows the request: the client on the left, SQLite on the right. We build it from right to left, starting with the model.

## Backstage slides (press `g`, type the number)

| Slide | What |
|---|---|
| 20 | Appendix index (the numbers update automatically) |
| 21 | Switching checkpoints, including going back from `checkpoint-4-m2m` |
| 22 | Troubleshooting: Git or uv not found, port in use, no such table |
| 23–24 | Final-frame stills of V1 and V2 (use them if a video won't play) |
| 25 | Projector check |
| 26 | Status codes in our API: every code the workshop shows, and when you get it |

The clicker and arrow keys never land on these. To get back, press `g` and type the slide you came from.
