---
layout: section
plan: 13
---

# Lesson 1: CRUD

<p>Store questions and expose them over HTTP.</p>

<!--
[7:15 · 1 min] [SLIDES]

- CRUD is create, read, update, delete: the four things you do to stored data.
- By 7:42 everyone has a working API they can create and read questions with.
- Order tonight: model, serializer, view and URLs, admin. Right to left on the map.
- Say: "From here on, the slides are the ideas. The code happens in the editor, and you type it with me."
-->

---
plan: 14–15
clicks: 6
---

# Models become tables

<div class="models">
<p>Django turns a model into a table. Each field becomes a column.</p>

<QuestionTable />

<p v-click="6" class="small"><code>makemigrations</code> writes the change down. <code>migrate</code> applies it.</p>

<RequestMap mini highlight="model" class="push-down" />
</div>

<style>
.models {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}
</style>

<!--
[7:16 · 7 min] [SLIDES]

- A model describes one kind of thing we store. We write one class, `Question`, with four fields.

[click] `text` is a CharField: a `varchar(300)` column. CharField needs a max length.

[click] `votes` is an IntegerField with `default=0`: every question starts at 0.

[click] `answered` is a BooleanField, `default=False`. SQLite stores it as 0 or 1.

[click] `created_at` uses `auto_now_add=True`: Django fills it in when the question is created.

[click] `id`: we never write it. Django adds a primary key to every model, numbered 1, 2, 3.

[click] Migrations: "makemigrations writes down what changed, migrate makes the database match. Two commands, every time you change a model."

→ SWITCH TO VS CODE (7:18): questions/models.py (cheat sheet step 1)

- Replace the stub with the `Question` class. Type it with the room; say each field as you type it.
- Add `__str__` returning `self.text`: the admin then shows the question text instead of "Question object (1)". Save.

→ SWITCH TO TERMINAL (7:20): the second terminal; runserver keeps running in the first

- `uv run manage.py makemigrations questions` → expect `questions/migrations/0001_initial.py` and `+ Create model Question`.
- `uv run manage.py migrate` → expect `Applying questions.0001_initial... OK`.
- Open `questions/migrations/0001_initial.py` for ten seconds: "Django wrote this for us. It's how the database learns about the model."

Back here when: most of the room has `Applying questions.0001_initial... OK` (7:23).

If behind: leave `models.py` on the projector so people can copy it; the migration commands are the part that matters.
-->

---
plan: 16–17
---

# Serializers translate and check

<div class="serial">
<p>A serializer turns JSON into Python and back, and checks what comes in.</p>

<div v-click="1" class="case">
<Exchange method="POST" url="/api/questions/" body='{"text": "hi", "votes": 9999}' :status="201" response='{"id": 2, "text": "hi", "votes": 0, …}' />
<p class="small muted">votes is read-only, so the server ignores it.</p>
</div>

<div v-click="2" class="case">
<Exchange method="POST" url="/api/questions/" body='{"text": ""}' :status="400" response='{"text": ["This field may not be blank."]}' />
<p class="small muted">Blank text fails the check. Nothing is saved.</p>
</div>

<p v-click="3" class="lead accent">Never trust the client.</p>

<RequestMap mini highlight="serializer" class="push-down" />
</div>

