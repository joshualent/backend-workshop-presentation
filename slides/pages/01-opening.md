---
layout: cover
part: Opening
---

<ClubMark :height="56" />

# Build a Q&A API with Python & Django

<p class="lead muted">Backend workshop · Developer Club, WMU</p>

<p class="small muted">Monday, October 19, 2026 · Floyd Hall D-109</p>

<!--
[7:00 · 2 min] [SLIDES]

- Welcome. Say your name and one line about what you do.
- Thank the club. If other people are helping tonight, introduce them.
- Say what we build: "You're going to build an API where people ask questions, vote on them, and mark them answered. When you leave, it runs on your laptop."
- Ask for a show of hands: "Who has written Python?" "Who has used Django?" "Who has called an API, from code or with curl?" Adjust your pace to the answers.
- How the night works: "There are four lessons. Each one starts with a slide or two. Then we write the code together in VS Code until it works, with no slides in between. Each lesson ends on a checkpoint branch, so you can catch up if you fall behind."
-->

---
part: Opening
clicks: 2
---

# Check your setup

<div class="stack">
<p>At <code>http://127.0.0.1:8000/admin/</code> you should see the Django login page.</p>
<p v-click="1">Leave <code>runserver</code> running in its terminal. Open a second terminal for every other command. In VS Code, choose New Terminal from the Terminal menu.</p>
<p v-click="2">Each lesson ends on a checkpoint branch with the finished code. If you fall behind, the first slide of the next lesson shows one line to run.</p>
</div>

<!--
[7:02 · 2 min] [SLIDES]

Ask: "Hands up if you see the Django login page."

- If some hands stay down: "Keep going with the steps from the setup slide. The README has them too. The next 15 minutes are slides, so you won't miss any code." Ask the people next to them to help.

[click] → SWITCH TO VS CODE: show the terminal panel, with `runserver` in the first terminal. Click + to open a second one. Say: "runserver keeps running all night. Type every other command in the second terminal." → SWITCH TO SLIDES

[click] Say: "Every lesson ends on a checkpoint branch with the finished code. If you fall behind, run the line on the next lesson's first slide. It saves your own work and switches you to the finished code."
-->

---
part: API basics
---

# What a backend does

<RoundTrip />

<!--
[7:04 · 1 min] [SLIDES]

- A client sends a request to the server. The server reads or writes data and sends back a response.

[click] The request: `GET /api/questions/` asks the server for the list of questions.

[click] The server reads and writes data and checks the rules. Any program can send a request, so only the server can enforce the rules. Say: "This is the part we're going to write."

[click] The response: a status code and the questions as JSON.

- Optional comparison for beginners: in a restaurant, you give your order to a waiter, the kitchen cooks it, and the waiter brings the plate back. You never go into the kitchen. The backend is the kitchen.
-->

---
part: API basics
---

# Server-rendered pages vs. an API

<StepVideo name="v1-one-backend-many-clients" loop alt="Left: a server builds a whole HTML page for one browser, which reloads. Right: the same server sends small JSON to a web app, a phone, and a terminal." />

<!--
[7:05 · 2 min] [SLIDES]

- The video loops on its own. Talk over it.
- Left: the server builds the whole HTML page and sends it to one browser. Every click loads a new page.
- Right: an API sends only the data, as JSON. A web app, a phone app, and a terminal all use the same responses.
- Say: "We're going to build the right half: a backend that sends data, not pages."
- If anyone asks: Django can also render HTML pages, and for many sites that is simpler. This workshop is about APIs.
-->

---
part: API basics
---

# Resources and URLs

<div class="stack">
<p>A REST API organizes its data as resources, and each resource has URLs. Our API has one resource: questions.</p>

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
[7:07 · 1 min] [SLIDES]

- REST is the most common way to design a web API. A REST API organizes its data as resources, gives each resource URLs, and uses HTTP methods to act on them. This slide and the next two cover those parts.
- A resource is one kind of data. A bigger API has more resources, such as users or comments. Ours has only questions.

[click] `/api/questions/` is the collection: all the questions.

[click] `/api/questions/1/` is one question. The number is the question's id. Django needs the trailing slash, so keep it.

