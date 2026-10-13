---
plan: 30
---

# Who are you, and what can you do?

<div class="auth">
<p v-click="1"><strong>Authentication</strong>: who are you? Logging in answers it.</p>
<p v-click="2"><strong>Authorization</strong>: what are you allowed to do? Permissions answer it.</p>
<p v-click="3" class="small muted">Tonight we log in to the browsable API with a session. Apps and frontends usually send a token instead. The permission code stays the same.</p>
</div>

<style>
.auth {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>

<!--
[8:02 · 1 min] [SLIDES]

- Lesson 3 fixes the last slide: we need to know who's asking, and then decide what they may do.

[click] Authentication: proving who you are. A username and password, once; then the browser remembers you.

[click] Authorization: given who you are, is this request allowed? That's what DRF permissions do.

[click] Session login is what the browsable API uses. A React or mobile app would send a token header instead, but `permission_classes` doesn't care how you logged in.
-->

---
plan: 31, 34
---

# The rules

<div class="rules-wrap">
<table class="rules">
<thead>
<tr><th>Operation</th><th>Who can do it</th></tr>
</thead>
<tbody>
<tr><td>List, read, or create questions</td><td>Anyone, including logged-out visitors</td></tr>
<tr><td>Upvote</td><td>Any logged-in user</td></tr>
<tr><td>Edit or delete questions</td><td>Staff</td></tr>
<tr><td>Toggle answered</td><td>Staff</td></tr>
</tbody>
</table>

<p v-click="1" class="small">Staff is a checkbox on each user. DRF's <code>IsAdminUser</code> checks it, not superuser. <code>createsuperuser</code> ticks both.</p>
</div>

<style>
.rules-wrap {
  display: flex;
  flex-direction: column;
  gap: 26px;
}
.rules {
  border-collapse: collapse;
  font-size: var(--fs-body);
}
.rules th,
.rules td {
  text-align: left;
  padding: 10px 40px 10px 0;
  border-bottom: var(--stroke-w) solid var(--rule);
}
.rules th {
  font-size: var(--fs-small);
  font-weight: var(--fw-strong);
  color: var(--text-2);
}
</style>

<!--
[8:03 · 2 min] [SLIDES]

- These are the rules we're about to write. Read them out once.
- Asking a question stays open to everyone: that's the point of a Q&A board.
- Voting needs a login so we know who's voting (that matters in lesson 4).
- Moderation, meaning edit, delete, and marking answered, is for staff.
- No ownership tonight: you can't edit "your own" question. Only staff can edit.

[click] Staff, not superuser. The name `IsAdminUser` is misleading: it checks the "Staff status" box on the user. `createsuperuser` sets both boxes, so `mod` passes. We'll make `sam` on the admin's Users page with both boxes off, so sam fails every staff check. Ticking only Staff status would make a moderator without every admin power.
-->

---
plan: 32–33, 35
---

# How DRF decides

<div class="decides">
<PermissionFlow />
<RequestMap mini :permission="3" class="push-down" />
</div>

<style>
.decides {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
}
</style>

<!--
[8:05 · 8 min] [SLIDES]

- Start at the bottom: the ViewSet's default, `permission_classes = [AllowAny]`, which we wrote in lesson 1. Everything is open.

[click] Top: `get_permissions()` runs on every request. For `update`, `partial_update`, and `destroy` (PUT, PATCH, DELETE on `/api/questions/1/`) it returns `IsAdminUser`.

[click] Middle: an action can carry its own `permission_classes`. `upvote` gets `IsAuthenticated`; `toggle_answered` gets `IsAdminUser`.

[click] On the map: the check runs inside the ViewSet, before your method runs. A failed check never reaches the serializer or the database.

- Read it top to bottom for any request: the first "yes" decides.

→ SWITCH TO VS CODE (8:07): questions/views.py, then config/urls.py (cheat sheet steps 7 and 8)

- The import line becomes `from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser`.
- `get_permissions()` goes right under `permission_classes`: `[IsAdminUser()]` for the three actions, otherwise `super().get_permissions()`.
- `upvote` gets `permission_classes=[IsAuthenticated]`; `toggle_answered` gets `permission_classes=[IsAdminUser]`. Save.
- `config/urls.py`: one line at the end of `urlpatterns`, `path("api-auth/", include("rest_framework.urls"))`. It gives the browsable API its Log in link. Save.

→ SWITCH TO TERMINAL (8:09)

- Anyone who didn't make `mod` in lesson 1: `uv run manage.py createsuperuser`.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/auth/user/add/

- Create `sam` with a password. Leave Staff status and Superuser status unchecked. Save.

→ SWITCH TO BROWSER (8:11): http://127.0.0.1:8000/api/questions/ to try it as three users

- Log in and out with the browsable API's Log in link (top right). The admin and the browsable API share the login.
- Logged out: open `/api/questions/1/upvote/`. The page itself shows `403` and "Authentication credentials were not provided." No POST button.
- As `sam`: upvote works (POST button, `200`). `/api/questions/1/toggle_answered/` shows `403` "You do not have permission to perform this action." On `/api/questions/1/`, sam gets no edit or delete form at all.
- As `mod`: everything works, including the edit form on `/api/questions/1/`.
- The browsable API hides forms you can't use. To show sam's 403 on an edit, use the terminal: `curl -i -u sam:PASSWORD -X PATCH http://127.0.0.1:8000/api/questions/1/ -H "Content-Type: application/json" -d '{"text": "x"}'` → `403`. (DRF also accepts basic auth by default; that's what `-u` uses.)

Back here when: you've shown all three users (8:13).

If behind: paste `views.py` from the cheat sheet. Describe sam instead of creating it, and show only `mod` (cut list item 4).
-->

---
plan: 36
---

# What's still broken?

<div class="still">
<p><code>sam</code> upvotes three times:</p>
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='"votes": 1' />
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='"votes": 2' />
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='"votes": 3' />
<p class="lead accent">A counter can't remember who voted.</p>
</div>

<style>
.still {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

<!--
[8:13 · 1 min] [SLIDES]

- Voting needs a login now, but logged-in users can still vote as often as they like.
- `votes` is just a number. Ask: "When sam clicks again, how would the server know sam already voted?"
- It can't. We need to store who voted, not how many. That's lesson 4.
-->
