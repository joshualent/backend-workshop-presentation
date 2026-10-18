---
part: Lesson 1
clicks: 6
---

# Lesson 1: A model becomes a table

<div class="models">
<p>Each model becomes a database table, and each field becomes a column.</p>

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
[7:17 · 25 min] [SLIDES]

- Lesson 1 is CRUD: create, read, update, and delete. We write the model, the serializer, the ViewSet, and the URLs, from right to left on the diagram. By 7:42 your API handles the request from the video.
- A model describes one kind of data we store. We write one class, `Question`, with four fields.

[click] `text` is a CharField, stored as a `varchar(300)` column. A CharField needs a `max_length`.

[click] `votes` is an IntegerField with `default=0`, so every new question has 0 votes.

[click] `answered` is a BooleanField with `default=False`. SQLite stores it as 0 or 1.

[click] `created_at` has `auto_now_add=True`, so Django sets it when it creates the row.

[click] We don't write `id`. Django adds an `id` primary key to every model and numbers the rows 1, 2, 3.

[click] Say: "makemigrations writes a file that describes the change. migrate changes the database to match. Run both every time you change a model."

- Say: "Now we write all of lesson 1 in VS Code. The slides come back when the lesson works."

→ SWITCH TO VS CODE (7:19): questions/models.py (cheat sheet step 1)

- Replace the stub with the `Question` class. Type it with the room, and say each field name as you type it.
- Add `__str__`, which returns `self.text`. The admin then shows the question text instead of "Question object (1)". Save.

→ SWITCH TO TERMINAL (7:21): the second terminal; runserver keeps running in the first

- `uv run manage.py makemigrations questions` → expect `questions/migrations/0001_initial.py` and `+ Create model Question`.
- `uv run manage.py migrate` → expect `Applying questions.0001_initial... OK`.
- Open `questions/migrations/0001_initial.py` for ten seconds. Say: "Django generated this file from the model. migrate reads it to create the table."

→ SWITCH TO VS CODE (7:23): questions/serializers.py (cheat sheet step 2; the file exists but is empty)

- Say: "A serializer converts JSON to a Question and back. It also checks incoming data before anything is saved. That's the step in the video where `votes` disappeared."
- Type a `ModelSerializer` for `Question`, the `fields` tuple, and then `read_only_fields`.
- Point at `read_only_fields`: "Only `text` is writable. The server sets the other fields, so a client can't send its own vote count." Save. You don't need a migration, because serializers don't change the database.

Still in VS Code (7:26): questions/views.py, then config/urls.py (cheat sheet steps 3 and 4)

- Say: "A ViewSet is one class that handles every route for a resource. `ModelViewSet` already has a method for each of the six routes from the HTTP methods slide: list, create, retrieve, update, partial_update, and destroy."
- `views.py`: replace the stub. The imports, then `QuestionViewSet` with three attributes: `queryset` (which rows), `serializer_class` (how to convert them to JSON), and `permission_classes`. Say: "For now, `AllowAny` lets anyone call every route. Lesson 3 replaces it." Save.
- `config/urls.py`: two imports, a `DefaultRouter`, `router.register("questions", QuestionViewSet, basename="question")`, and the `api/` line. Save. Say: "The router creates the six routes from the ViewSet, under `/api/questions/`."
- Watch the runserver terminal. It reloads when you save, and it shows typos there first.

→ SWITCH TO BROWSER (7:30): http://127.0.0.1:8000/api/questions/

- Expect the browsable API page "Question List" with `[]` and a form at the bottom.

→ SWITCH TO VS CODE (7:31): questions/admin.py (cheat sheet step 5)

- Replace the stub: import `Question`, then add `admin.site.register(Question)`. Save. Say: "With this line, the Django admin can list, add, edit, and delete questions."

→ SWITCH TO TERMINAL

- Run `uv run manage.py createsuperuser` with the username `mod`. This is the moderator account for lesson 3. Attendees can create theirs now or in lesson 3.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/

- Log in as `mod`. Click Questions. Add one question in the admin, then show it at `/api/questions/`. The admin and the API read the same database table.

→ SWITCH TO BROWSER (7:35): http://127.0.0.1:8000/api/questions/ to try it

- Use the form at the bottom of the page (Raw data tab, media type `application/json`). Send each request and read the status code out loud. Remind the room of the first digit: 2 means it worked, 4 means a problem with the request.
- Create: `{"text": "What does a serializer do?"}` → `HTTP 201 Created` with `"votes": 0`.
- Blank text: `{"text": ""}` → `HTTP 400 Bad Request` and `"This field may not be blank."`. Nothing was saved.
- Not found: open http://127.0.0.1:8000/api/questions/999/ → `HTTP 404 Not Found` and `"No Question matches the given query."`.
- Optional curl example (cut this first if you're behind): `curl -i -X POST http://127.0.0.1:8000/api/questions/ -H "Content-Type: application/json" -d '{"text": "What does a serializer do?"}'` → `HTTP/1.1 201 Created`. Say: "curl calls the same API without a browser."
- Last, the problem lesson 2 fixes. Send `{"text": "hi", "votes": 9999}` → `HTTP 201 Created` with `"votes": 0`. Say: "The server ignored our vote count. `votes` and `answered` are read-only, so no client can vote or mark a question answered yet."

Back here when: most of the room has a 201 and a 400 of their own (7:42).

If behind: anyone stuck can switch to `checkpoint-1-crud` with the line on the next slide. Cut the curl example first, then the admin demo (keep the one line in `admin.py`). Time check: if lesson 1 isn't done by 7:45, paste lesson 2's code from the cheat sheet instead of typing it.
-->
