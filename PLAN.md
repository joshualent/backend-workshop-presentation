# Presentation plan: Questions API workshop

This plan is the source of truth for the slide deck and presenter notes. Read all of it before writing code. Build in the phases in section 10 and stop at each review checkpoint.

This version of the plan describes the `next` branch: 15 show slides built around the run of show, with no slides in the middle of a coding stretch. The 46-slide version of section 7, with code slides and Magic Move, is in `PLAN.md` on `main`.

The workshop code lives in a separate repo, [joshualent/questions-api](https://github.com/joshualent/questions-api). Every line of code that appears on a slide comes from that repo's checkpoint branches (section 2).

---

## 1. The workshop

| | |
|---|---|
| Event | Backend Workshop: Build a Q&A API with Python & Django |
| Host | Developer Club, WMU |
| When | Monday, October 19, 2026. Doors 6:30 PM, talking starts about 6:55, ends 8:30. |
| Where | Floyd Hall D-109. Classroom projector: decent, not excellent. |
| Audience | CS and software development students. Most know some Python; many have never built a backend. |
| Format | Live code-along. The presenter switches between slides, VS Code, a terminal, and the browser. Attendees type along on their own laptops. |
| Stack | Python 3.14, Django 6.1, Django REST Framework 3.18, SQLite, uv |

**What attendees build:** an API where people submit questions, vote on them, and mark them answered. It grows across four parts. Each part ends at a checkpoint branch that attendees can switch to if they fall behind.

**The story of the night is a ladder of flaws.** Each part fixes a problem the previous one left behind. Each part's browser check ends by showing that problem live, and the next part's first slide starts from it:

| After | What works | What's still broken (motivates the next part) |
|---|---|---|
| Part 1 | Create, list, read, edit, delete questions | `votes` and `answered` are read-only, so nothing can change them |
| Part 2 | Upvote and toggle answered | Anyone can upvote forever, mark answered, edit, or delete |
| Part 3 | Login; only staff can moderate; voting needs login | A logged-in user can still upvote the same question again and again |
| Part 4 | One vote per user, toggleable | Done |

---

## 2. Code states at each checkpoint

The branches share one linear history, one commit per checkpoint. `main` equals `checkpoint-0-setup`. All facts below were verified by running each checkpoint.

| Branch | Commit message | Files changed |
|---|---|---|
| `checkpoint-0-setup` | Initialize Django workshop project | Scaffold only |
| `checkpoint-1-crud` | Add public question CRUD | `models.py`, `serializers.py`, `views.py`, `admin.py`, `config/urls.py`, migration `0001_initial` |
| `checkpoint-2-actions` | Add upvoting and answered toggling | `views.py` |
| `checkpoint-3-auth` | Add login and staff moderation | `views.py`, `config/urls.py` |
| `checkpoint-4-m2m` | Track voters and toggle votes | `models.py`, `serializers.py`, `views.py`, migration `0002_votes_many_to_many` |

### Checkpoint 0: setup (what attendees clone)

- `config/` project; `questions` and `rest_framework` already in `INSTALLED_APPS`.
- Empty stubs: `questions/models.py`, `views.py`, `admin.py`, and an empty `questions/serializers.py`.
- `config/urls.py` only has `admin/`.
- Setup: `uv sync --locked`, `uv run manage.py migrate`, `uv run manage.py runserver`, then open `http://127.0.0.1:8000/admin/`.
- Note the command form `uv run manage.py …` (no `python`). Use this form everywhere in the deck.

### Checkpoint 1: CRUD

- `Question` model: `text` (CharField, 300), `votes` (IntegerField, default 0), `answered` (BooleanField, default False), `created_at` (auto_now_add), `__str__` returns the text.
- `QuestionSerializer`: explicit `fields` tuple; `read_only_fields = ("id", "votes", "answered", "created_at")`. Only `text` is writable.
- `QuestionViewSet(ModelViewSet)` with `permission_classes = [AllowAny]`.
- `DefaultRouter`, registered as `router.register("questions", QuestionViewSet, basename="question")`, mounted at `api/`.
- `admin.site.register(Question)`.
- Commands: `uv run manage.py makemigrations questions`, then `uv run manage.py migrate`.

### Checkpoint 2: custom actions

- `@action(detail=True, methods=["post"])` `upvote`: `question.votes += 1`, save, return the serialized question.
- `@action(detail=True, methods=["post"])` `toggle_answered`: `question.answered = not question.answered`.
- URLs: `POST /api/questions/<id>/upvote/` and `POST /api/questions/<id>/toggle_answered/`. No request body. No migration needed.

### Checkpoint 3: authentication and staff moderation

- `config/urls.py` adds `path("api-auth/", include("rest_framework.urls"))` for the browsable API's login link.
- `get_permissions()` returns `[IsAdminUser()]` for `update`, `partial_update`, and `destroy`; otherwise the viewset default (`AllowAny`).
- `upvote` gets `permission_classes=[IsAuthenticated]`; `toggle_answered` gets `permission_classes=[IsAdminUser]`.
- `IsAdminUser` checks **staff status**, not superuser. There is no question ownership.
- Setup during the part: `uv run manage.py createsuperuser` (the moderator), then a second, non-staff user created on the admin Users page.

| Operation | Who can do it |
|---|---|
| List, read, or create questions | Anyone, including logged-out visitors |
| Upvote | Any logged-in user |
| Edit or delete questions | Staff |
| Toggle answered | Staff |

### Checkpoint 4: many-to-many voting

- Model: `votes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)`. The field keeps its name, `votes`.
- Migration `0002_votes_many_to_many` is `RemoveField` + `AddField`, so existing vote totals reset to zero. Questions and users are kept.
- Django creates the join table: `CREATE TABLE "questions_question_votes" ("id" … PRIMARY KEY, "question_id" bigint … REFERENCES "questions_question" ("id"), "user_id" integer … REFERENCES "auth_user" ("id"))`.
- Serializer: `votes = serializers.IntegerField(source="votes.count", read_only=True)`. **The JSON response looks exactly the same as before**: `"votes"` is still an integer. This is a key teaching point: storage changed, the API contract didn't.
- `upvote` is replaced by `toggle_vote` (`IsAuthenticated`): add the user's vote if absent, remove it if present. `/upvote/` no longer exists (a breaking change for any client that used it; mention in one line).
- Command: `uv run manage.py makemigrations questions --name votes_many_to_many`, then `migrate`.

### Real responses to put on slides

Use these exact bodies and status codes; they came from running the checkpoints.

| Request | Who | Status | Body |
|---|---|---|---|
| `POST /api/questions/` `{"text": "What does a serializer do?"}` | anyone | 201 | `{"id":1,"text":"What does a serializer do?","votes":0,"answered":false,"created_at":"…"}` |
| `POST /api/questions/` `{"text": ""}` | anyone | 400 | `{"text":["This field may not be blank."]}` |
| `POST /api/questions/` `{"text": "hi", "votes": 9999}` | anyone | 201 | `"votes":0`. The read-only field is silently ignored. |
| `GET /api/questions/999/` | anyone | 404 | `{"detail":"No Question matches the given query."}` |
| `POST …/1/upvote/` (cp3) or `…/1/toggle_vote/` (cp4) | logged out | 403 | `{"detail":"Authentication credentials were not provided."}` |
| `POST …/1/upvote/` three times (cp3) | same user | 200 ×3 | votes 1, 2, 3. This is the flaw part 4 fixes. |
| `POST …/1/toggle_vote/` twice (cp4) | same user | 200 ×2 | votes 1, then 0 |
| `POST …/1/toggle_answered/` | non-staff user | 403 | `{"detail":"You do not have permission to perform this action."}` |
| `DELETE /api/questions/1/` | non-staff user | 403 | `{"detail":"You do not have permission to perform this action."}` |
| `PATCH /api/questions/1/` | staff | 200 | updated question |

Logged-out requests get 403 (not 401) because the browsable API uses session authentication. Keep that as an optional aside in the notes, not on a slide.

---

## 3. Run of show

| Clock | Section | Mode | Ends at branch |
|---|---|---|---|
| 6:30–7:00 | Setup: arrival, food, installing | The setup slide on the projector; the presenter walks the room | `checkpoint-0-setup` running |
| 7:00–7:04 | Opening: welcome, check your setup | Slides | |
| 7:04–7:15 | API basics: what an API is, REST, the parts of our API | Slides | |
| 7:15–7:42 | Part 1: CRUD | One slide, then VS Code and the browser until the checkpoint works, then video V2 | `checkpoint-1-crud` |
| 7:42–7:55 | Part 2: custom actions | Same pattern | `checkpoint-2-actions` |
| 7:55–8:10 | Part 3: auth and moderation | Same pattern; five minutes of slack for a break, if the room needs one | `checkpoint-3-auth` |
| 8:10–8:25 | Part 4: many-to-many voting | Two slides, then the same pattern; code may be pasted | `checkpoint-4-m2m` |
| 8:25–8:30 | Wrap-up and questions | *What you built* stays up | |

There's no break slide. If the room needs a break, the presenter takes five minutes after part 2.

**Cut list if running long, in order:** the curl aside in part 1 → the admin registration demo (keep the one line of code) → the second-user test in part 3 (describe it) → part 4 coding (demo it from `checkpoint-4-m2m` in about 3 minutes, still showing both part 4 slides). Never cut parts 1–2 or the closing questions.

**Time checks:** part 1 not finished by 7:45 → paste part 2's code instead of typing it. Part 3 not started by 8:05 → part 4 becomes a demo. Wrap-up starts at 8:25 regardless.

---

## 4. Deck philosophy

1. **Slides come before the code, never in the middle of it.** Each part has one or two slides. Then the presenter and the room write the code in VS Code and try it in the browser until the part's checkpoint works, with no slides in between. Going back and forth between the slides and the editor costs the room its attention every time.
2. **Each slide has one job, and no slide repeats another.** If two slides make the same point, cut one. A recap is spoken, not a slide, except for the final diagram.
3. **Front-loading stays at about 20 minutes and at most 12 slides** before the first code. Only teach up front what the first coding stretch needs. Everything else is taught just in time, on the next part's first slide.
4. **One recurring map.** The request-flow diagram (Client → URL router → ViewSet → Serializer → Model → SQLite, JSON back) is built in the API basics, appears small on part 1's first slide, and returns at the end with the real names next to each part.
5. **No slide presents code.** The code happens in VS Code, and `notes/cheat-sheet.md` has every line. Small inline identifiers are fine, and any code, status code, or JSON on a slide is real (section 2).

---

## 5. Visual design

The deck should look like a well-made technical conference talk: calm, flat, and readable from the back row. Minimal styling. Content carries the slide, not decoration.

### 5.1 Base

- **Dark theme tuned for an average projector.** One solid background color on every slide: a charcoal near `#16181d`, never pure black. No gradients, textures, or images behind content.
- **Text:** off-white near `#f2f0eb` for primary text; a lighter grey near `#c5c9d0` for secondary text. Nothing dimmer, since projectors crush dark greys.
- **Color carries meaning only.** One accent (a clear teal near `#4fd1b5`) marks "the thing to look at now". HTTP method colors and status colors (2xx green, 4xx red) appear only on methods and status codes. Nothing else gets color.
- **Type:** one sans-serif (for example Inter) and one monospace (for example JetBrains Mono), both self-hosted. Body weight 500 or heavier; no thin weights.
- **Minimum sizes** on Slidev's default canvas: titles 40 px, body 24 px, code 18 px, diagram labels 16 px. In practice that means at most about 14 lines of code and about 30 words per slide.
- **Layout:** titles in sentence case, top-left, in the same position on every slide. Content left-aligned. Generous margins. Center only the title slide and section dividers.
- **Code blocks** sit on a slightly lighter surface, with no border, no shadow, and no window chrome. Use a high-contrast dark Shiki theme. Highlight the lines being discussed and dim the rest.
- **Diagrams:** flat boxes, 2 px strokes, plain arrowheads, same box style everywhere. Label with words, not icons.
- Put all values in one `tokens.css` as CSS custom properties. Components use tokens only.
- Add a hidden projector-check slide (every color swatch, smallest text, one code block) and a dev-only toggle that applies `filter: contrast(0.75) brightness(1.15)` to simulate a weak projector. Every slide must stay readable with it on.

### 5.2 Avoid these patterns

These read as generic, AI-generated slide design. Don't use them anywhere:

- Small bold all-caps labels with wide letter-spacing above titles (eyebrows, kickers, "STEP 01", "LESSON 2").
- Callouts or quotes with a colored, rounded left border, or any tinted box with a colored side stripe.
- Background patterns of any kind, especially ones applied to every slide: dot or line grids, noise or grain, circuit lines, blobs, glows, floating particles, animated ambient backgrounds.
- Gradient text, gradient fills, neon glows, glassmorphism or frosted panels, heavy drop shadows.
- Rows of three identical cards with an icon in a tinted circle or rounded square ("feature grids").
- Wrapping every element in a bordered, rounded card.
- Emoji as bullets or decoration (sparkles, rockets, check-mark emoji).
- Pills and badges on everything. Badges are allowed only for HTTP methods and status codes, where they carry meaning.
- Giant stat numbers with tiny labels when there is no data.
- Fake macOS window chrome (traffic-light dots) on code blocks or terminals.
- Numbered steps inside colored circles, decorative dividers, hand-drawn scribble circles or underline swooshes.
- Title Case Headlines and marketing copy ("Let's dive in", "Unlock the power of", "Key takeaways"). Write the way the presenter talks: short, plain sentences.
- Bouncing, spinning, typewriter text, confetti, staggered fly-ins on every bullet.

If a slide feels empty without decoration, the fix is better content or a bigger diagram, not ornament.

---

## 6. Motion

There are three tiers. Use the lightest tier that does the job.

### 6.1 Slide transitions: normal presenter style

- One deck-wide transition set in the headmatter: a quick `fade` (about 250 ms), or `slide-left` if the presenter prefers. Section dividers use the same transition.
- No per-slide custom transitions and no 3D or zoom transitions.

### 6.2 Click builds: most of the deck

- `v-click` reveals with a plain fade, for building a diagram or list in the order the presenter talks.
- Highlighting one box of the request map at a time.
- Every click-build finishes in under 500 ms, so the presenter never waits.

### 6.3 Explainer videos: only where motion teaches

Use a pre-rendered video only when the concept is about **something moving or changing shape over time** and a static diagram would make the audience imagine the motion themselves. There are three such places. Don't add more without asking.

| Video | Slide | What it shows | Why motion helps |
|---|---|---|---|
| **V1. Server-rendered pages vs. an API** (~13 s, stepped) | Intro: server-rendered pages vs. an API | Left half: the browser asks for `/questions/`, and the server builds the whole page, with the data in it, and sends it. Right half: the browser is labelled as running a frontend app. The app draws the page with grey bars where the data goes (the label lights up, so the skeleton clearly comes from the app), asks for `/api/questions/`, gets JSON back, and fills in the bars. | The difference is what travels from the server: a whole page, or only the data that a frontend app puts into its own page. Watching the empty page fill in shows where each piece comes from. |
| **V2. Life of a POST** (~30 s, stepped) | End of part 1, after the code works | Follows `POST /api/questions/` with `{"text": "What does a serializer do?", "votes": 9999}` through every layer, showing how the data changes shape: raw HTTP text → URL router picks `QuestionViewSet.create` → serializer validates (the `votes` key fades away as read-only; a side branch shows `""` bouncing back as a 400 with `This field may not be blank.`) → a `Question` object → an `INSERT` row appearing in a SQLite table → serialized back to JSON → `201 Created` with `"votes": 0`. | This is the central mental model of the night. The data's changing shape at each layer is exactly what a static diagram can't show. |
| **V3. From a count to a list of voters** (~25 s, stepped) | Part 4 opener | The `votes` integer column in `questions_question` disappears (the migration's `RemoveField`). A `questions_question_votes` join table appears with `question_id` and `user_id` columns, and rows connect question 1 to `sam` and `mod`. `sam` calls `toggle_vote` and their row is removed. Finally, the JSON response stays `"votes": 1` because the serializer reads `votes.count`. | Many-to-many and join tables are abstract until you watch rows link two tables. The final beat, where storage changes but the API response doesn't, is the part's main idea. |

In this deck, V3 is cut: part 4's first slide shows the join table as a click build instead. The earlier V1, one backend sending JSON to three clients, is still in `animations/v1-one-backend-many-clients/` but not on a slide.

**Video rules:**
- **Tool:** Motion Canvas is preferred for these code-and-diagram explainers (precise timelines, built-in code and layout primitives). HyperFrames (HTML + GSAP rendered to MP4) is fine if it's faster for you. Don't add Remotion. Sources live in `animations/<video-name>/` and render reproducibly from a script.
- **Presenter-controlled.** V1, V2, and V3 are stepped: render one clip and build a `StepVideo` component that plays to the next timestamp on each click and holds there. A reverse click jumps back to the previous stop. This keeps the presenter's narration in charge and adds no waiting time.
- **Same visual language as the slides:** the same colors, fonts, box style, and arrowheads, with no extra effects.
- **Content must match the real code and responses in section 2.**
- **Output:** 1920×1080, 30 fps, no audio, H.264 MP4 + WebM, plus a PNG of the final frame. The final frame is a complete static summary, used as the poster and in the PDF export.
- **Offline:** videos are files in `slides/public/media/`, never streamed.

---

## 7. Slide-by-slide specification

Asset key: **S** static, **C** click build, **V** video. Slide numbers are the deck's own.

### 7.1 Setup (6:30–7:00)

| # | Slide | Content | Asset |
|---|---|---|---|
| 1 | Set up while you wait | Four numbered steps: install Git, uv, and VS Code (uv installs Python), with their sites; `git clone …`; open the `questions-api` folder in VS Code and run `uv sync --locked`, `uv run manage.py migrate`, and `uv run manage.py runserver` in its terminal; open `http://127.0.0.1:8000/admin/` and see the Django login page. QR code to the repo. The folder is opened before `runserver` because opening a folder restarts VS Code's terminals. | S |

### 7.2 Opening (7:00–7:04)

| # | Slide | Content | Asset |
|---|---|---|---|
| 2 | Check your setup | The login page at `/admin/`. Keep `runserver` in one terminal and open a second terminal for every other command. Each part ends on a checkpoint branch, and the next part's first slide shows the line to catch up. Notes: welcome, what we build, show of hands, how the night works; hands up for the login page; show the two terminals in VS Code. There's no title slide. | C |

### 7.3 API basics (7:04–7:15)

| # | Slide | Content | Asset |
|---|---|---|---|
| 3 | What a backend does | Client sends a request; the server reads and writes data and checks the rules; a response comes back. | C |
| 4 | Server-rendered pages vs. an API | Video V1 (stepped) | V |
| 5 | Resources and URLs | A REST API organizes its data as resources with URLs. `/api/questions/` is the collection and `/api/questions/1/` is one question. A URL says which data, not what to do. | C |
| 6 | HTTP methods | The six routes, built row by row; PUT vs. PATCH. | C |
| 7 | Anatomy of a request | "A real request and its response, with a few headers left out." The real `POST /api/questions/` request and its 201 response, one part per click, with one short sentence for each. Status code families: 2xx, 4xx, 5xx. Notes end on the one-sentence summary of REST. | C |
| 8 | The parts of our API | The request-flow map, built left to right, with each part's file. The newest part is highlighted, with one or two sentences under the map on what it does. The last click replaces them with "We'll build these parts from right to left, starting with the model." | C |

### 7.4 Part 1: CRUD (7:15–7:42)

| # | Slide | Content | Asset |
|---|---|---|---|
| 9 | Part 1: Our model becomes a table, then push that change | Each field of `Question` becomes a column; `id` is the primary key; `makemigrations` and `migrate`. Notes run the whole part: model, migrations, serializer, ViewSet and URLs, admin, and the browser check (201, 400, 404), ending with `"votes": 9999` coming back as 0. | C |
| 10 | Life of a POST request | Video V2 (stepped), shown after part 1's code works. It follows the POST with `"votes": 9999` through the code everyone just wrote, and ends on "So how should voting work?" | V |

### 7.5 Part 2: custom actions (7:42–7:55)

| # | Slide | Content | Asset |
|---|---|---|---|
| 11 | Part 2: How should voting work? | `votes` and `answered` are read-only. A client sending `PATCH {"votes": 9999}` would let clients pick any number; `POST /api/questions/1/upvote/` lets the server own the rule. DRF calls these actions. Catch-up line for `checkpoint-1-crud`. Notes run the part and end by upvoting while logged out, then an optional break. | C |

### 7.6 Part 3: authentication and moderation (7:55–8:10)

| # | Slide | Content | Asset |
|---|---|---|---|
| 12 | Part 3: Who can do what | Authentication and authorization, one sentence each. The rules from section 2 with the DRF permission class for each. A failed check gets 403. Catch-up line for `checkpoint-2-actions`. Notes: where each rule goes in the code, staff vs. superuser, the optional 401 aside; they run the part and end with sam upvoting three times. | C |

### 7.7 Part 4: many-to-many voting (8:10–8:25)

| # | Slide | Content | Asset |
|---|---|---|---|
| 13 | Part 4: One vote per user | `votes` is a number, so the server can't tell who voted. A many-to-many field stores one row per vote in `questions_question_votes` (id, question_id, user_id). The migration deletes the old vote counts. Catch-up line for `checkpoint-3-auth`. | C |
| 14 | Keep the JSON compatible | Before and after JSON: `votes` stays a number through `source="votes.count"`, and `has_voted` is new. Renaming `upvote` to `toggle_vote` changes the URL, so `/upvote/` gets a 404. Notes run the part, including the `"votes": []` moment in the browser. | C |

### 7.8 Wrap-up (8:25–8:30)

| # | Slide | Content | Asset |
|---|---|---|---|
| 15 | What you built | The map with real code names next to each part (`DefaultRouter`, `QuestionViewSet`, `get_permissions`, `toggle_vote`, `QuestionSerializer`, `Question`, `questions_question`, `questions_question_votes`). The last slide: it stays up for thanks and questions. A closing slide may come later; the presenter will decide. | C |

### 7.9 Hidden appendix

Use `backstage: true` (Slidev 53 drops `hide: true` slides):
- Appendix index.
- Switching checkpoints, including the README's warning: to move backward from `checkpoint-4-m2m`, run `uv run manage.py migrate questions 0001` **before** switching branches, or delete `db.sqlite3` for a fresh start.
- Troubleshooting: Git or uv not found (with the install commands), port in use (`runserver 8001`), "no such table" (run `migrate`), "No module named django".
- Final-frame stills of V1 and V2.
- Projector check slide.
- Status codes in our API: 200, 201, 204, 400, 403, 404, 405, and when each happens.

---

## 8. Presenter notes

Notes are a deliverable. The presenter runs the night from Slidev's presenter view.

### 8.1 Per-slide notes (comment block at the end of every slide)

```
[7:31 · 2 min] [SLIDES]
- 2–4 short talking points, not a script
[click] what this click reveals, and the line to say with it
[click] …
Ask: audience prompt, if any
→ SWITCH TO VS CODE: questions/serializers.py
Back here when: everyone has saved serializers.py
If behind: what to skip
```

- Mode tag is one of `SLIDES`, `VS CODE`, `TERMINAL`, `BROWSER`.
- Use Slidev's `[click]` markers so notes stay in sync with click builds.
- Every switch away from the slides is an explicit `→ SWITCH TO …` line. The next slide's notes say what should be true when you return.
- Each part's first slide holds the notes for the whole coding stretch: every switch with a clock time, the exact commands, and the expected visible result, so the presenter can check the room before moving on.
- Video slides include a timestamped narration line for each stop.

### 8.2 `notes/presenter-flow.md`

One minute-by-minute table for the whole night: clock, slide numbers, mode, what happens, transition cue, and what to cut. Include every switch between slides, the editor, the terminal, and the browser, plus the time checks from section 3 as their own rows.

### 8.3 `notes/cheat-sheet.md`

Every snippet the presenter will type or paste, in order, grouped by part. Each one names its file and where it goes. Generate it from the checkpoint diffs (section 9) so it can't drift from the real code.

### 8.4 `notes/screen-setup.md`

- Extended display: projector shows slides, VS Code, or the browser; the laptop shows the presenter view.
- How to jump between the slide window and VS Code quickly, and how to jump to a slide by number.
- VS Code: zoom to 18–20 pt, high-contrast theme, file tree hidden when not in use.
- Browser tabs to pre-open: `http://127.0.0.1:8000/api/questions/`, `/admin/`, and the repo.
- **Don't iframe the API into slides.** Django sends `X-Frame-Options: DENY`, so an embedded browsable API won't load. Switch to the browser tab instead.
- A pre-talk checklist: deck built and running locally, Wi-Fi-off test passed, videos play, presenter's own project reset to `checkpoint-0-setup` with a fresh database.

---

## 9. Getting the code onto slides

- Clone the workshop repo next to this one, or as a read-only reference at `vendor/questions-api` (gitignored).
- Write `scripts/extract-snippets.sh`. It should run `git show <branch>:<path>` for every file that changes, at every checkpoint, writing to `slides/snippets/<branch>/<path>`. It should also write each checkpoint's diff to `slides/snippets/diffs/`.
- No slide in this deck presents code. The snippets feed `notes/cheat-sheet.md` and the projector check's code sample. If a slide ever imports a snippet, use Slidev's code-snippet import (`<<< @/snippets/…`) so the slide is the real file.
- `checkpoint-2-actions` and `checkpoint-3-auth` have two blank lines between `upvote` and `toggle_answered`. Show the code as it is in the repo, unless the presenter fixes it upstream first.
- If the workshop repo changes later, rerunning the script should be the only step needed to update the slides.

---

## 10. Build phases and review checkpoints

1. **Scaffold and look.** Slidev in `slides/`, `tokens.css`, self-hosted fonts, deck-wide transition, projector-check slide and toggle, snippet extraction script. Build the title slide, one concept slide, and one code slide as samples. **Stop for the presenter's review of the look.**
2. **Skeleton and notes.** Every slide from section 7 with final text, static diagrams, real code, and full presenter notes. Placeholder frames where videos will go. **Stop for review of content and notes.**
3. **Flow docs.** `presenter-flow.md`, `cheat-sheet.md`, `screen-setup.md`.
4. **Click builds and Magic Move.** One section at a time, checked against section 6.
5. **Videos.** V1–V3 in `animations/`, rendered and embedded with `StepVideo`. **Stop for review of the videos.**
6. **QA.**
   - Click through the whole deck in presenter view: every click, note, and video stop.
   - Check estimated speaking time per section against section 3 and flag anything over.
   - Run the section 5.2 checklist against every slide and remove anything on it.
   - `slidev build` works with networking off.
   - `slidev export` produces a readable PDF backup that shows final states and video posters.
   - Every slide stays readable with the projector toggle on.
   - Every code snippet matches its checkpoint branch, and every response on a slide matches section 2.

**Done when:** all slides in section 7 plus the appendix exist; every slide has notes in the 8.1 format; the three notes files exist; V1–V3 render from source; the deck runs offline; the PDF export exists; and the README explains how to run, present, export, and refresh snippets.

---

## 11. Inputs to ask the presenter for

Use clearly marked placeholders until you have these:
- Only if a closing slide comes back: the Developer Club logo, the next club event, and a resource-list link for a "where to go next" QR code
- Whether there will be a public, deployed instance for the audience to use. If so, get its URL and which checkpoint it runs. It's shown by switching to a browser tab, never in an iframe.