[click] Say: "The URL says which data. The method says what to do with it. That's the next slide."
-->

---
part: API basics
clicks: 4
---

# HTTP methods

<div class="stack">
<p>The method says what to do with the data at the URL.</p>

<RouteList :steps="[1, 1, 2, 3, 3, 4]" />

<p v-click="3" class="small">PUT sends every field and replaces the question. PATCH sends only the fields that change.</p>
</div>

<!--
[7:08 · 2 min] [SLIDES]

- The method is the first word of every request. A method and a URL together make a route. Our API has six routes.

[click] Two routes use the collection URL. GET lists all the questions. POST creates a new question from the data in the request body.

[click] GET on one question's URL reads that question.

[click] PUT and PATCH both edit a question. PUT replaces all the writable fields. PATCH changes only the fields you send. In our API they behave the same, because `text` is the only writable field.

[click] DELETE deletes the question.

- Say: "GET only reads data. POST, PUT, PATCH, and DELETE change it."
-->

---
part: API basics
clicks: 5
---

# Anatomy of a request

<RequestAnatomy />

<!--
[7:10 · 3 min] [SLIDES]

- We send this exact request in lesson 1, and the server sends back this response.

[click] The first line has the method and the URL: a POST to the collection, which creates a question. `HTTP/1.1` is the version of HTTP. You can ignore it.

[click] The headers describe the message. `Content-Type` says the body is JSON.

[click] The body is the data we send. We send only `text`. JSON is a text format for data, and most APIs use it. It looks like a Python dictionary: names in quotes, a colon, and a value.

[click] The response status is `201 Created`. The first digit says what kind of result it is. 2xx means success: the request worked. 4xx is a client error: something is wrong with the request, such as invalid data or a missing login. 5xx is a server error: the server itself failed, for example because of a bug in our code. Say: "You'll see specific 4xx codes in the browser during the lessons."

[click] The response body: the server filled in `id`, `votes`, `answered`, and `created_at`. We sent only `text`.

- Say: "That's a REST API: each resource has a URL, the method says what to do with it, and the status code says what happened."
-->

---
part: API basics
---

# The parts of our API

<div class="stack">
<RequestMap :build="1" />
<p v-click="7" class="small">We build these parts from right to left, starting with the model.</p>
</div>

<!--
[7:13 · 2 min] [SLIDES]

- Each box between the client and SQLite is a file you'll edit in the repo you cloned. A request goes through the boxes from left to right.
- `rest_framework` and `questions` are already in `INSTALLED_APPS`, so there's nothing to set up. One line also goes in `admin.py`, so the Django admin can show questions.
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
part: API basics
clicks: 6
---

# Life of a POST request

<StepVideo name="v2-life-of-a-post" alt="A POST request with votes 9999 goes from the client through the router, ViewSet, serializer, and model to SQLite, and comes back as 201 Created with votes 0." />

<!--
[7:15 · 2 min] [SLIDES]

- Say: "In lesson 1 you write every part in this video. By the end of the lesson, your API handles this request."
- This is the same POST request as on the anatomy slide, but the client also sends `"votes": 9999`. The video shows what each part does with it. The highlighted box moves from the client toward SQLite.
- 0:00 (hold): the client sends the request as text: the method, URL, headers, and JSON body.

[click] 0:00–0:04: the URL router matches `POST /api/questions/` to `QuestionViewSet.create`. Say: "The router only reads the URL. It doesn't look at the data."

[click] 0:04–0:11: the serializer validates the data. `votes` is read-only, so the serializer drops it. Below: a request with blank text gets a 400 response with "This field may not be blank."

[click] 0:11–0:15: the serializer creates a `Question` object. `votes` is 0 and `answered` is False, from the model's defaults.

[click] 0:15–0:19.5: Django runs an INSERT, and SQLite stores a new row with id 1.

[click] 0:19.5–0:23.5: the serializer turns the saved row into JSON.

[click] 0:23.5–0:29: the client gets `201 Created` with `"votes": 0`. Say: "The client sent 9999. The server stored 0, because only the server sets the vote count."
-->

