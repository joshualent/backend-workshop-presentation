---
layout: section
plan: 13
---

# Lesson 1: CRUD

<p>Store questions in a database, and create, read, update, and delete them over HTTP.</p>

<!--
[7:15 · 1 min] [SLIDES]

- CRUD stands for create, read, update, and delete: the four basic operations on stored data.
- By 7:42, everyone has a working API that can create and read questions.
- The order: model, serializer, view and URLs, then the admin. That is right to left on the diagram.
- Say: "From here on, the slides explain the ideas, and we write the code together in the editor."
-->

---
plan: 14–15
clicks: 6
---

# A model becomes a database table

<div class="models">
<p>Each model becomes a table, and each field becomes a column.</p>

<QuestionTable />

<p v-click="6" class="small"><code>makemigrations</code> writes a migration file. <code>migrate</code> applies it.</p>

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

- A model describes one kind of data we store. We write one class, `Question`, with four fields.

[click] `text` is a CharField, stored as a `varchar(300)` column. A CharField needs a `max_length`.

[click] `votes` is an IntegerField with `default=0`, so every new question has 0 votes.

[click] `answered` is a BooleanField with `default=False`. SQLite stores it as 0 or 1.

[click] `created_at` has `auto_now_add=True`, so Django sets it when it creates the row.

[click] We don't write `id`. Django adds an `id` primary key to every model and numbers the rows 1, 2, 3.

[click] Say: "makemigrations writes a file that describes the change. migrate changes the database to match. Run both every time you change a model."

→ SWITCH TO VS CODE (7:18): questions/models.py (cheat sheet step 1)

- Replace the stub with the `Question` class. Type it with the room, and say each field name as you type it.
- Add `__str__`, which returns `self.text`. The admin then shows the question text instead of "Question object (1)". Save.

→ SWITCH TO TERMINAL (7:20): the second terminal; runserver keeps running in the first

- `uv run manage.py makemigrations questions` → expect `questions/migrations/0001_initial.py` and `+ Create model Question`.
- `uv run manage.py migrate` → expect `Applying questions.0001_initial... OK`.
- Open `questions/migrations/0001_initial.py` for ten seconds. Say: "Django generated this file from the model. migrate reads it to create the table."

Back here when: most of the room has `Applying questions.0001_initial... OK` (7:23).

If behind: leave `models.py` on the projector so people can copy it. Make sure everyone runs both migration commands.
-->

---
plan: 16–17
---

# A serializer converts and validates data

<div class="serial">
<p>A serializer converts JSON to Python objects and back. It also validates incoming data before anything is saved.</p>

<div v-click="1" class="case">
<Exchange method="POST" url="/api/questions/" body='{"text": "hi", "votes": 9999}' :status="201" response='{"id": 2, "text": "hi", "votes": 0, …}' />
<p class="small muted">votes is read-only, so the serializer ignores it.</p>
</div>

<div v-click="2" class="case">
<Exchange method="POST" url="/api/questions/" body='{"text": ""}' :status="400" response='{"text": ["This field may not be blank."]}' />
<p class="small muted">Blank text fails validation, so the server saves nothing.</p>
</div>

<p v-click="3" class="lead accent">Always validate data that comes from the client.</p>

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

- A serializer does two things. It converts JSON to Python objects and back, and it validates input before the server saves anything.
- In our serializer, only `text` is writable. `id`, `votes`, `answered`, and `created_at` are read-only, so the server sets them.

[click] A client sends `"votes": 9999`. `votes` is read-only, so the serializer ignores it and the question starts at 0. The response is still 201, because the question was created.

[click] Blank text gets a 400 Bad Request response with an error message for each invalid field. Nothing is saved to the database.

[click] Say: "Any client can send any data, so the server validates everything it receives. In DRF, the serializer does that."

→ SWITCH TO VS CODE (7:25): questions/serializers.py (cheat sheet step 2; the file exists but is empty)

- Type a `ModelSerializer` for `Question`, the `fields` tuple, and then `read_only_fields`.
- Point at `read_only_fields`: "Because of this line, the serializer ignores `"votes": 9999`."
- Save. You don't need a migration, because serializers don't change the database.

Back here when: most people have saved serializers.py (7:28).

