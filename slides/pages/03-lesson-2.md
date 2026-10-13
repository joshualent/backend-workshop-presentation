---
plan: 23–25
---

# Why not just PATCH the votes?

<div class="why">
<div v-click="1" class="case">
<div class="req"><MethodBadge method="PATCH" /> <code>/api/questions/1/</code> <code class="muted">{"votes": 9999}</code></div>
<p class="small muted">If votes were writable, any client could pick any number.</p>
</div>

<div v-click="2" class="case">
<div class="req"><MethodBadge method="POST" /> <code>/api/questions/1/upvote/</code> <span class="muted small">no body</span></div>
<p class="small muted">The server owns the rule: one upvote, plus one.</p>
</div>

<div v-click="3" class="case">
<p>Some operations aren't create, read, update, or delete. DRF calls them <strong>actions</strong>.</p>
<p class="small muted"><code>detail=True</code>: the action works on one question, so its URL has the id in it.</p>
</div>
</div>

<style>
.why {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.why .case {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.why .req {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: var(--fs-code);
}
.why .req code {
  background: none;
  padding: 0;
  font-size: var(--fs-code);
}
</style>

<!--
[7:42 · 7 min] [SLIDES]

- Lesson 2: custom actions. Voting and marking answered change a question, but they aren't a free-form edit. They're named operations with a rule inside. Two new URLs, no new model fields, no migration.
- Take the answer from the last slide: "just send the new number".

[click] If `votes` were writable, a client could PATCH `9999`. It isn't writable in our code, so our server ignores it, but that's the design we're avoiding. "Never trust the client."

[click] Instead: POST to an action URL with no body. The server decides what an upvote does: plus one, nothing else.

[click] DRF's `@action` decorator adds the route. `detail=True` means "one question", so the URL is `/api/questions/<id>/upvote/`. `methods=["post"]` because it changes data.

→ SWITCH TO VS CODE (7:45): questions/views.py (cheat sheet step 6)

- Two imports at the top: `action` from `rest_framework.decorators` and `Response` from `rest_framework.response`.
- Type `upvote` at the end of `QuestionViewSet` with the room: `@action(detail=True, methods=["post"])`, then get the question (`get_object` also gives the 404), add one, save, and return it through the serializer. Save.
- Doing the exercise (next slide)? Stop after `upvote`. Skipping it? Type `toggle_answered` too.

Back here when: `upvote` is saved and runserver shows no errors (7:49).

If behind: skip the exercise and paste `toggle_answered` from the cheat sheet.
-->

---
plan: 26–27
---

# Your turn (optional)

<div class="turn">
<p class="lead">You wrote <code>upvote</code>. Now write <code>toggle_answered</code>.</p>
<CountdownTimer :seconds="120" :at="1" />
<p v-click="2" class="muted">Hint: start from a copy of <code>upvote</code>. Python's <code>not</code> flips a boolean.</p>
</div>

<style>
.turn {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
</style>

<!--
[7:49 · 6 min] [SLIDES]

- Leave this slide on the projector while people type.

[click] Starts the two-minute timer. Say: "Two minutes. Same file, right under `upvote`."

[click] Hint, around the one-minute mark: copy `upvote`, rename it, and change one line.

→ SWITCH TO VS CODE (7:51): questions/views.py

- When the timer ends, write the answer with the room: `toggle_answered` has the same shape as `upvote`, with `question.answered = not question.answered`. (The repo has two blank lines above it; that's harmless.) Save.

→ SWITCH TO BROWSER (7:52): http://127.0.0.1:8000/api/questions/1/upvote/

- The page shows `405 Method Not Allowed` for the GET. That's expected. Press the POST button at the bottom: `"votes": 1`, then `"votes": 2`.
- Open http://127.0.0.1:8000/api/questions/1/toggle_answered/ and press POST twice: `"answered": true`, then `false`.
- Show the list at `/api/questions/`: the numbers stuck.

Back here when: most people have upvoted (7:55).

If behind (cut list item 3; also if lesson 1 ran past 7:45): don't start the timer. Paste `toggle_answered` from the cheat sheet and do the browser check once yourself.
-->
