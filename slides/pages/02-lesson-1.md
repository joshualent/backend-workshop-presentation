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
-->

---
plan: 14
---

# Models become tables

<div class="model-table">
<div>
<div class="file-label">questions/models.py</div>

<!-- code-block: models-fields -->
```python {*|2|3|4|5|*}
class Question(models.Model):
    text = models.CharField(max_length=300)
    votes = models.IntegerField(default=0)
    answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```
<!-- /code-block -->

</div>

<QuestionTable />

<p v-click="6" class="small"><code>makemigrations</code> writes the change down. <code>migrate</code> applies it.</p>

<RequestMap mini highlight="model" class="push-down" />
</div>

<style>
.model-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
</style>

<!--
[7:16 · 2 min] [SLIDES]

- A model is a Python class that describes one kind of thing we store. Django turns it into a database table.

[click] `text` becomes a `varchar(300)` column. CharField needs a max length.

[click] `votes` becomes an integer column, starting at 0.

[click] `answered` becomes a boolean. SQLite stores it as 0 or 1.

[click] `created_at` is filled in automatically when the row is created.

[click] `id`: we never wrote it. Django adds a primary key to every model.

[click] Migrations: "makemigrations writes down what changed, migrate makes the database match. Two commands, every time you change a model."
-->

---
plan: 15
---

# Write the model

<div class="stack">
<div>
<div class="file-label">questions/models.py</div>

<<< @/snippets/checkpoint-1-crud/questions/models.py

</div>
<div>
<div class="file-label">Then, in a second terminal</div>

```bash
uv run manage.py makemigrations questions
uv run manage.py migrate
```

</div>
</div>

<!--
[7:18 · 5 min] [VS CODE]

- Replace the stub in `questions/models.py` with the class. Type it with the room; say each field as you type it.
- `__str__` makes the admin show the question text instead of "Question object (1)".

→ SWITCH TO VS CODE: questions/models.py

- Type the model. Save.

→ SWITCH TO TERMINAL (second terminal, runserver keeps running in the first)

- `uv run manage.py makemigrations questions` → expect `questions/migrations/0001_initial.py` and `+ Create model Question`.
- `uv run manage.py migrate` → expect `Applying questions.0001_initial... OK`.
- Open `questions/migrations/0001_initial.py` for ten seconds: "Django wrote this for us. It's how the database learns about the model."

Back here when: most of the room has `Applying questions.0001_initial... OK`.

If behind: anyone stuck can paste the model from the slide; the migration commands are the part that matters.
-->

---
plan: 16
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
[7:23 · 2 min] [SLIDES]

- Two jobs: translate (JSON to Python objects and back) and check (validate input before anything is saved).

[click] Someone sends `"votes": 9999`. We marked `votes` read-only, so it's ignored and the question starts at 0. Response is 201: the request still worked.

[click] Blank text: 400 Bad Request with a message per field. Nothing reaches the database.

[click] Callback: "Never trust the client. The serializer is where we stop trusting it."
-->

---
plan: 17
---

# Write the serializer

<div class="stack">
<div>
<div class="file-label">questions/serializers.py</div>

<<< @/snippets/checkpoint-1-crud/questions/serializers.py {*|10}

</div>
<p v-click="1" class="small">Only <code>text</code> is writable. Everything else, the server fills in.</p>
</div>

<!--
[7:25 · 3 min] [VS CODE]

- `ModelSerializer` reads the model and builds the fields for us.
- `fields` lists what goes in the JSON, in order.

[click] `read_only_fields`: clients can see these but never set them. This is the line that made `"votes": 9999` harmless.

→ SWITCH TO VS CODE: questions/serializers.py (the file exists but is empty)

- Type it. Save. No migration: serializers don't touch the database.

Back here when: most people have saved serializers.py.

If behind: paste it from the cheat sheet; nobody needs to type `fields` twice.
-->

---
plan: 18
---

# One ViewSet, six routes

<div class="viewset">
<div>
<div class="file-label">questions/views.py</div>

<!-- code-block: viewset-cp1 -->
```python
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
```
<!-- /code-block -->

</div>
<div v-click="1" class="routes-wrap">
<p class="small muted">A <code>DefaultRouter</code> reads the ViewSet and makes six routes:</p>
<RouteList actions />
</div>
</div>