<style>
.serial {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}
.serial .case {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>

<!--
[7:23 · 5 min] [SLIDES]

- Two jobs: translate (JSON to Python objects and back) and check (validate input before anything is saved).
- In our serializer only `text` is writable. `id`, `votes`, `answered`, and `created_at` are read-only: the server fills them in.

[click] Someone sends `"votes": 9999`. `votes` is read-only, so it's ignored and the question starts at 0. Response is 201: the request still worked.

[click] Blank text: 400 Bad Request with a message per field. Nothing reaches the database.

[click] Callback: "Never trust the client. The serializer is where we stop trusting it."

→ SWITCH TO VS CODE (7:25): questions/serializers.py (cheat sheet step 2; the file exists but is empty)

- Type it: a `ModelSerializer` for `Question`, the `fields` tuple, then `read_only_fields`.
- Point at `read_only_fields`: "This is the line that makes `"votes": 9999` harmless."
- Save. No migration: serializers don't touch the database.

Back here when: most people have saved serializers.py (7:28).

If behind: paste it from the cheat sheet; nobody needs to type `fields` twice.
-->

---
plan: 18–21
---

# One ViewSet, six routes

<div class="viewset">
<p>A ViewSet is one class that handles every operation on a resource. Ours is <code>QuestionViewSet</code>.</p>

<div v-click="1" class="routes-wrap">
<p class="small muted">A <code>DefaultRouter</code> reads it and makes six routes:</p>
<RouteList actions />
</div>

<p v-click="2" class="small">Who may call them? For now, anyone: <code>AllowAny</code>. Lesson 3 changes that.</p>

<RequestMap mini :highlight="['router', 'viewset']" class="push-down" />
</div>

<style>
.viewset {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}
.viewset .routes-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

<!--
[7:28 · 13 min] [SLIDES]

- `ModelViewSet` already contains list, create, retrieve, update, partial_update, and destroy. We only tell it three things: `queryset` (which rows), `serializer_class` (how to turn them into JSON), and `permission_classes` (who may call it).

[click] The router turns one ViewSet into six routes. The names on the right are the ViewSet methods each route calls. Remember `update`, `partial_update`, and `destroy`: they come back in lesson 3.

[click] `AllowAny`: "Permissions exist, and right now everyone is allowed everything. Remember this line; lesson 3 changes it."

→ SWITCH TO VS CODE (7:30): questions/views.py, then config/urls.py (cheat sheet steps 3 and 4)

- `views.py`: replace the stub. The imports, then `QuestionViewSet` with its three lines. Save.
- `config/urls.py`: two imports, a `DefaultRouter`, `router.register("questions", QuestionViewSet, basename="question")`, and the `api/` line. Save. "That's where `/api/questions/` comes from."
- Watch the runserver terminal: it reloads on save. Any typo shows up there first.

→ SWITCH TO BROWSER (7:34): http://127.0.0.1:8000/api/questions/

- Expect the browsable API page "Question List" with `[]` and a form at the bottom.

→ SWITCH TO VS CODE (7:35): questions/admin.py (cheat sheet step 5)

- Replace the stub: import `Question`, then `admin.site.register(Question)`. Save. "One line, and Django builds a back office for questions."

→ SWITCH TO TERMINAL

- `uv run manage.py createsuperuser`, username `mod`. This is the moderator account we use in lesson 3. Attendees can make theirs now or wait for lesson 3.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/

- Log in as `mod`. Click Questions. Add one question here, then show it at `/api/questions/`: same database, two doors.

→ SWITCH TO BROWSER (7:37): http://127.0.0.1:8000/api/questions/ to try it

- Use the form at the bottom of the page (Raw data tab, media type `application/json`). Run each one and read the status out loud.
- Create: `{"text": "What does a serializer do?"}` → `HTTP 201 Created` with `"votes": 0`.
- Blank text: `{"text": ""}` → `HTTP 400 Bad Request` and `"This field may not be blank."`.
- Not found: open http://127.0.0.1:8000/api/questions/999/ → `HTTP 404 Not Found` and `"No Question matches the given query."`.
- Optional curl aside (first thing to cut): `curl -i -X POST http://127.0.0.1:8000/api/questions/ -H "Content-Type: application/json" -d '{"text": "What does a serializer do?"}'` → `HTTP/1.1 201 Created`. "Same API, no browser."

Back here when: most of the room has a 201 and a 400 of their own (7:41).

If behind: `git switch checkpoint-1-crud` gets anyone stuck to this point (stash first, as on slide 13). Cut the curl aside, then the admin demo (keep the one line in `admin.py`). Time check: if lesson 1 isn't done by 7:45, skip the "your turn" exercise (slide 20).
-->

---
plan: 22
---

# What's still broken?

<div class="broken">
<span class="muted">Works</span><span>Create, list, read, edit, and delete questions.</span>
<span class="muted">Broken</span><span><code>votes</code> and <code>answered</code> are read-only. Nothing can change them.</span>
</div>

<p class="lead accent">How should voting work?</p>

<style>
.broken {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px 20px;
  align-items: baseline;
}
</style>

<!--
[7:41 · 1 min] [SLIDES]

- Recap: a full CRUD API, and an admin, from five short files.
- But `votes` and `answered` are read-only, so no client can vote or mark anything answered.

Ask: "How should voting work? Should the client just send the new number?" Take one or two answers; the next lesson starts from them.
-->
