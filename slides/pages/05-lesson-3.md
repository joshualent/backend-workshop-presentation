---
plan: 30
---

# Authentication and authorization

<div class="auth">
<p v-click="1"><strong>Authentication</strong> checks who sent the request. You prove who you are with a username and password.</p>
<p v-click="2"><strong>Authorization</strong> checks whether that user is allowed to make the request. In DRF, permission classes do this.</p>
<p v-click="3" class="small muted">Tonight we log in to the browsable API with a session. Apps and frontends usually send a token instead. The permission code is the same for both.</p>
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

- Lesson 3 fixes the problems on the last slide. The server needs to know who sent each request, and then decide whether that user is allowed to do it.

[click] Authentication: you log in once with a username and password, and the browser sends a session cookie with every request after that.

[click] Authorization: the server knows who you are, and checks whether you may make this request. DRF permission classes do this check.

[click] The browsable API uses session login. A React or mobile app sends a token in a header instead. `permission_classes` works the same way with either kind of login.
-->

---
plan: 31, 34
---

# Who can do what

<div class="rules-wrap">
<table class="rules">
<thead>
<tr><th>Operation</th><th>Who can do it</th></tr>
</thead>
<tbody>
<tr><td>List, read, or create questions</td><td>Anyone, including logged-out visitors</td></tr>
<tr><td>Upvote</td><td>Any logged-in user</td></tr>
<tr><td>Edit or delete questions</td><td>Staff users</td></tr>
<tr><td>Toggle answered</td><td>Staff users</td></tr>
</tbody>
</table>

<p v-click="1" class="small">Staff status is a checkbox on each user. DRF's <code>IsAdminUser</code> checks staff status, not superuser status. <code>createsuperuser</code> sets both.</p>
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

- These are the rules we write next. Read them out once.
- Anyone can still ask a question, because that is what a Q&A board is for.
- Voting needs a login so the server knows who voted. Lesson 4 uses that.
- Only staff can moderate: edit, delete, and mark questions answered.
- Questions have no owner tonight, so you can't edit a question you asked. Only staff can edit.

[click] The name `IsAdminUser` is misleading: it checks the "Staff status" checkbox on the user, not "Superuser status". `createsuperuser` sets both, so `mod` passes. We create `sam` on the admin's Users page with both boxes unchecked, so sam fails every staff check. A user with only Staff status checked is a moderator without full admin access.
-->

---
plan: 32–33, 35
---

# How DRF checks permissions

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

- Start at the bottom: the ViewSet's default is `permission_classes = [AllowAny]`, which we wrote in lesson 1. Anyone can do anything.

[click] Top: DRF calls `get_permissions()` on every request. For `update`, `partial_update`, and `destroy` (PUT, PATCH, and DELETE on `/api/questions/1/`), our version returns `IsAdminUser`.

[click] Middle: an action can set its own `permission_classes`. `upvote` uses `IsAuthenticated`, and `toggle_answered` uses `IsAdminUser`.

[click] On the diagram: DRF runs the check inside the ViewSet, before your method runs. If the check fails, the request never reaches the serializer or the database.

- For any request, read the chart from top to bottom. The first "yes" decides which permission class applies.

→ SWITCH TO VS CODE (8:07): questions/views.py, then config/urls.py (cheat sheet steps 7 and 8)

- The import line becomes `from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser`.
- `get_permissions()` goes right under `permission_classes`: `[IsAdminUser()]` for the three actions, otherwise `super().get_permissions()`.
- `upvote` gets `permission_classes=[IsAuthenticated]`; `toggle_answered` gets `permission_classes=[IsAdminUser]`. Save.
- `config/urls.py`: add `path("api-auth/", include("rest_framework.urls"))` at the end of `urlpatterns`. This line adds the Log in link to the browsable API. Save.

→ SWITCH TO TERMINAL (8:09)

