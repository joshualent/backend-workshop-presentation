---
layout: cover
plan: 1
---

<ClubMark :height="56" />

# Build a Q&A API with Python & Django

<p class="lead muted">Backend workshop · Developer Club, WMU</p>

<p class="small muted">Monday, October 19, 2026 · Floyd Hall D-109</p>

<!--
[6:55 · 3 min] [SLIDES]

- Welcome. Say your name and one line about what you do.
- Thank the club and the helpers. Point out where the helpers are standing.
- Say what we build: "Tonight you build an API where people ask questions, vote on them, and mark them answered. It runs on your laptop when you leave."
- Ask for a show of hands: "Who has written Python?" "Who has used Django?" "Who has called an API, from code or with curl?" Adjust your pace to the answers.
- How the night works: you type the code yourself in your own editor. Every lesson ends on a checkpoint branch, so anyone who falls behind can catch up with three commands (slide 12 shows them). If you're stuck for more than a minute, put your hand up and a helper comes to you.
-->

---
plan: 3
---

# What a backend does

<RoundTrip />

<!--
[6:58 · 1 min] [SLIDES]

- A client sends a request to the server. The server reads or writes data and sends back a response.

[click] The request: `GET /api/questions/` asks the server for the list of questions.

[click] The server reads and writes data and checks the rules. Say: "This is the code we write tonight."

[click] The response: a status code and the questions as JSON.

- Optional comparison for beginners: in a restaurant, you give your order to a waiter, the kitchen cooks it, and the waiter brings the plate back. You never go into the kitchen. The backend is the kitchen.
-->

---
plan: 4
---

# What the backend is responsible for

<ul>
<li v-click>It stores the data: questions, votes, and users.</li>
<li v-click>It enforces rules. For example, a question can't be blank.</li>
<li v-click>It decides who can do what. For example, only moderators can delete questions.</li>
</ul>

<!--
[6:59 · 2 min] [SLIDES]

- The client is any program that sends a request: a browser, a phone app, or curl. We don't control it.

[click] The database is on the server, not in the browser.

[click] The server checks every input, even if the web page already checked it. Anyone can send any request with curl, so a check in the browser doesn't protect the data. Lesson 1 adds this check.

[click] The server decides who is allowed to do what. That is lesson 3.
-->

---
plan: 5
---

# Server-rendered pages vs. an API

<StepVideo name="v1-one-backend-many-clients" loop alt="Left: a server builds a whole HTML page for one browser, which reloads. Right: the same server sends small JSON to a web app, a phone, and a terminal." />

<!--
[7:01 · 2 min] [SLIDES]

- The video loops on its own. Talk over it.
- Left: the server builds the whole HTML page and sends it to one browser. Every click loads a new page.
- Right: an API sends only the data, as JSON. A web app, a phone app, and a terminal all use the same responses.
- Say: "Tonight we build the right half: a backend that sends data, not pages."
-->

---
plan: 6
---

# Why build an API?

<ul>
<li v-click>One backend can serve many clients, such as a web app, a phone app, and a terminal.</li>
<li v-click>You can change and deploy the frontend without changing the backend.</li>
<li v-click>You can test and scale the frontend and the backend separately.</li>
</ul>

<!--
[7:03 · 1 min] [SLIDES]

[click] Every client calls the same URL, `/api/questions/`, and gets the same JSON.

[click] Example: a new screen in the phone app doesn't need a backend deploy.

[click] You can test the API without a browser. When traffic grows, you can run more API servers without touching the frontend.

- If anyone asks: Django can also render HTML pages, and for many sites that is simpler. Tonight is about APIs.
-->

---
plan: 7
clicks: 6
---

# Anatomy of a request

<RequestAnatomy />

<!--
[7:04 · 3 min] [SLIDES]

- We send this exact request in lesson 1, and the server sends back this response.

[click] The method: POST creates something. GET reads.

[click] The URL: `/api/questions/` is the list of questions.

[click] The headers describe the message. `Content-Type` says the body is JSON.

[click] The body is the data we send. We send only `text`.

[click] The response status is `201 Created`. Say: "Status codes that start with 2 mean the request worked."

[click] The response body: the server filled in `id`, `votes`, `answered`, and `created_at`. We sent only `text`.
-->

---
plan: 8
---

# The methods and status codes we use tonight

<div class="codes">
<div class="col">
<div class="file-label">Methods</div>
<div class="grid">
<MethodBadge method="GET" /><span>read</span>
<MethodBadge method="POST" /><span>create, or run an action</span>
<span class="pair"><MethodBadge method="PUT" /><MethodBadge method="PATCH" /></span><span>edit</span>
<MethodBadge method="DELETE" /><span>delete</span>
</div>
</div>
<div class="col">
<div class="file-label">Status codes</div>
<div class="grid">
<StatusBadge :code="200" /><span>success</span>
<StatusBadge :code="201" /><span>created</span>
<StatusBadge :code="400" /><span>invalid data, such as blank text</span>
<StatusBadge :code="403" /><span>you aren't allowed to do this</span>
<StatusBadge :code="404" /><span>the question doesn't exist</span>
</div>
</div>
</div>

<style>
.codes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
}
.codes .grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px 16px;
  align-items: baseline;
  font-size: var(--fs-small);
}
.codes .grid > :nth-child(odd) {
  font-size: var(--fs-code);
  justify-self: start;
}
.codes .pair {
  display: flex;
  gap: 6px;
}
</style>

<!--
[7:07 · 1 min] [SLIDES]

