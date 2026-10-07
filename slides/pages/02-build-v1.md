---
plan: 14
---

# Step 1: the model

<ClipPlayer name="orm-class-to-table" alt="The Question class: its fields fly into a table's column headers, three objects drop in as rows, then migration files line up like commits." width="752px" class="mx-auto" />

<!--
[7:15 · 1 min] [MODE: SLIDES]

Say:
- "Step 1 is the model: the shape of our data."
- "Django's ORM maps Python onto the database. The class is a table, each attribute is a column, and every object you save is a row. You never write SQL."
- "Migrations are like git commits for your database. Django writes a file describing each change, then applies it."

If behind: say the three "is a" lines and move on.
-->

---
plan: 15
---

<StepCard
  step="1"
  title="Write the Question model"
  file="questions/models.py"
  :command="['uv run python manage.py makemigrations', 'uv run python manage.py migrate']"
  highlight="model"
>
  <template #expect>
    <code>Create model Question</code>, then <code>Applying questions.0001_initial... OK</code>
  </template>
  <div class="fields">Fields: <code>text</code> <code>votes</code> <code>answered</code> <code>created_at</code></div>
</StepCard>

<style>
.fields { font-size: 24px; font-weight: 600; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
</style>

<!--
[7:16 · 1 min, then VS Code until ~7:22] [MODE: SLIDES]

Say:
- "Open questions/models.py. One class, four fields: the text, a vote count, whether it's answered, and when it was created."
- "Then two commands. makemigrations writes the migration file. migrate applies it to the database."

→ SWITCH TO VS CODE: Step 1, questions/models.py. Type the model (cheat sheet §1). Save. In the terminal (stop nothing; use a second terminal tab so runserver keeps running), run both commands.

Expected on screen:
- makemigrations: `Migrations for 'questions':` `questions/migrations/0001_initial.py` `+ Create model Question`
- migrate: `Applying questions.0001_initial... OK`

Check the room: "Thumbs up when migrate says OK." Helpers look for `No changes detected` (file not saved) and typos in field names.

(Come back to the slides at slide 16.)

If behind: paste the model instead of typing it; skip explaining each field type.
-->

---
plan: 16
---

# Step 2: the serializer

Translator (JSON ↔ Python) and bouncer (validation).

<SerializerGate class="mt-6" />

<!--
[7:23 · 1 min] [MODE: SLIDES]

← Back from VS Code: everyone has run migrate and seen "OK".

Say:
- "The model speaks Python. The outside world speaks JSON. The serializer sits in between."

[click] "Translator: JSON comes in, a Python object comes out. Responses go the other way."

[click] "Bouncer, part one: someone sends votes: 9999. Votes are read-only, so the serializer drops that field. Never trust the client."

[click] "Bouncer, part two: empty text fails validation. The client gets a 400 saying why, and nothing is saved."

If behind: skip explaining click 3; step 3 demos it live.
-->

---
plan: 17
---

<StepCard
  step="2"
  title="Write the serializer"
  file="questions/serializers.py"
  expect="Nothing to run. No red errors in the runserver terminal."
  highlight="serializer"
>
  <div class="callout ask-9999">
    <span class="kicker">Ask the room</span>
    <span>What happens if someone sends <code>"votes": 9999</code>?</span>
  </div>
</StepCard>

<style>
.ask-9999 { font-size: 28px; display: flex; flex-direction: column; gap: 6px; }
.ask-9999 .kicker { color: var(--accent-2); }
</style>

<!--
[7:24 · 1 min, then VS Code until ~7:28] [MODE: SLIDES]

Say:
- "Open questions/serializers.py. A ModelSerializer reads the model and builds the fields for us."
- "fields = '__all__' includes every field. read_only_fields lists the ones clients can see but never set."

Ask: "What happens if someone sends votes: 9999?" Take a guess or two. (Answer: the serializer ignores it, because votes is read-only. We prove it in step 3.)

→ SWITCH TO VS CODE: Step 2, questions/serializers.py (cheat sheet §2). Nothing to run; point at the runserver terminal: no red text means it worked.

(Come back to the slides at slide 18.)

If behind: paste the serializer.
-->

---
plan: 18
---

# Step 3: the ViewSet and the router

One ModelViewSet gives you five endpoints. The router writes their URLs.

<ViewSetSplit class="mt-12" />

<!--
[7:29 · 1 min] [MODE: SLIDES]

← Back from VS Code: serializers.py is saved and runserver shows no errors.

Say:
- "A view takes a request and returns a response. A ViewSet groups the views for one kind of thing."

[click] "ModelViewSet gives us five actions for free: list, create, retrieve, update, destroy."

[click] "The router looks at the ViewSet and writes a URL and method for each one. We never type these URLs ourselves."

If behind: click twice and say only the router line.
-->

---
plan: 19
---

<StepCard
  step="3"
  title="ViewSet + router, then test it"
  :file="['questions/views.py', 'config/urls.py']"
  highlight="router,viewset"
>
  <template #expect>
    <code>http://127.0.0.1:8000/api/questions/</code> shows the browsable API
  </template>
  <div class="tests">
    <div class="test"><MethodBadge method="POST" /><code>{"text": "What is REST?"}</code><span class="arrow">→</span><StatusBadge v-click :code="201" /></div>
    <div class="test"><MethodBadge method="POST" /><code>{"text": ""}</code><span class="arrow">→</span><StatusBadge v-click :code="400" /></div>
    <div class="test"><MethodBadge method="GET" /><code>/api/questions/999/</code><span class="arrow">→</span><StatusBadge v-click :code="404" /></div>
  </div>
</StepCard>

<style>
.tests { display: flex; flex-direction: column; gap: 10px; }
.test { display: flex; align-items: center; gap: 12px; }
.test code { font-size: 20px !important; }
.test .arrow { font-size: 24px; font-weight: 800; color: var(--text-muted); }
</style>

<!--
[7:30 · 2 min, then VS Code + browser until ~7:38] [MODE: SLIDES]

Say:
- "views.py: the ViewSet needs two lines: which rows (queryset) and which serializer."
- "config/urls.py: the router is already there, commented out. Uncomment it."
- "Then open /api/questions/ in your browser. That page is DRF's browsable API: a free website for testing your API."

Ask: "Predict the status code before I reveal it."

[click] POST a question with text → 201 Created.

[click] POST with empty text → 400 Bad Request. The bouncer.

[click] GET a question that doesn't exist → 404 Not Found.

→ SWITCH TO VS CODE: Step 3, questions/views.py (cheat sheet §3a), then uncomment the router lines in config/urls.py (cheat sheet §3b). Save both.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/. In the form at the bottom, POST `{"text": "What is REST?"}` → 201. POST `{"text": ""}` → 400. Visit /api/questions/999/ → 404. Then answer the 9,999 question: POST `{"text": "Hi", "votes": 9999}` → votes is 0.

Optional curl callback (cut first): run the curl from cheat sheet §3c in a terminal to show the same API without a browser.

(Come back to the slides at slide 20.)

TIME CHECK 7:40: if most of the room doesn't have a working /api/questions/ by 7:40, cut step 5 (ordering).

If behind: skip the curl callback; run only the 201 and 400 tests.
-->

---
plan: 20
---

# Step 4: custom actions

Not everything is CRUD. The server decides how votes change.

<CustomActionDemo class="mt-8" />

<!--
[7:39 · 1 min, then VS Code + browser until ~7:44] [MODE: SLIDES]

← Back from the browser: everyone's /api/questions/ lists at least one question.

Say:
- "Upvoting isn't really editing a question. It's an action."

[click] "We can't let clients PATCH the vote count: they'd send 9999. Since votes is read-only, that change is simply ignored."

[click] "Instead, an action: POST /api/questions/5/upvote/. The server adds exactly one. Three becomes four."

- "@action(detail=True) means it works on one question, so the URL has the id in it."

→ SWITCH TO VS CODE: Step 4, add `upvote` to QuestionViewSet in questions/views.py (cheat sheet §4: two new imports + the method).

→ SWITCH TO BROWSER: open http://127.0.0.1:8000/api/questions/1/upvote/ and press POST. The returned question shows votes going up by one each time. (The GET on that page shows 405 Method Not Allowed. That's expected: upvote only accepts POST.)

(Come back to the slides at slide 21.)

If behind: paste the upvote action.
-->

---
plan: 21
---

# Your turn: write `mark_answered`

<div class="turn">
  <div class="turn-task">
    <p>Add an action that sets <code>answered</code> to <code>True</code>.</p>
    <div class="turn-url"><MethodBadge method="POST" /> <code>/api/questions/5/mark_answered/</code></div>
    <div v-click="2" class="callout turn-hint">
      <span class="kicker">Hint</span>
      <span>Copy <code>upvote</code>, rename it, and change one line.</span>
    </div>
  </div>
  <CountdownTimer :seconds="120" label="Two minutes" at="1" />
</div>

<style>
.turn { display: grid; grid-template-columns: 1fr 250px; gap: 36px; align-items: start; margin-top: 24px; }
.turn-task { display: flex; flex-direction: column; gap: 22px; }
.turn-task p { margin: 0; font-size: 28px; font-weight: 600; }
.turn-url { display: flex; align-items: center; gap: 12px; }
.turn-url code { font-size: 22px !important; }
.turn-hint { display: flex; flex-direction: column; gap: 6px; font-size: 26px; }
.turn-hint .kicker { color: var(--accent-2); }
</style>

<!--
[7:45 · 3 min] [MODE: SLIDES]

← Back from the browser: upvote works for most people.

Say:
- "Your turn. mark_answered works exactly like upvote. Two minutes."

[click] Start the two-minute timer. Walk the room or watch the helpers.

[click] At about one minute left, reveal the hint: copy upvote, rename it, change one line (`question.answered = True`).

→ SWITCH TO VS CODE: when the timer ends, type the answer live (cheat sheet §4b) so everyone ends with the same code.

→ SWITCH TO BROWSER: POST to http://127.0.0.1:8000/api/questions/1/mark_answered/ → answered is true.

(Come back to the slides at slide 22.)

If behind: skip the exercise (cut list item 2). Type mark_answered yourself while explaining it, no timer.
-->

---
plan: 22
---

# Step 5: ordering

Query parameters sort a collection. No new URLs.

<OrderingDemo class="mt-6" />

<!--
[7:48 · 1 min] [MODE: SLIDES]

← Back from VS Code: mark_answered works for most people.

Say:
- "How do we show the most-voted questions first? Not a new URL: a query parameter on the same one."

[click] "?ordering=-votes sorts by votes. The minus sign means highest first."

- "DRF ships an OrderingFilter that does the sorting. We switch it on and say which fields are allowed."

If behind: this is the step to drop if it's past 7:50 (see the 7:40 time check). Say "tier-1-done has ordering" and skip to slide 24.
-->

---
plan: 23
---

<StepCard
  step="5"
  title="Turn on ordering, then commit"
  file="questions/views.py"
  :command="['git add -A', 'git commit -m &quot;v1 done&quot;']"
  highlight="viewset"
>
  <template #expect>
    <code>/api/questions/?ordering=-votes</code> lists the most-voted first
  </template>

```python
from rest_framework.filters import OrderingFilter
```

```python
    filter_backends = [OrderingFilter]
    ordering_fields = ['votes', 'created_at']
```

</StepCard>

<!--
[7:49 · 1 min, then VS Code + browser until ~7:54] [MODE: SLIDES]

Say:
- "One import and two lines inside the ViewSet: switch on OrderingFilter, and list the fields people may sort by."
- "Then commit: your v1 is done."

→ SWITCH TO VS CODE: Step 5, questions/views.py (cheat sheet §5). Save. In the terminal: `git add -A`, `git commit -m "v1 done"`. (If git asks who you are, skip the commit. The files are saved either way.)

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/?ordering=-votes, then ?ordering=created_at. The browsable API also has a "Filters" button that shows the ordering choices.

(Come back to the slides at slide 24.)

If behind: drop ordering (cut list: it's the 7:40 cut). Point at tier-1-done, which has it.
-->