- Anyone who didn't make `mod` in lesson 1: `uv run manage.py createsuperuser`.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/auth/user/add/

- Create `sam` with a password. Leave Staff status and Superuser status unchecked. Save.

→ SWITCH TO BROWSER (8:11): http://127.0.0.1:8000/api/questions/ to try it as three users

- Log in and out with the browsable API's Log in link (top right). The admin and the browsable API use the same login session.
- Logged out: open `/api/questions/1/upvote/`. The page itself shows `403` and "Authentication credentials were not provided." No POST button.
- As `sam`: upvote works (POST button, `200`). `/api/questions/1/toggle_answered/` shows `403` "You do not have permission to perform this action." On `/api/questions/1/`, sam gets no edit or delete form at all.
- As `mod`: everything works, including the edit form on `/api/questions/1/`.
- The browsable API hides forms that you aren't allowed to use. To show the 403 that sam gets for an edit, use the terminal: `curl -i -u sam:PASSWORD -X PATCH http://127.0.0.1:8000/api/questions/1/ -H "Content-Type: application/json" -d '{"text": "x"}'` → `403`. (`-u` uses basic authentication, which DRF also accepts by default.)

Back here when: you've shown all three users (8:13).

If behind: paste `views.py` from the cheat sheet. Describe sam instead of creating it, and show only `mod` (cut list item 3).
-->

---
plan: 36, 38
---

# What's still broken?

<div class="still">
<p><code>sam</code> upvotes three times:</p>
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='"votes": 1' />
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='"votes": 2' />
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='"votes": 3' />
<p class="lead accent">The votes field stores only a number, so the server can't tell that sam already voted.</p>
<p v-click="1">Lesson 4 stores which users voted for each question, instead of a number.</p>
</div>

<style>
.still {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

<!--
[8:13 · 6 min] [SLIDES]

- Voting needs a login now, but a logged-in user can still vote as many times as they want.
- `votes` is a number. Ask: "When sam clicks again, how would the server know that sam already voted?"
- It can't. The server needs to store who voted, not how many votes there are.

[click] Lesson 4: `votes` becomes a many-to-many field. A many-to-many field links each question to any number of users, and each user to any number of questions.

- Django stores the links in a new table, `questions_question_votes`. Each row has a `question_id` and a `user_id`, and means "this user voted for this question". Removing a vote deletes one row.
- Django also adds a unique index on (`question_id`, `user_id`), so the database rejects a second vote from the same user. Mention this only if someone asks.
- Say: "The migration deletes the old vote totals. A total like 3 doesn't say which three users voted, so Django can't turn it into rows. Questions and accounts stay." In production, you write migrations that keep your data.

→ SWITCH TO VS CODE (8:15): questions/models.py (cheat sheet step 9)

- Import `settings` (`from django.conf import settings`). Change `votes` to `models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)`. The field keeps its name and gets a new type. `blank=True` allows a question with no votes. Save.

→ SWITCH TO TERMINAL

- `uv run manage.py makemigrations questions --name votes_many_to_many` → expect `0002_votes_many_to_many.py` with `- Remove field votes from question` and `+ Add field votes to question`.
- `uv run manage.py migrate` → expect `Applying questions.0002_votes_many_to_many... OK`.

→ SWITCH TO BROWSER (8:18): http://127.0.0.1:8000/api/questions/

- Point at `"votes": []`. DRF shows a many-to-many field as a list of user ids. Say: "We changed how we store votes, and the JSON changed too. A client that expects a number in `votes` now breaks."

Back here when: most people have applied migration 0002 (8:19).

If behind: run `git switch checkpoint-4-m2m`, then `uv run manage.py migrate`. The branch already has the migration and the serializer fix, so skip the `[]` step. Time check: if the checkpoint pause didn't start by 8:05, demo the whole lesson from `checkpoint-4-m2m` in about 3 minutes (cut list item 4), but still show the next slide.
-->