- The method tells the server what to do with the URL. We use all of these tonight.
- PUT replaces all the writable fields. PATCH changes only the fields you send. In our API they behave the same, because `text` is the only writable field.
- When we see each status code: 201 when we create a question, 400 when the text is blank, and 404 for a question that doesn't exist. From lesson 3 on, we get 403 when you're logged out or not staff.
- Optional: logged-out requests get 403, not 401, because the browsable API uses session login. Skip this unless someone asks.
-->

---
plan: 9
---

# Resources and URLs

<div class="stack">
<p><code>/api/questions/</code> is the collection of all questions.<br><code>/api/questions/1/</code> is the question with id 1.</p>

<RouteList :at="1" />

<p v-click="2" class="small">In lesson 2 we add actions, such as <MethodBadge method="POST" /> <code>/api/questions/1/upvote/</code></p>
</div>

<!--
[7:08 · 2 min] [SLIDES]

- A resource is a kind of data that the API makes available. Our only resource is questions.
- There are two URLs: one for the collection and one for a single question. Django needs the trailing slash, so keep it.

[click] These are the six routes from the README. Two use the collection URL: list and create. Four use the single-question URL: read, replace, change part of it, and delete. Say: "Two URLs give six operations. The method picks the operation."

[click] An action is an operation that isn't create, read, update, or delete. We add actions in lesson 2.
-->

---
plan: 10
---

# The parts of our API

<div class="stack">
<RequestMap :build="1" />
<p v-click="7" class="small">We build these parts from left to right, starting with the model.</p>
</div>

<!--
[7:10 · 2 min] [SLIDES]

- This diagram comes back on later slides. Each box except SQLite and the client is a file you edit tonight. The boxes are in the order we build them.
- First box: SQLite, the file `db.sqlite3`, stores the rows. `migrate` creates its tables.

[click] The model, in `models.py`, describes a question as a Python class.

[click] The serializer, in `serializers.py`, converts between JSON and Python and validates incoming data.

[click] The ViewSet, in `views.py`, handles each request: list, create, and so on.

[click] The URL router, in `config/urls.py`, reads the URL and picks the ViewSet method to run.

[click] The client sends the request: a browser, an app, or curl. The request goes right to left, from the client to the database.

[click] The response goes back to the client as JSON, along the bottom arrow.

[click] Say: "We build from the left. The model comes first, because every other part uses it."
-->

---
plan: 11
clicks: 6
---

# Life of a POST request

<StepVideo name="v2-life-of-a-post" alt="A POST request with votes 9999 goes from the client through the router, ViewSet, serializer, and model to SQLite, and comes back as 201 Created with votes 0." />

<!--
[7:12 · 2 min] [SLIDES]

- This is the same POST request as before, but the client also sends `"votes": 9999`. The video shows what each part does with it. The highlighted box moves from the client on the right toward SQLite on the left.
- 0:00 (hold): the client sends the request as text: the method, URL, headers, and JSON body.

[click] 0:00–0:04: the URL router matches `POST /api/questions/` to `QuestionViewSet.create`. Say: "The router only reads the URL. It doesn't look at the data."

[click] 0:04–0:11: the serializer validates the data. `votes` is read-only, so the serializer drops it. Below: a request with blank text gets a 400 response with "This field may not be blank."

[click] 0:11–0:15: the serializer creates a `Question` object. `votes` is 0 and `answered` is False, from the model's defaults.

[click] 0:15–0:19.5: Django runs an INSERT, and SQLite stores a new row with id 1.

[click] 0:19.5–0:23.5: the serializer turns the saved row into JSON.

[click] 0:23.5–0:29: the client gets `201 Created` with `"votes": 0`. Say: "The client sent 9999. The server stored 0, because only the server sets the vote count."
-->

---
plan: 12
---

# Your starter repo

<div class="repo">
<div>
<FileTree :highlight="['config/urls.py', 'questions/models.py', 'questions/serializers.py', 'questions/views.py']" :hide="['.gitignore', '.python-version', 'INITIAL_SETUP.md', 'uv.lock', 'config/__init__.py', 'config/asgi.py', 'config/wsgi.py', 'questions/__init__.py', 'questions/apps.py', 'questions/tests.py', 'questions/migrations/__init__.py']" />
</div>
<div class="stack">
<div>
<div class="file-label">Checkpoint branches</div>
<div class="branches">
<code>checkpoint-0-setup</code><span>where you are now</span>
<code>checkpoint-1-crud</code><span>after lesson 1</span>
<code>checkpoint-2-actions</code><span>after lesson 2</span>
<code>checkpoint-3-auth</code><span>after lesson 3</span>
<code>checkpoint-4-m2m</code><span>the finished API</span>
</div>
</div>
<div>
<div class="file-label">If you fall behind, run:</div>

```bash
git stash push -u -m "my work"
git switch checkpoint-1-crud
uv run manage.py migrate
```

</div>
</div>
</div>

<style>
.repo {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}
.branches {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 18px;
  align-items: baseline;
}
.branches code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 600;
}
.branches span {
  font-size: var(--fs-small);
  color: var(--text-2);
}
</style>

<!--
[7:14 · 1 min] [SLIDES]

- We edit the highlighted files tonight: `models.py`, `serializers.py`, `views.py`, and `config/urls.py`. One line also goes in `admin.py`.
- `rest_framework` and `questions` are already in `INSTALLED_APPS`, so you don't need to set anything up.
- Each checkpoint branch has the finished code for one lesson. `main` is the same as `checkpoint-0-setup`.
- If you fall behind: `git stash` saves your work, `git switch` moves you to the checkpoint, and `migrate` updates your database. The README has the same steps.
- Going back from `checkpoint-4-m2m` to an earlier branch needs one more command. Slide 30 has it, if anyone asks.

→ Next: lesson 1.
-->
