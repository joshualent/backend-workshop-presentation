---
part: Lesson 2
---

# Lesson 2: How should voting work?

<div class="why">
<p><code>votes</code> and <code>answered</code> are read-only, so no client can change them.</p>

<div v-click="1" class="case">
<div class="req"><MethodBadge method="PATCH" /> <code>/api/questions/1/</code> <code class="muted">{"votes": 9999}</code></div>
<p class="small muted">If votes were writable, any client could set any number.</p>
</div>

<div v-click="2" class="case">
<div class="req"><MethodBadge method="POST" /> <code>/api/questions/1/upvote/</code> <span class="muted small">no body</span></div>
<p class="small muted">The server applies the rule: each upvote adds one.</p>
</div>

<p v-click="3">Some operations aren't create, read, update, or delete. DRF calls them <strong>actions</strong>.</p>

<CatchUp branch="checkpoint-1-crud" class="push-down" />
</div>

<style>
.why {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
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
[7:42 · 13 min] [SLIDES]

- Start from the browser: the server ignored `"votes": 9999`.

Ask: "How should voting work? Should the client send the new vote count?" Take one or two answers.

[click] If `votes` were writable, a client could PATCH `9999`. The serializer makes `votes` read-only, so the server ignores it. This is why we keep it read-only.

[click] Instead, the client sends a POST to an action URL with no body. The server decides what an upvote does: it adds one.

[click] Lesson 2 adds two custom actions: upvoting and marking a question answered. DRF's `@action` decorator adds the route. `detail=True` means the action works on one question, so the URL includes the question's id: `/api/questions/<id>/upvote/`. We use `methods=["post"]` because the action changes data. The model doesn't change, so there's no migration.

- Point at the last line: "If you're behind, run this line in your second terminal now. It saves your work and switches you to the finished code for lesson 1."

→ SWITCH TO VS CODE (7:45): questions/views.py (cheat sheet step 6)

- Add two imports at the top: `action` from `rest_framework.decorators` and `Response` from `rest_framework.response`.
- Type `upvote` at the end of `QuestionViewSet` with the room: `@action(detail=True, methods=["post"])`, then get the question (`get_object` returns a 404 if it doesn't exist), add one, save, and return it through the serializer. Save.
- Then type `toggle_answered` the same way. Say: "Copy `upvote`, rename it, and change one line: `question.answered = not question.answered`." The repo has two blank lines between the methods. That doesn't change anything. Save.

→ SWITCH TO BROWSER (7:50): http://127.0.0.1:8000/api/questions/1/upvote/

- The page shows `405 Method Not Allowed`, because the browser sent a GET. That's expected. Press the POST button at the bottom: `"votes": 1`, then `"votes": 2`.
- Open http://127.0.0.1:8000/api/questions/1/toggle_answered/ and press POST twice: `"answered": true`, then `false`.
- Open the list at `/api/questions/` to show that the database saved both changes.
- Last, the problem lesson 3 fixes. Say: "We never logged in." Press POST on `/api/questions/1/upvote/` a few more times; the count goes up every time.

Ask: "What else can anyone do without logging in?" Answers: mark a question answered, and edit or delete any question. Show the DELETE button on `/api/questions/1/`, but don't press it.

Back here when: most people have upvoted a question (7:55).

If behind: paste both methods from the cheat sheet, and do the browser check once yourself.
-->

---
part: Halfway
---

# Halfway break

<div class="stack">
<p>Take five minutes. If something doesn't work, put your hand up now.</p>
<CatchUp branch="checkpoint-2-actions" />
</div>

<!--
[7:55 · 5 min] [SLIDES]

- Say: "You've built a REST API: six routes and two actions, from five short files."
- Anyone who is behind runs the line on the slide. It gets them the finished code for lessons 1 and 2. `migrate` is safe to run even when nothing changed.

Ask: "Stretch for a few minutes. Anyone with an error, put your hand up now." Go to the raised hands.

Back here when: hands are down, or 8:00 at the latest.

If behind: time check. If this break hasn't started by 8:05, lesson 4 becomes a demo from `checkpoint-4-m2m`.
-->
