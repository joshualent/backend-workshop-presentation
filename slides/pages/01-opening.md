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
- Say what we build: "You're going to build an API where people ask questions, vote on them, and mark them answered. When you leave, it runs on your laptop."
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

[click] The server reads and writes data and checks the rules. Say: "This is the part we're going to write."

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
- Say: "We're going to build the right half: a backend that sends data, not pages."
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

- If anyone asks: Django can also render HTML pages, and for many sites that is simpler. This workshop is about APIs.
-->

---
plan: 9
---

# Resources and URLs

<div class="stack">
<p>A resource is a kind of data that an API makes available. Our API has one resource: questions.</p>

<div class="urls">
<code v-click="1">/api/questions/</code><span v-click="1">the collection of all questions</span>
<code v-click="2">/api/questions/1/</code><span v-click="2">the question with id 1</span>
</div>

<p v-click="3" class="small">A URL says which data the request is about. It doesn't say what to do with the data.</p>
</div>

<style>
.urls {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px 28px;
  align-items: baseline;
}
.urls code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 600;
}
.urls span {
  font-size: var(--fs-small);
  color: var(--text-2);
}
</style>

<!--
[7:04 · 1 min] [SLIDES]

- A resource is a kind of data that the API makes available. A bigger API has more resources, such as users or comments. Ours has only questions.

[click] `/api/questions/` is the collection: all the questions.

[click] `/api/questions/1/` is one question. The number is the question's id. Django needs the trailing slash, so keep it.

[click] Say: "The URL says which data. The method says what to do with it. That's the next slide."
-->

---
plan: 8
clicks: 4
---

# HTTP methods

<div class="stack">
<p>The method says what to do with the data at the URL.</p>

<RouteList :steps="[1, 1, 2, 3, 3, 4]" />

<p v-click="3" class="small">PUT sends every field and replaces the question. PATCH sends only the fields that change.</p>
</div>

<!--
[7:05 · 2 min] [SLIDES]

- The method is the first word of every request. A method and a URL together make a route. Our API has six routes.

[click] Two routes use the collection URL. GET lists all the questions. POST creates a new question from the data in the request body.

[click] GET on one question's URL reads that question.

[click] PUT and PATCH both edit a question. PUT replaces all the writable fields. PATCH changes only the fields you send. In our API they behave the same, because `text` is the only writable field.

[click] DELETE deletes the question.

- Say: "GET only reads data. POST, PUT, PATCH, and DELETE change it."
-->

---
plan: 7
clicks: 5
---

# Anatomy of a request

<RequestAnatomy />

<!--
[7:07 · 3 min] [SLIDES]

- We send this exact request in lesson 1, and the server sends back this response.

[click] The first line has the method and the URL: a POST to the collection, which creates a question. `HTTP/1.1` is the version of HTTP. You can ignore it.

[click] The headers describe the message. `Content-Type` says the body is JSON.

[click] The body is the data we send. We send only `text`. JSON is a text format for data, and most APIs use it. It looks like a Python dictionary: names in quotes, a colon, and a value.

[click] The response status is `201 Created`. The first digit says what kind of result it is. 2xx means success: the request worked. 4xx is a client error: something is wrong with the request, such as invalid data or a missing login. 5xx is a server error: the server itself failed, for example because of a bug in our code. Say: "We'll see each 4xx code when it comes up in the lessons."

[click] The response body: the server filled in `id`, `votes`, `answered`, and `created_at`. We sent only `text`.
-->

---
plan: 10
---

# The parts of our API

<div class="stack">
<RequestMap :build="1" />
<p v-click="7" class="small">We build these parts from right to left, starting with the model.</p>
</div>

<!--
[7:10 · 2 min] [SLIDES]

- This diagram comes back on later slides. Each box between the client and SQLite is a file you'll edit. A request goes through the boxes from left to right.
- First box: the client sends the request. It can be a browser, an app, or curl.

[click] The URL router, in `config/urls.py`, reads the URL and picks the ViewSet method to run.

[click] The ViewSet, in `views.py`, handles each request: list, create, and so on.

[click] The serializer, in `serializers.py`, converts between JSON and Python and validates incoming data.

[click] The model, in `models.py`, describes a question as a Python class.

[click] SQLite, the file `db.sqlite3`, stores the rows. `migrate` creates its tables.

[click] The response goes back to the client as JSON, along the bottom arrow.

[click] Say: "We build from the right. The model comes first, because every other part uses it."
-->

---
plan: 11
clicks: 6
---

# Life of a POST request

<StepVideo name="v2-life-of-a-post" alt="A POST request with votes 9999 goes from the client through the router, ViewSet, serializer, and model to SQLite, and comes back as 201 Created with votes 0." />

<!--
[7:12 · 2 min] [SLIDES]

- This is the same POST request as before, but the client also sends `"votes": 9999`. The video shows what each part does with it. The highlighted box moves from the client toward SQLite.
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

- You'll edit the highlighted files: `models.py`, `serializers.py`, `views.py`, and `config/urls.py`. One line also goes in `admin.py`.
- `rest_framework` and `questions` are already in `INSTALLED_APPS`, so you don't need to set anything up.
- Each checkpoint branch has the finished code for one lesson. `main` is the same as `checkpoint-0-setup`.
- If you fall behind: `git stash` saves your work, `git switch` moves you to the checkpoint, and `migrate` updates your database. The README has the same steps.
- Going back from `checkpoint-4-m2m` to an earlier branch needs one more command. Slide 30 has it, if anyone asks.

→ Next: lesson 1.
-->
