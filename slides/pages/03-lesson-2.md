---
plan: 23–25, 27
---

# Why not let clients PATCH the vote count?

<div class="why">
<div v-click="1" class="case">
<div class="req"><MethodBadge method="PATCH" /> <code>/api/questions/1/</code> <code class="muted">{"votes": 9999}</code></div>
<p class="small muted">If votes were writable, any client could set any number.</p>
</div>

<div v-click="2" class="case">
<div class="req"><MethodBadge method="POST" /> <code>/api/questions/1/upvote/</code> <span class="muted small">no body</span></div>
<p class="small muted">The server applies the rule: each upvote adds one.</p>
</div>

<div v-click="3" class="case">
<p>Some operations aren't create, read, update, or delete. DRF calls them <strong>actions</strong>.</p>
<p class="small muted"><code>detail=True</code> makes the action work on one question, so its URL includes the question's id.</p>
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
[7:42 · 13 min] [SLIDES]

- Lesson 2 adds custom actions. Voting and marking a question answered change a question, but a client shouldn't be able to set the values freely. Each one is a named operation with a rule. We add two new URLs. The model doesn't change, so there's no migration.
- Start from the room's answer on the last slide: "the client sends the new number".

[click] If `votes` were writable, a client could PATCH `9999`. Our serializer makes `votes` read-only, so the server ignores it. This slide shows why we don't make it writable.

[click] Instead, the client sends a POST to an action URL with no body. The server decides what an upvote does: it adds one.

[click] DRF's `@action` decorator adds the route. `detail=True` means the action works on one question, so the URL is `/api/questions/<id>/upvote/`. We use `methods=["post"]` because the action changes data.

→ SWITCH TO VS CODE (7:45): questions/views.py (cheat sheet step 6)

- Add two imports at the top: `action` from `rest_framework.decorators` and `Response` from `rest_framework.response`.
- Type `upvote` at the end of `QuestionViewSet` with the room: `@action(detail=True, methods=["post"])`, then get the question (`get_object` returns a 404 if it doesn't exist), add one, save, and return it through the serializer. Save.
- Then type `toggle_answered` the same way. Say: "Copy `upvote`, rename it, and change one line: `question.answered = not question.answered`." The repo has two blank lines between the methods. That doesn't change anything. Save.

→ SWITCH TO BROWSER (7:51): http://127.0.0.1:8000/api/questions/1/upvote/

- The page shows `405 Method Not Allowed`, because the browser sent a GET. That's expected. Press the POST button at the bottom: `"votes": 1`, then `"votes": 2`.
- Open http://127.0.0.1:8000/api/questions/1/toggle_answered/ and press POST twice: `"answered": true`, then `false`.
- Open the list at `/api/questions/` to show that the database saved both changes.

Back here when: most people have upvoted a question (7:55).

If behind: paste both methods from the cheat sheet, and do the browser check once yourself.
-->
