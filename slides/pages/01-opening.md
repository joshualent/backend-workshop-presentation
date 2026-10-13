---
layout: cover
plan: 1
---

<ClubMark :height="56" />

# Build a Q&A API with Python & Django

<p class="lead muted">Backend workshop · Developer Club, WMU</p>

<p class="small muted">Monday, October 19, 2026 · Floyd Hall D-109</p>

<!--
[6:55 · 1 min] [SLIDES]

- Welcome. Say your name and one line about what you do.
- Thank the club and the helpers. Point out where the helpers are standing.
- "We'll write a real backend tonight, and you'll leave with it running on your laptop."
-->

---
plan: 2
---

# Tonight

<p class="lead">We build an API where people ask questions, vote on them, and mark them answered.</p>

<ul>
<li v-click>You code along on your own laptop.</li>
<li v-click>Every lesson ends on a checkpoint branch, so nobody stays stuck.</li>
<li v-click>Stuck anyway? Put a hand up. Helpers are walking around.</li>
</ul>

<!--
[6:56 · 2 min] [SLIDES]

- One sentence on what we build. Four short lessons, each fixing something the last one left broken.
- Ask: show of hands. "Who has written Python?" "Who has used Django?" "Who has called an API, from code or curl?" Adjust your pace to the answers.

[click] Code along: type it yourself. Typing beats copying.

[click] Checkpoints: "If you fall behind, one command puts you at the end of the lesson. I'll show it on slide 13."

[click] Helpers: "A typo you can't find is what helpers are for. Don't sit stuck for more than a minute."
-->

---
plan: 3
---

# What a backend does

<RoundTrip />

<!--
[6:58 · 1 min] [SLIDES]

- A client sends a request; the server does some work; a response comes back. That's the whole job.

[click] The request: here, "give me the questions". Say: "The client asks."

[click] The work: reading and writing data, checking rules. Say: "This is the part we write tonight."

[click] The response: a status and the data. Say: "The server answers."

- Restaurant line: "You're the customer, the waiter takes your order to the kitchen, and brings back a plate. You never walk into the kitchen. The backend is the kitchen."
-->

---
plan: 4
---

# What the backend owns

<ul>
<li v-click><strong>Storing data</strong>: questions, votes, users.</li>
<li v-click><strong>Enforcing rules</strong>: a question can't be blank.</li>
<li v-click><strong>Deciding who can do what</strong>: only moderators delete.</li>
</ul>

<p v-click class="lead accent">Never trust the client.</p>

<!--
[6:59 · 2 min] [SLIDES]

- The client is whatever sends the request. We don't control it.

[click] Storing data: the database lives on the server, not in the browser.

[click] Rules: the server checks every input, even when the web page already checked it.

[click] Who can do what: the server decides. Lesson 3 is about exactly this.

[click] Say: "Anyone can send any request with curl. A form in the browser protects nothing. Never trust the client." We come back to this in lessons 1 and 3.
-->

---
plan: 5
---

# Server-rendered pages vs. an API

<StepVideo name="v1-one-backend-many-clients" loop alt="Left: a server builds a whole HTML page for one browser, which reloads. Right: the same server sends small JSON to a web app, a phone, and a terminal." />

<!--
[7:01 · 2 min] [SLIDES]

- The video loops on its own; talk over it.
- Left: the server builds the whole page and sends it to one browser, which reloads. Every click, a whole page.
- Right: an API sends only the data, as small JSON. A web app, a phone app, and a terminal can all use the same answers.
- Say: "Tonight we build the right half: the backend that sends data, not pages."
-->

---
plan: 6
---

# Why build an API?

<ul>
<li v-click>One backend serves many clients: a web app, a phone, a terminal.</li>
<li v-click>The frontend and backend can change separately.</li>
<li v-click>Each side can be tested and scaled on its own.</li>
</ul>

<p v-click class="muted">Server-rendered apps are still a fine choice for many projects.</p>

<!--
[7:03 · 1 min] [SLIDES]

[click] Many clients: the same `/api/questions/` serves every one of them.

[click] Separate changes: a new mobile screen doesn't need a backend deploy.

[click] Testing and scaling: you can test the API without a browser, and run more servers when it gets busy.

[click] Be fair: "Django renders pages too, and for plenty of sites that's simpler. Tonight is about APIs."
-->

---
plan: 7
clicks: 6
---

# Anatomy of a request

<RequestAnatomy />

<!--
[7:04 · 3 min] [SLIDES]

- This is the exact request we'll send in lesson 1, and the response we'll get back.

[click] Method: POST means "create". GET reads.

[click] URL: `/api/questions/` is the list of questions.

[click] Headers: facts about the message. `Content-Type` says the body is JSON.