<style>
.viewset {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.viewset .routes-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

<!--
[7:28 · 2 min] [SLIDES]

- A ViewSet is one class that handles every operation on a resource.
- `queryset`: which rows. `serializer_class`: how to turn them into JSON. `permission_classes`: who may call it.
- `ModelViewSet` already contains list, create, retrieve, update, partial_update, and destroy.

[click] The router turns one ViewSet into six routes. The names on the right are the ViewSet methods each route calls. Remember `update`, `partial_update`, and `destroy`: they come back in lesson 3.
-->

---
plan: 19
---

# Write the view and routes

<div class="swap">
<div v-click.hide="2">
<div class="file-label">questions/views.py</div>

<<< @/snippets/checkpoint-1-crud/questions/views.py {*|11}

</div>
<div v-click="2">
<div class="file-label">config/urls.py</div>

<<< @/snippets/checkpoint-1-crud/config/urls.py

</div>
</div>

<!--
[7:30 · 5 min] [VS CODE]

- `views.py`: imports, then the ViewSet from the last slide.

[click] `AllowAny`: "Permissions exist, and right now everyone is allowed everything. Remember this line; we come back to it in lesson 3."

[click] `config/urls.py`: make a `DefaultRouter`, register the ViewSet under `questions`, and include its URLs under `api/`. That's where `/api/questions/` comes from.

→ SWITCH TO VS CODE: questions/views.py, then config/urls.py

- Replace the stub in `views.py`. Save.
- Edit `config/urls.py`: two imports, the router, and the `api/` line. Save.
- Watch the runserver terminal: it reloads on save. Any typo shows up there first.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/

- Expect the browsable API page "Question List" with `[]` and a form at the bottom.

Back here when: most people see "Question List".

If behind: `git switch checkpoint-1-crud` gets anyone stuck to this point (stash first).
-->

---
plan: 20
---

# See it in the admin

<div class="stack">
<div>
<div class="file-label">questions/admin.py</div>

<<< @/snippets/checkpoint-1-crud/questions/admin.py {3,5}

</div>
<p>One line gives you pages at <code>/admin/</code> to list, add, edit, and delete questions.</p>
<p class="small muted">You need an account to log in: <code>uv run manage.py createsuperuser</code>.</p>
</div>

<!--
[7:35 · 2 min] [BROWSER]

- The admin is Django's built-in back office. Registering a model gives it pages for free.

→ SWITCH TO VS CODE: questions/admin.py

- Replace the stub with the import and `admin.site.register(Question)`. Save.

→ SWITCH TO TERMINAL

- `uv run manage.py createsuperuser`, username `mod`. This is the moderator account we use in lesson 3. Attendees can make theirs now or wait for lesson 3.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/

- Log in as `mod`. Click Questions. Add one question here, then show it at `/api/questions/`: same database, two doors.

Back here when: you've shown the question in both places.

If behind: cut the demo (cut list item 2). Keep the one line of code and move on.
-->

---
plan: 21
---

# Try it

<div class="tries">
<Exchange method="POST" url="/api/questions/" body='{"text": "What does a serializer do?"}' :status="201" response='{"id": 1, "text": "What does a serializer do?", "votes": 0, …}' :at="1" />
<Exchange method="POST" url="/api/questions/" body='{"text": ""}' :status="400" response='{"text": ["This field may not be blank."]}' :at="2" />
<Exchange method="GET" url="/api/questions/999/" :status="404" response='{"detail": "No Question matches the given query."}' :at="3" />
</div>

<style>
.tries {
  display: flex;
  flex-direction: column;
  gap: 26px;
}
</style>

<!--
[7:37 · 4 min] [BROWSER]

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/

- Use the form at the bottom of the page (Raw data tab, media type `application/json`). Run each one, then come back and click.

[click] Create: paste `{"text": "What does a serializer do?"}` and press POST. Expect `HTTP 201 Created` with `"votes": 0`.

[click] Blank text: `{"text": ""}`. Expect `HTTP 400 Bad Request` and `"This field may not be blank."`.

[click] Not found: open http://127.0.0.1:8000/api/questions/999/. Expect `HTTP 404 Not Found` and `"No Question matches the given query."`.

- Optional curl aside (first thing to cut): in the terminal, `curl -i -X POST http://127.0.0.1:8000/api/questions/ -H "Content-Type: application/json" -d '{"text": "What does a serializer do?"}'` → `HTTP/1.1 201 Created`. "Same API, no browser."

Back here when: most of the room has a 201 and a 400 of their own.

If behind: skip the curl aside. Time check: if lesson 1 isn't done by 7:45, skip the "your turn" exercise in lesson 2 (slide 27).
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

- Recap: a full CRUD API in four files.
- But `votes` and `answered` are read-only, so no client can vote or mark anything answered.

Ask: "How should voting work? Should the client just send the new number?" Take one or two answers; the next lesson starts from them.
-->
