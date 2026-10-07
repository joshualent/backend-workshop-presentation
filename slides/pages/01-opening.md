---
layout: bare
plan: 1
routeAlias: title
---

<TitleHero variant="a" />

<!--
[6:55 · 1 min] [MODE: SLIDES]

Say:
- Welcome to the Developer Club backend workshop. Introduce yourself in one line.
- "Tonight you'll build a real REST API in Python: the same kind of thing that sits behind most apps on your phone."
- "You type every line yourself. About forty minutes of coding, with short slides in between."

If behind: say the second line only.
-->

---
plan: 2
routeAlias: board-preview
fallback: board-preview-fallback
---

# Here's what you'll build

The live board: your questions, sorted by votes.

<LiveBoard :height="400" />

<!--
[6:56 · 1.5 min] [MODE: LIVE BOARD]

Say:
- "This is the finished app, running live on the internet. Those are your questions from tonight, sorted by votes."
- "By 7:55 you'll have built this API yourself, on your own laptop."
- "Keep voting all night. At the end I answer the top questions."

Ask: "Who already posted a question?"

If the frame is blank or shows an error: press `b` for the screenshot slide (it also switches by itself when the network is down). Press `b` again to come back.

If behind: say the first line and move on.
-->

---
plan: 3
---

# How tonight works

<div class="grid-3 how">
  <div v-click class="card how-card">
    <ph-hand-waving-bold class="how-icon" />
    <h3>Show of hands</h3>
    <p>Python? Django? Ever called an API?</p>
  </div>
  <div v-click class="card how-card">
    <ph-code-bold class="how-icon" />
    <h3>Code along</h3>
    <p>Type with me. Behind? Grab a checkpoint branch.</p>
    <div class="branches"><code>tier-1-done</code><code>tier-2-auth</code><code>tier-3-m2m</code></div>
  </div>
  <div v-click class="card how-card">
    <ph-lifebuoy-bold class="how-icon" />
    <h3>Stuck? Hand up.</h3>
    <p>A helper comes to you. I keep going.</p>
  </div>
</div>

