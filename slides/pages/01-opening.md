---
section: Opening
clicks: 2
---

# Check your setup

<div class="stack">
<p>At <code>http://127.0.0.1:8000/admin/</code> you should see the Django login page.</p>
<p v-click="1">Leave <code>runserver</code> running in its terminal. Open a second terminal for every other command. In VS Code, choose New Terminal from the Terminal menu.</p>
<p v-click="2">Each part ends on a checkpoint branch with the finished code. If you fall behind, the first slide of the next part shows one line to run.</p>
</div>

<!--
[7:00 · 4 min] [SLIDES]

- Welcome. Say your name and one line about what you do. Thank the club. If other people are helping tonight, introduce them.
- Say what we build: "You're going to build an API where people ask questions, vote on them, and mark them answered. When you leave, it runs on your laptop."
- Ask for a show of hands: "Who has written Python?" "Who has used Django?" "Who has called an API from code?" Adjust your pace to the answers.
- How the night works: "There are four parts. Each one starts with a slide or two. Then we write the code together in VS Code until it works, with no slides in between. Each part ends on a checkpoint branch, so you can catch up if you fall behind."

Ask: "Hands up if you see the Django login page."

- If some hands stay down: "Keep going with the steps from the setup slide. The README has them too. The next 13 minutes are slides, so you won't miss any code." Ask the people next to them to help.

[click] → SWITCH TO VS CODE: show the terminal panel, with `runserver` in the first terminal. Click + to open a second one. Say: "runserver keeps running all night. Type every other command in the second terminal." → SWITCH TO SLIDES

[click] Say: "Every part ends on a checkpoint branch with the finished code. If you fall behind, run the line on the next part's first slide. It saves your own work and switches you to the finished code."
-->

---
section: API basics
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
section: API basics
clicks: 3
---

# Server-rendered pages vs. an API

<StepVideo name="v1-pages-vs-api" alt="Left: the browser asks the server for a page, and the server sends the whole page with the data in it. Right: a frontend app in the browser draws the page with empty spots, asks the server's API for the data, gets JSON back, and fills in the empty spots." />

<!--
[7:05 · 2 min] [SLIDES]

- Two ways a backend can work. Both browsers end up showing the same page.
- 0:00 (hold): each side has a server and a browser with an empty page.

[click] 0:00–0:05: left. The browser asks for `/questions/`. The server builds the whole page, with the data already in it, as HTML, and sends it. Every click on a link loads a new page this way.

[click] 0:05–0:08: right. This browser is running a frontend app, for example a React app it loaded earlier. The app draws the page itself, with grey bars where the data will go. Say: "The server didn't send this layout. The frontend app drew it."

[click] 0:08–0:12.5: the app asks the API for `/api/questions/`. The server sends only the data, as JSON, and the app puts it into the page. Say: "We're going to build the right half: the server that sends JSON. A web app, a phone app, or a terminal can all use the same JSON."

- If anyone asks: Django can also render HTML pages, and for many sites that is simpler. This workshop is about APIs.
-->

---
section: API basics
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
section: API basics
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
section: API basics
clicks: 5
---

# Anatomy of a request

<RequestAnatomy />

<!--
[7:10 · 3 min] [SLIDES]

- We send this exact request in part 1, and the server sends back this response.

[click] The first line has the method, `POST`, and the URL of the collection. A POST to the collection creates a question. `HTTP/1.1` is the version of HTTP. You don't need it today.

[click] Each header is a name and a value. `Host` names the server. `Content-Type` says the body is JSON.

[click] The body is the data we send. We send only `text`. Most APIs send JSON, a text format for data. It looks like a Python dictionary: each name is in quotes, and a colon separates it from its value.

[click] The response starts with the status code, `201 Created`. The first digit says what kind of result it is. 2xx means the request worked. 4xx means the request has a problem, such as invalid data or a missing login. 5xx means the server failed, for example because of a bug in our code. Say: "You'll see specific 4xx codes in the browser later."

[click] The response body: the server added `id`, `votes`, `answered`, and `created_at`. We sent only `text`.

- Say: "That's a REST API: each resource has a URL, the method says what to do with it, and the status code says what happened."
-->

---
section: API basics
clicks: 7
---

# The parts of our API

<RequestMap :build="1" explain end="We'll build these parts from right to left, starting with the model." />

<!--
[7:13 · 2 min] [SLIDES]

- Each box between the client and SQLite is a file you'll edit in the repo you cloned. A request goes through the boxes from left to right. The newest box is highlighted, and the sentence under the diagram says what it does. Add to it as you go.
- `rest_framework` and `questions` are already in `INSTALLED_APPS`, so there's nothing to set up. One line also goes in `admin.py`, so the Django admin can show questions.
- First box: the client sends the request. In this workshop it's the browser. A phone app or a frontend app would be a client too.

[click] The URL router, in `config/urls.py`. It reads the URL and the method, and picks the ViewSet method to run: GET on `/api/questions/` runs `list`, and POST runs `create`.

[click] The ViewSet, in `views.py`. It has one method for each action: list, create, retrieve, update, partial update, and destroy. DRF writes these six for us.

[click] The serializer, in `serializers.py`. It checks the incoming JSON, for example that `text` isn't blank, and turns it into a `Question`. It also turns questions back into JSON for the response.

[click] The model, in `models.py`. A Python class with one attribute for each field. Django turns it into a table and uses it to read and write rows.

[click] SQLite, the file `db.sqlite3`. It stores each question as a row. `migrate` creates its tables.

[click] The response goes back to the client: a status code and a JSON body, along the bottom arrow.

[click] Say: "We'll build from the right. The model comes first, because every other part uses it."
-->

---
section: API basics
clicks: 6
---

# Life of a POST request

<StepVideo name="v2-life-of-a-post" alt="A POST request with votes 9999 goes from the client through the router, ViewSet, serializer, and model to SQLite, and comes back as 201 Created with votes 0." />

<!--
[7:15 · 2 min] [SLIDES]

- Say: "In part 1 you write the code for every box in this video. By the end of part 1, your API handles this request."
- This is the same POST request as on the anatomy slide, but the client also sends `"votes": 9999`. The video shows what each part does with it. The highlighted box moves from the client toward SQLite.
- 0:00 (hold): the client sends the request as text: the method, URL, headers, and JSON body.

[click] 0:00–0:04: the URL router matches `POST /api/questions/` to `QuestionViewSet.create`. Say: "The router only reads the URL. It doesn't look at the data."

[click] 0:04–0:11: the serializer validates the data. `votes` is read-only, so the serializer drops it. Below: a request with blank text gets a 400 response with "This field may not be blank."

[click] 0:11–0:15: the serializer creates a `Question` object. `votes` is 0 and `answered` is False, from the model's defaults.

[click] 0:15–0:19.5: Django runs an INSERT, and SQLite stores a new row with id 1.

[click] 0:19.5–0:23.5: the serializer turns the saved row into JSON.

[click] 0:23.5–0:29: the client gets `201 Created` with `"votes": 0`. Say: "The client sent 9999. The server stored 0, because only the server sets the vote count."
-->