If behind: paste the file from the cheat sheet.
-->

---
plan: 18–21
---

# One ViewSet handles six routes

<div class="viewset">
<p>A ViewSet is one class that handles every operation on a resource. Ours is <code>QuestionViewSet</code>.</p>

<div v-click="1" class="routes-wrap">
<p class="small muted">DRF's <code>DefaultRouter</code> creates six routes from it:</p>
<RouteList actions />
</div>

<p v-click="2" class="small">For now, <code>AllowAny</code> lets anyone call every route. Lesson 3 adds restrictions.</p>

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

- `ModelViewSet` already has the methods list, create, retrieve, update, partial_update, and destroy. We set three attributes: `queryset` (which rows), `serializer_class` (how to convert them to JSON), and `permission_classes` (who may call it).

[click] The router creates six routes from one ViewSet. The names on the right are the ViewSet methods that each route calls. Lesson 3 uses the names `update`, `partial_update`, and `destroy`.

[click] Say: "Right now, `AllowAny` lets anyone do anything. Lesson 3 replaces it."

→ SWITCH TO VS CODE (7:30): questions/views.py, then config/urls.py (cheat sheet steps 3 and 4)

- `views.py`: replace the stub. The imports, then `QuestionViewSet` with its three lines. Save.
- `config/urls.py`: two imports, a `DefaultRouter`, `router.register("questions", QuestionViewSet, basename="question")`, and the `api/` line. Save. Say: "These lines create the `/api/questions/` URL."
- Watch the runserver terminal. It reloads when you save, and it shows typos there first.

→ SWITCH TO BROWSER (7:34): http://127.0.0.1:8000/api/questions/

- Expect the browsable API page "Question List" with `[]` and a form at the bottom.

→ SWITCH TO VS CODE (7:35): questions/admin.py (cheat sheet step 5)

- Replace the stub: import `Question`, then add `admin.site.register(Question)`. Save. Say: "With this line, the Django admin can list, add, edit, and delete questions."

→ SWITCH TO TERMINAL

- Run `uv run manage.py createsuperuser` with the username `mod`. This is the moderator account for lesson 3. Attendees can create theirs now or in lesson 3.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/

- Log in as `mod`. Click Questions. Add one question in the admin, then show it at `/api/questions/`. The admin and the API read the same database table.

→ SWITCH TO BROWSER (7:37): http://127.0.0.1:8000/api/questions/ to try it

- Use the form at the bottom of the page (Raw data tab, media type `application/json`). Send each request and read the status code out loud.
- Create: `{"text": "What does a serializer do?"}` → `HTTP 201 Created` with `"votes": 0`.
- Blank text: `{"text": ""}` → `HTTP 400 Bad Request` and `"This field may not be blank."`.
- Not found: open http://127.0.0.1:8000/api/questions/999/ → `HTTP 404 Not Found` and `"No Question matches the given query."`.
- Optional curl example (cut this first if you're behind): `curl -i -X POST http://127.0.0.1:8000/api/questions/ -H "Content-Type: application/json" -d '{"text": "What does a serializer do?"}'` → `HTTP/1.1 201 Created`. Say: "curl calls the same API without a browser."

Back here when: most of the room has a 201 and a 400 of their own (7:41).

If behind: anyone stuck can run `git switch checkpoint-1-crud` (stash first, as on slide 12). Cut the curl example first, then the admin demo (keep the one line in `admin.py`). Time check: if lesson 1 isn't done by 7:45, paste lesson 2's code from the cheat sheet instead of typing it.
-->

---
plan: 22
---

# What's still broken?

<div class="broken">
<span class="muted">Works</span><span>Clients can create, list, read, edit, and delete questions.</span>
<span class="muted">Doesn't work</span><span>Clients can't change <code>votes</code> or <code>answered</code>, because both fields are read-only.</span>
</div>

<p class="lead accent">How should voting work?</p>

<style>
.broken {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 14px 20px;
  align-items: baseline;
}
</style>

<!--
[7:41 · 1 min] [SLIDES]

- Recap: we have a CRUD API and an admin, from five short files.
- `votes` and `answered` are read-only, so no client can vote or mark a question answered.

Ask: "How should voting work? Should the client send the new vote count?" Take one or two answers. The next slide starts from them.
-->
