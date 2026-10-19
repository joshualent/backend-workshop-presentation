---
section: Part 1
clicks: 6
---

# Part 1: Our model becomes a table, then push that change

<div class="models">
<p>Each field becomes a column.</p>

<QuestionTable />

<p v-click="5" class="small"><code>id</code> is the primary key, the unique number that identifies each row.</p>

<p v-click="6" class="small"><code>makemigrations</code> writes a migration file. <code>migrate</code> applies it.</p>
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
[7:15 · 25 min] [SLIDES]

- Part 1 is CRUD: create, read, update, and delete. We write the model, the serializer, the ViewSet, and the URLs, from right to left on the diagram. By 7:40 your API works, and a video then shows one request going through every part you wrote.
- A model describes one kind of data we store. We write one class, `Question`, with four fields.

[click] `text` is a CharField, stored as a `varchar(300)` column. A CharField needs a `max_length`.

[click] `votes` is an IntegerField with `default=0`, so every new question has 0 votes.

[click] `answered` is a BooleanField with `default=False`. SQLite stores it as 0 or 1.

[click] `created_at` has `auto_now_add=True`, so Django sets it when it creates the row.

[click] We don't write `id`. Django adds an `id` field to every model and numbers the rows 1, 2, 3. It's the primary key: no two rows have the same `id`, so it identifies one row. Say: "The 1 in `/api/questions/1/` is the id."

[click] Say: "makemigrations writes a file that describes the change. migrate changes the database to match. Run both every time you change a model."

- Say: "Now we write all of part 1 in VS Code. The slides come back when it works."

→ SWITCH TO VS CODE (7:17): questions/models.py (cheat sheet step 1)

- Replace the stub with the `Question` class. Type it with the room, and say each field name as you type it.
- Add `__str__`, which returns `self.text`. The admin then shows the question text instead of "Question object (1)". Save.

→ SWITCH TO TERMINAL (7:19): the second terminal; runserver keeps running in the first

- `uv run manage.py makemigrations questions` → expect `questions/migrations/0001_initial.py` and `+ Create model Question`.
- `uv run manage.py migrate` → expect `Applying questions.0001_initial... OK`.
- Open `questions/migrations/0001_initial.py` for ten seconds. Say: "Django generated this file from the model. migrate reads it to create the table."

→ SWITCH TO VS CODE (7:21): questions/serializers.py (cheat sheet step 2; the file exists but is empty)

- Say: "A serializer converts JSON to a Question and back. It also checks incoming data before anything is saved."
- Type a `ModelSerializer` for `Question`, the `fields` tuple, and then `read_only_fields`.
- Point at `read_only_fields`: "Only `text` is writable. The server sets the other fields, so a client can't send its own vote count." Save. You don't need a migration, because serializers don't change the database.

Still in VS Code (7:24): questions/views.py, then config/urls.py (cheat sheet steps 3 and 4)

- Say: "A ViewSet is one class that handles every route for a resource. `ModelViewSet` already has a method for each of the six routes from the HTTP methods slide: list, create, retrieve, update, partial_update, and destroy."
- `views.py`: replace the stub. The imports, then `QuestionViewSet` with three attributes: `queryset` (which rows), `serializer_class` (how to convert them to JSON), and `permission_classes`. Say: "For now, `AllowAny` lets anyone call every route. Part 3 replaces it." Save.
- `config/urls.py`: two imports, a `DefaultRouter`, `router.register("questions", QuestionViewSet)`, and the `api/` line. Save. Say: "The router creates the six routes from the ViewSet, under `/api/questions/`."
- Watch the runserver terminal. It reloads when you save, and it shows typos there first.

→ SWITCH TO BROWSER (7:28): http://127.0.0.1:8000/api/questions/

- Expect the browsable API page "Question List" with `[]` and a form at the bottom.

→ SWITCH TO VS CODE (7:29): questions/admin.py (cheat sheet step 5)

- Replace the stub: import `Question`, then add `admin.site.register(Question)`. Save. Say: "With this line, the Django admin can list, add, edit, and delete questions."

→ SWITCH TO TERMINAL

- Run `uv run manage.py createsuperuser` with the username `mod`. This is the moderator account for part 3. Attendees can create theirs now or in part 3.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/

- Log in as `mod`. Click Questions. Add one question in the admin, then show it at `/api/questions/`. The admin and the API read the same database table.

→ SWITCH TO BROWSER (7:33): http://127.0.0.1:8000/api/questions/ to try it

- Use the form at the bottom of the page (Raw data tab, media type `application/json`). Send each request and read the status code out loud. Remind the room of the first digit: 2 means it worked, 4 means a problem with the request.
- Create: `{"text": "What does a serializer do?"}` → `HTTP 201 Created` with `"votes": 0`.
- Blank text: `{"text": ""}` → `HTTP 400 Bad Request` and `"This field may not be blank."`. Nothing was saved.
- Not found: open http://127.0.0.1:8000/api/questions/999/ → `HTTP 404 Not Found` and `"No Question matches the given query."`.
- Optional curl example (cut this first if you're behind): `curl -i -X POST http://127.0.0.1:8000/api/questions/ -H "Content-Type: application/json" -d '{"text": "What does a serializer do?"}'` → `HTTP/1.1 201 Created`. Say: "curl calls the same API without a browser."
- Last, the problem part 2 fixes. Send `{"text": "hi", "votes": 9999}` → `HTTP 201 Created` with `"votes": 0`. Say: "The server ignored our vote count. `votes` and `answered` are read-only, so no client can vote or mark a question answered yet."

Back here when: most of the room has a 201 and a 400 of their own (7:40). The next slide is video V2, which follows that last request through the code.

If behind: anyone stuck can switch to `checkpoint-1-crud` with the line on part 2's slide. Cut the curl example first, then the admin demo (keep the one line in `admin.py`). Time check: if part 1 isn't done by 7:45, paste part 2's code from the cheat sheet instead of typing it.
-->

---
section: Part 1
clicks: 6
---

# Life of a POST request

<StepVideo name="v2-life-of-a-post" alt="A POST request with votes 9999 goes from the client through the router, ViewSet, serializer, and model to SQLite, and comes back as 201 Created with votes 0." />

<!--
[7:40 · 2 min] [SLIDES]

- You're back from the browser, and part 1's code works. Say: "You just wrote the code for every box in this video. Let's watch one request go through it."
- The video sends the POST from the anatomy slide with `"votes": 9999` added, like the last request in the browser check. The video shows what each part does with it. The highlighted box moves from the client toward SQLite.
- 0:00 (hold): the client sends the request as text: the method, URL, headers, and JSON body.

[click] 0:00–0:04: the URL router matches `POST /api/questions/` to `QuestionViewSet.create`. Say: "The router only reads the URL. It doesn't look at the data."

[click] 0:04–0:11: the serializer validates the data. `votes` is read-only, so the serializer drops it. Below: a request with blank text gets a 400 response with "This field may not be blank."

[click] 0:11–0:15: the serializer creates a `Question` object. `votes` is 0 and `answered` is False, from the model's defaults.

[click] 0:15–0:19.5: Django runs an INSERT, and SQLite stores a new row with id 1.

[click] 0:19.5–0:23.5: the serializer turns the saved row into JSON.

[click] 0:23.5–0:29: the client gets `201 Created` with `"votes": 0`. Say: "The client sent 9999. The server stored 0, because only the server sets the vote count. So how should voting work?" That's part 2, on the next slide.
-->