[click] Body: the data we send. Only `text`.

[click] Response status: `201 Created`. Say: "Numbers starting with 2 mean it worked."

[click] Response body: the server filled in `id`, `votes`, `answered`, and `created_at`. We only sent `text`.
-->

---
plan: 8
---

# Methods and status codes tonight

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
<StatusBadge :code="200" /><span>it worked</span>
<StatusBadge :code="201" /><span>created</span>
<StatusBadge :code="400" /><span>blank text</span>
<StatusBadge :code="403" /><span>not allowed</span>
<StatusBadge :code="404" /><span>no such question</span>
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

- Methods are verbs for the same URLs. We'll use all of these tonight.
- PUT replaces the writable fields, PATCH changes some of them. For us they behave the same, because only `text` is writable.
- Status codes: when we'll see each. 201 when we create a question. 400 when the text is blank. 404 for a question that doesn't exist. 403 from lesson 3 on, when you're logged out or not staff.
- Optional aside: logged-out requests get 403, not 401, because the browsable API uses session login. Skip unless asked.
-->

---
plan: 9
---

# Resources and URLs

<div class="stack">
<p><code>/api/questions/</code> is the collection: every question.<br><code>/api/questions/1/</code> is one question, with id 1.</p>

<RouteList :at="1" />

<p v-click="2" class="small">Later we add actions: <MethodBadge method="POST" /> <code>/api/questions/1/upvote/</code></p>
</div>

<!--
[7:08 · 2 min] [SLIDES]

- A resource is a thing the API exposes. Ours is questions.
- The collection URL and the one-question URL. Trailing slashes matter in Django: keep them.

[click] The six routes from the README. Two on the collection: list and create. Four on one question: read, replace, update, delete. "Same two URLs, six meanings, chosen by the method."

[click] Actions: a verb that isn't create, read, update, or delete. That's lesson 2.
-->

---
plan: 10
---

# The map

<div class="stack">
<RequestMap :build="1" />
<p v-click="7" class="small">We'll build it right to left: the model first.</p>
</div>

<!--
[7:10 · 2 min] [SLIDES]

- This map comes back all night. Each box is a file you'll edit.
- Start: the client, which is a browser, an app, or curl.

[click] The URL router, in `config/urls.py`, reads the URL and picks the code to run.

[click] The ViewSet, in `views.py`, handles the request: list, create, and so on.

[click] The serializer, in `serializers.py`, turns JSON into Python and back, and checks the data.

[click] The model, in `models.py`, describes a question in Python.

[click] SQLite, the file `db.sqlite3`, stores the rows.

[click] The answer travels back the same way and leaves as JSON.

[click] Say: "We'll build it from the right: the model first, because everything else depends on it."
-->

---
plan: 11
clicks: 6
---

# Life of a POST

<StepVideo name="v2-life-of-a-post" alt="A POST request with votes 9999 travels through the router, ViewSet, serializer, model, and SQLite, and comes back as 201 Created with votes 0." />

<!--
[7:12 · 2 min] [SLIDES]

- The same POST as before, but the client also sends `"votes": 9999`. Watch what each layer does to it.
- 0:00 (hold): the client sends raw HTTP text: method, URL, headers, and JSON body.

[click] 0:00–0:04: the URL router matches `POST /api/questions/` to `QuestionViewSet.create`. Say: "The router picks the code; it doesn't look at the data."

[click] 0:04–0:11: the serializer checks the data. `votes` is read-only, so it's dropped. Below: blank text bounces back as 400 with "This field may not be blank." Say: "This is never trust the client, in code."

[click] 0:11–0:15: a `Question` object, with `votes` 0 and `answered` False from the model's defaults.

[click] 0:15–0:19.5: Django runs an INSERT; a new row appears in SQLite with id 1.

[click] 0:19.5–0:23.5: back up the stack: the serializer turns the saved row into JSON.

[click] 0:23.5–0:29: `201 Created`, with `"votes": 0`. Say: "We asked for 9999 and got 0. The server owns that number."
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
<div class="file-label">Fell behind?</div>

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

- The highlighted files are where we work tonight: `models.py`, `serializers.py`, `views.py`, and `config/urls.py`. One line also goes in `admin.py`.
- `rest_framework` and `questions` are already in `INSTALLED_APPS`, so there's no setup to do.
- Checkpoints: each branch is the finished code for a lesson. `main` is the same as `checkpoint-0-setup`.
- Fell behind: stash your work (it's kept, not lost), switch, migrate. The README has the same steps.
- Moving backward from `checkpoint-4-m2m` needs one extra step; it's on slide 48 if anyone asks.

→ Next: lesson 1.
-->
