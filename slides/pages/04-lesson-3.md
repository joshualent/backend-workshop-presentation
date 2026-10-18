---
part: Lesson 3
---

# Lesson 3: Who can do what

<div class="auth">
<p>Authentication finds out who sent a request. Authorization decides whether that user may make it.</p>

<table v-click="1" class="rules">
<thead>
<tr><th>Operation</th><th>Who can do it</th><th>Permission class</th></tr>
</thead>
<tbody>
<tr><td>List, read, or create questions</td><td>Anyone</td><td><code>AllowAny</code></td></tr>
<tr><td>Upvote</td><td>Logged-in users</td><td><code>IsAuthenticated</code></td></tr>
<tr><td>Edit, delete, or toggle answered</td><td>Staff users</td><td><code>IsAdminUser</code></td></tr>
</tbody>
</table>

<p v-click="2">When a check fails, DRF sends <StatusBadge :code="403" />.</p>

<CatchUp branch="checkpoint-2-actions" class="push-down" />
</div>

<style>
.auth {
  display: flex;
  flex-direction: column;
  gap: 22px;
  height: 100%;
}
.rules {
  border-collapse: collapse;
  font-size: var(--fs-small);
}
.rules th,
.rules td {
  text-align: left;
  padding: 8px 36px 8px 0;
  border-bottom: var(--stroke-w) solid var(--rule);
}
.rules th {
  font-size: var(--fs-label);
  font-weight: var(--fw-strong);
  color: var(--text-2);
}
.rules code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
}
</style>

<!--
[8:00 · 13 min] [SLIDES]

- Start from what the room saw before the break: without logging in, anyone can upvote again and again, mark a question answered, and edit or delete any question. Lesson 3 adds logins and rules for who can do what.
- Authentication: you log in once with a username and password, and the browser sends a session cookie with every request after that. Authorization: the server knows who you are, and checks whether you may make this request. DRF's permission classes do this check.

[click] These are the rules we write next. Read them out once.

- Anyone can still ask a question, because that is what a Q&A board is for.
- Voting needs a login so the server knows who voted. Lesson 4 uses that.
- Only staff can moderate: edit, delete, and mark questions answered. Questions don't have an owner in this API, so you can't edit a question you asked.
- Where each rule goes: `AllowAny` is already the ViewSet's default from lesson 1. A new method, `get_permissions()`, returns `IsAdminUser` for `update`, `partial_update`, and `destroy` (PUT, PATCH, and DELETE). Each action sets its own `permission_classes`.
- The name `IsAdminUser` is misleading: it checks the "Staff status" checkbox on the user, not "Superuser status". `createsuperuser` sets both, so `mod` passes. We create `sam` with both boxes unchecked, so sam fails every staff check.

[click] A failed check gets `403 Forbidden`. The message says which check failed: "Authentication credentials were not provided." when you're logged out, and "You do not have permission to perform this action." when you're logged in but not allowed. We see both in the browser in a few minutes.

- Optional, only if someone asks: HTTP also has `401 Unauthorized` for a missing login. DRF sends 403 instead when the API uses session login, as the browsable API does. A React or mobile app usually sends a token instead of a session cookie, and `permission_classes` works the same way with either.
- Point at the last line: "If you're behind, run this line now. It switches you to the finished code for lesson 2."

→ SWITCH TO VS CODE (8:03): questions/views.py, then config/urls.py (cheat sheet steps 7 and 8)

- The import line becomes `from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser`.
- `get_permissions()` goes right under `permission_classes`: `[IsAdminUser()]` for the three actions, otherwise `super().get_permissions()`.
- `upvote` gets `permission_classes=[IsAuthenticated]`; `toggle_answered` gets `permission_classes=[IsAdminUser]`. Save.
- `config/urls.py`: add `path("api-auth/", include("rest_framework.urls"))` at the end of `urlpatterns`. This line adds the Log in link to the browsable API. Save.

→ SWITCH TO TERMINAL (8:06)

- Anyone who didn't make `mod` in lesson 1: `uv run manage.py createsuperuser`.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/auth/user/add/

- Create `sam` with a password. Leave Staff status and Superuser status unchecked. Save.

→ SWITCH TO BROWSER (8:08): http://127.0.0.1:8000/api/questions/ to try it as three users

- Log in and out with the browsable API's Log in link (top right). The admin and the browsable API use the same login session.
- Logged out: open `/api/questions/1/upvote/`. The page itself shows `403` and "Authentication credentials were not provided." No POST button.
- As `sam`: upvote works (POST button, `200`). `/api/questions/1/toggle_answered/` shows `403` "You do not have permission to perform this action." On `/api/questions/1/`, sam gets no edit or delete form at all.
- As `mod`: everything works, including the edit form on `/api/questions/1/`.
- The browsable API hides forms that you aren't allowed to use. To show the 403 that sam gets for an edit, use the terminal: `curl -i -u sam:PASSWORD -X PATCH http://127.0.0.1:8000/api/questions/1/ -H "Content-Type: application/json" -d '{"text": "x"}'` → `403`. (`-u` uses basic authentication, which DRF also accepts by default.)
- Last, the problem lesson 4 fixes. Log in as `sam` and press POST on `/api/questions/1/upvote/` three times. The vote count goes up by one each time.

Ask: "sam just voted three times. How would the server know that sam already voted?"

Back here when: you've shown all three users and sam's extra votes (8:13).

If behind: paste `views.py` from the cheat sheet. Describe sam instead of creating it, and show only `mod` (cut list item 3).
-->