<style>
.how { margin-top: 24px; }
.how-card { display: flex; flex-direction: column; gap: 10px; min-height: 300px; }
.how-card h3 { margin: 0; font-size: 28px; }
.how-card p { margin: 0; }
.how-icon { font-size: 60px; color: var(--accent); }
.branches { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
.branches code { font-size: var(--fs-label) !important; }
</style>

<!--
[6:57 · 2 min] [MODE: SLIDES]

Say:
- "Quick calibration, so I know how fast to go."

[click] Show of hands, one at a time: "Hands up if you've written Python… used Django… ever called an API, even with fetch or requests?" Adjust your pace to what you see.

[click] "You type along with me. If you fall behind, don't panic: every checkpoint has a git branch with the finished code. I'll show the command when we get there."

[click] "Stuck? Put your hand up. A helper comes to you and I keep going. Don't sit stuck for more than two minutes."

Ask: the three show-of-hands questions (first click).

If behind: skip the show of hands; always keep the stuck signal.
-->

---
plan: 4
---

# What is a backend?

The part of an app you never see.

<RoundTrip class="mt-6" />

<!--
[7:00 · 1.5 min] [MODE: SLIDES]

Say:
- "Every app has two halves: the part you see, the client, and the server it talks to."

[click] "The client sends a request: give me the questions."

[click] "The server does the work. It looks the questions up in the database. That's the backend, and it's what we build tonight."

[click] "The response comes back as JSON: plain data, not a web page."

Ask: "Name a backend you used today." (Canvas, Instagram, your bank. Take one or two answers.)

If behind: skip the Ask.
-->

---
plan: 5
---

# Think of a restaurant

<Restaurant class="mt-4" />

<!--
[7:01 · 1.5 min] [MODE: SLIDES]

Say:
- "You never walk into the kitchen. You order, and food comes out."

[click] "Your order goes through the window to the kitchen on a ticket. That's a request."

[click] "The dish comes back the same way. That's the response."

[click] "Dining room: the frontend. The ticket and the window: the API, the agreed way to ask. Kitchen: the backend."

- "The menu is the API's documentation: you can only order what's on it."

If behind: skip the menu line.
-->

---
plan: 6
---

# What the backend owns

<div class="grid-3 owns">
  <div v-click class="card">
    <ph-database-bold class="owns-icon" />
    <h3>Store data</h3>
    <p>Questions and votes, saved for good.</p>
  </div>
  <div v-click class="card">
    <ph-list-checks-bold class="owns-icon" />
    <h3>Enforce rules</h3>
    <p>Text can't be empty. Votes go up by one.</p>
  </div>
  <div v-click class="card">
    <ph-shield-check-bold class="owns-icon" />
    <h3>Security</h3>
    <p>Who can post, vote, or delete.</p>
  </div>
</div>

<div v-click class="callout owns-callout">
  <ph-warning-bold /> Never trust the client. Anyone can send any request.
</div>

<style>
.owns { margin-top: 18px; }
.owns .card { display: flex; flex-direction: column; gap: 8px; }
.owns h3 { margin: 0; font-size: 28px; }
.owns p { margin: 0; }
.owns-icon { font-size: 52px; color: var(--accent); }
.owns-callout { margin-top: 26px; font-size: 28px; display: flex; align-items: center; gap: 14px; }
.owns-callout svg { font-size: 36px; color: var(--accent-2); flex: none; }
</style>

<!--
[7:02 · 1 min] [MODE: SLIDES]

Say:

[click] "Store data. The questions and votes live on the server, not in anyone's browser."

[click] "Enforce rules. The server decides what's valid: text can't be empty, votes go up by one."

[click] "Security. Who is allowed to post, vote, or delete."

[click] "Never trust the client. Anyone can send any request with any data, straight from a terminal. Remember this one: it comes back twice tonight."

If behind: click through the three cards quickly and land the callout.
-->

---
plan: 7
---

# Server-rendered pages vs. an API

<ClipPlayer name="server-vs-api" alt="Left: a full HTML page travels to one browser, which reloads. Right: small JSON packets fan out to a web app, a phone, a terminal, and another service." width="680px" class="mx-auto mt-2" />

<div class="split-captions">
  <span>Server builds the whole page, for one browser</span>
  <span>Server sends small JSON, for any client</span>
</div>

<style>
.split-captions { display: grid; grid-template-columns: 1fr 1fr; width: 680px; margin: 10px auto 0; text-align: center; font-size: 20px; font-weight: 700; color: var(--text-muted); }
</style>

<!--
[7:03 · 2 min] [MODE: SLIDES]

Say:
- Left: "The classic way. The server builds a complete HTML page and sends it to one browser. Click anything and the whole page reloads."
- Right: "An API. The server sends small JSON packets, just the data. A web app, a phone app, a terminal, even another server can all use the same API."
- "Tonight we build the right-hand side."

Ask: "Which side do you think Instagram's phone app uses?" (The right.)

If behind: one sentence: "Left sends pages, right sends data. We build the right."
-->

---
plan: 8
---

# Why an API?

<div class="why">
  <div v-click class="why-item"><ph-devices-bold class="why-icon" /><div><h3>One backend, many clients</h3><p>Web, phone, terminal, other services.</p></div></div>
  <div v-click class="why-item"><ph-arrows-split-bold class="why-icon" /><div><h3>Separation of concerns</h3><p>Frontend and backend change on their own.</p></div></div>
  <div v-click class="why-item"><ph-test-tube-bold class="why-icon" /><div><h3>Test and scale each side</h3><p>Independently, as they need it.</p></div></div>
</div>

<div v-click class="card why-caveat">
  Server-rendered apps are still a great choice for many projects. Django does both.
</div>

<style>
.why { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
.why-item { display: grid; grid-template-columns: 64px 1fr; gap: 16px; align-items: center; }
.why-item h3 { margin: 0; font-size: 28px; }
.why-item p { margin: 0; color: var(--text-muted); }
.why-icon { font-size: 52px; color: var(--accent); }
.why-caveat { margin-top: 24px; border-color: var(--accent-2); font-weight: 600; }
</style>

<!--
[7:05 · 1.5 min] [MODE: SLIDES]

Say:

[click] "One backend can serve a website, a phone app, and a script, all at once."

[click] "The frontend and backend teams agree on the API, then work independently."

[click] "You can test each side alone, and scale the busy side without touching the other."

[click] "This isn't 'APIs good, pages bad.' Server-rendered apps are still a great choice, and Django does both. Tonight we learn the API side."

If behind: reveal all four in one go; say only the caveat.
-->

---
plan: 9
---

# Anatomy of an HTTP request

<HttpMessage />

<!--
[7:07 · 2 min] [MODE: SLIDES]

Say:
- "HTTP is the language clients and servers speak. A request has four parts."

[click] "Method: what you want to do. POST means create something."

[click] "URL: which thing. /api/questions/ is the collection of questions."

[click] "Headers: information about the message. This one says the body is JSON."

[click] "Body: the data itself. Here, a new question."

[click] "The response: a status code, 201 Created, so it worked. And a body: the saved question, now with fields the server filled in."

Ask: "Which fields did the server add?" (id, votes, answered, created_at.)

If behind: skip the Ask.
-->

---
plan: 10
---

# Methods and status codes for tonight

<div class="grid-2 codes">
  <div>
    <div class="kicker">Methods</div>
    <div class="code-row"><MethodBadge method="GET" /><span>read</span></div>
    <div class="code-row"><MethodBadge method="POST" /><span>create, or run an action</span></div>
    <div class="code-row"><MethodBadge method="PATCH" /><span>update (PUT too)</span></div>
    <div class="code-row"><MethodBadge method="DELETE" /><span>delete</span></div>
  </div>
  <div>
    <div class="kicker">Status codes</div>
    <div class="code-row"><StatusBadge :code="200" /><span>it worked</span></div>
    <div class="code-row"><StatusBadge :code="201" /><span>saved a new one</span></div>
    <div class="code-row"><StatusBadge :code="400" /><span>invalid data</span></div>
    <div class="code-row"><StatusBadge :code="403" /><span>not allowed</span></div>
    <div class="code-row"><StatusBadge :code="404" /><span>no such thing</span></div>
    <div class="code-row"><StatusBadge :code="500" /><span>server bug</span></div>
  </div>
</div>

<style>
.codes .kicker { margin-bottom: 10px; }
.code-row { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center; min-height: 52px; }
.codes { grid-template-columns: 330px 1fr; }
.codes > div:first-child .code-row { grid-template-columns: 100px 1fr; }
.codes > div:last-child .code-row { grid-template-columns: 236px 1fr; }
.code-row span { font-size: 24px; font-weight: 600; }
</style>

<!--
[7:09 · 1.5 min] [MODE: SLIDES]

Say:
- "Four methods cover almost everything tonight. GET reads, POST creates (or runs an action, like upvote), PATCH updates, DELETE deletes."
- "Status codes tell you how it went. 2xx: it worked. 4xx: the client did something wrong. 5xx: the server did."
- "You'll see 201, 400, and 404 with your own eyes in step 3. 403 shows up in the stretch goal."

Ask: "Ever seen a 404 in the wild?" (Everyone has.)

If behind: say only the 2xx/4xx/5xx line.
-->

---
plan: 11
---

# REST in one slide

Nouns in URLs, verbs in methods.

<div class="rest">
  <div class="rest-url">

````md magic-move
```python
/api/questions/
```
```python
/api/questions/5/
```
```python
/api/questions/5/upvote/
```
````

  </div>
  <div class="rest-meaning">
    <div v-if="$clicks < 1" class="rest-row">
      <div class="rest-badges"><MethodBadge method="GET" size="lg" /><MethodBadge method="POST" size="lg" /></div>
      <p>the collection: list all, or add one</p>
    </div>
    <div v-else-if="$clicks < 2" class="rest-row">
      <div class="rest-badges"><MethodBadge method="GET" size="lg" /><MethodBadge method="PATCH" size="lg" /><MethodBadge method="DELETE" size="lg" /></div>
      <p>one question: read, update, delete</p>
    </div>
    <div v-else class="rest-row">
      <div class="rest-badges"><MethodBadge method="POST" size="lg" /></div>
      <p>an action on one question (step 4)</p>
    </div>
  </div>
</div>

<style>
.rest { display: flex; flex-direction: column; gap: 26px; margin-top: 30px; }
.rest-url :deep(.slidev-code) { font-size: 40px !important; padding: 22px 28px !important; }
.rest-url :deep(.slidev-code span) { color: var(--text) !important; }
.rest-row { display: flex; flex-direction: column; gap: 14px; }
.rest-badges { display: flex; gap: 12px; }
.rest-row p { margin: 0; font-size: 28px; font-weight: 700; }
</style>

<!--
[7:10 · 1.5 min] [MODE: SLIDES]

Say:
- "REST is a style for designing APIs. One rule covers most of it: URLs are nouns, methods are verbs."
- "/api/questions/ is the whole collection. GET lists them, POST adds one."

[click] "Add an id and you get one question. GET reads it, PATCH changes it, DELETE removes it. Same URL, different verbs."

[click] "Sometimes you need a verb that isn't create, read, update, or delete, like upvote. That becomes an action under the question. We build this in step 4."

If behind: skip straight to the third form and say "nouns, then verbs as actions."
-->

---
plan: 12
---

# The map for tonight

Every request takes this path. We build it right to left.

<RequestFlowMap stepped class="mt-6" />

<!--
[7:12 · 2 min] [MODE: SLIDES]

Say:
- "This map is the whole night. Every request takes this path."

[click] "A request arrives. The router reads the URL and picks the code to run." (config/urls.py)

[click] "The ViewSet decides what to do: list, create, upvote…" (views.py)

[click] "The serializer translates JSON to Python and checks the data." (serializers.py)

[click] "The model is the shape of a question in Python." (models.py)

[click] "The database stores it. We use SQLite: one file, nothing to install."

[click] "Then everything flows back: Python objects become JSON and return to the client."

[click] "We build it right to left: model first, then serializer, then the ViewSet and router. Each step, this map comes back with your box lit up."

If behind: click through to the last step and say only the last line.
-->

---
plan: 13
---

# Your starter repo

<FileTree class="mt-2" />

<div class="tour-foot">You edit the four <strong>highlighted</strong> files, in order. Everything else is ready.</div>

<style>
.tour-foot { margin-top: 18px; font-size: 24px; font-weight: 600; }
</style>

<!--
[7:14 · 1 min] [MODE: SLIDES]

Say:
- "This is what you cloned. config/ is the project: settings and the main URL file. questions/ is our app."
- "settings.py is already wired up: Django REST Framework and the questions app are installed."
- "You only edit the four highlighted files, one per step, right to left on the map."
- "manage.py runs every command tonight: migrations, the server, creating users."

Ask: "Is your runserver still running? Thumbs up." (If someone closed it: `uv run python manage.py runserver` in the repo folder.)

If behind: say the third line only.
-->
