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
plan: 31
---

# The rules

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

<style>
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
[8:03 · 1 min] [SLIDES]

- These are the rules we're about to write. Read them out once.
- Asking a question stays open to everyone: that's the point of a Q&A board.
- Voting needs a login so we know who's voting (that matters in lesson 4).
- Moderation, meaning edit, delete, and marking answered, is for staff.
- No ownership tonight: you can't edit "your own" question. Only staff can edit.
-->

---
plan: 32
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
[8:04 · 2 min] [SLIDES]

- Start at the bottom: the ViewSet's default, `permission_classes = [AllowAny]`, which we wrote in lesson 1. Everything is open.

[click] Top: `get_permissions()` runs on every request. For `update`, `partial_update`, and `destroy` (PUT, PATCH, DELETE on `/api/questions/1/`) it returns `IsAdminUser`.

[click] Middle: an action can carry its own `permission_classes`. `upvote` gets `IsAuthenticated`; `toggle_answered` gets `IsAdminUser`.

[click] On the map: the check runs inside the ViewSet, before your method runs. A failed check never reaches the serializer or the database.

- Read it top to bottom for any request: the first "yes" decides.
-->

---
plan: 33
---

# Add permissions

<div class="swap">
<div v-click.hide="4">
<div class="file-label">questions/views.py</div>

<!-- code-block: views-2-to-3 -->
````md magic-move
```python
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Question
from .serializers import QuestionSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
```
```python {4}
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .models import Question
from .serializers import QuestionSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
```
```python {1-3,5,7}
    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [IsAdminUser()]

        return super().get_permissions()

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None, format=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)
```
```python {9}
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None, format=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)


    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def toggle_answered(self, request, pk=None, format=None):
        question = self.get_object()
        question.answered = not question.answered
        question.save()
        return Response(self.get_serializer(question).data)
```
````
<!-- /code-block -->

</div>
<div v-click="4">
<div class="file-label">config/urls.py</div>

<!-- code-block: urls-cp3 -->
```python {4}
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
]
```
<!-- /code-block -->

<p class="small muted push">Adds the <strong>Log in</strong> link to the browsable API.</p>
</div>
</div>

<style>
.push {
  margin-top: 16px;
}
</style>

<!--
[8:06 · 4 min] [VS CODE]

- `views.py` from checkpoint 2, morphing to checkpoint 3.

[click] Import the two permission classes we need.

[click] `get_permissions()` goes right under `permission_classes`. And `upvote` gets `permission_classes=[IsAuthenticated]`.

[click] `toggle_answered` gets `permission_classes=[IsAdminUser]`.

[click] `config/urls.py`: one line, `api-auth/`, which gives the browsable API its Log in link.

→ SWITCH TO VS CODE: questions/views.py, then config/urls.py

- Make the three changes in `views.py`, then the one line in `urls.py`. Save both. Runserver reloads.

→ SWITCH TO TERMINAL

- Anyone who didn't make `mod` in lesson 1: `uv run manage.py createsuperuser`.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/admin/auth/user/add/

- Create `sam` with a password. Leave Staff status and Superuser status unchecked. Save.

Back here when: most people have `mod` and `sam`.

If behind: paste `views.py` from the cheat sheet. Describe the second user instead of creating it (cut list item 4).
-->

---
plan: 34
---

# Staff, not superuser

<div class="staff">
<p class="lead"><code>IsAdminUser</code> checks one thing: is the user <strong>staff</strong>?</p>

<table class="rules">
<thead>
<tr><th></th><th>Staff status</th><th>Superuser status</th><th><code>IsAdminUser</code></th></tr>
</thead>
<tbody>
<tr><td><code>mod</code></td><td>yes</td><td>yes</td><td>passes</td></tr>
<tr><td><code>sam</code></td><td>no</td><td>no</td><td>fails</td></tr>
</tbody>
</table>

<p class="small muted">A superuser is also staff: <code>createsuperuser</code> turns both on. <code>sam</code> came from the admin's Users page with both off.</p>
</div>

<style>
.staff {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.staff .rules {
  border-collapse: collapse;
  font-size: var(--fs-small);
}
.staff .rules th,
.staff .rules td {
  text-align: left;
  padding: 8px 30px 8px 0;
  border-bottom: var(--stroke-w) solid var(--rule);
}
.staff .rules th {
  font-weight: var(--fw-strong);
  color: var(--text-2);
}
</style>

<!--
[8:10 · 1 min] [SLIDES]

- The name is misleading: `IsAdminUser` doesn't mean superuser. It checks the "Staff status" box on the user.
- `createsuperuser` sets both boxes, so `mod` passes.
- `sam` has neither, so `sam` fails every staff check.
- You could make a moderator who is staff but not a superuser: tick only Staff status. They'd pass `IsAdminUser` without getting every admin permission.
-->

---
plan: 35
---

# Try it

<UserGrid />

<!--
[8:11 · 2 min] [BROWSER]

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/

- Log in and out with the browsable API's Log in link (top right). The admin and the browsable API share the login.

[click] Logged out: open `/api/questions/1/upvote/`. The page itself shows `403` and "Authentication credentials were not provided." No POST button.

[click] As `sam`: upvote works (POST button, `200`). `/api/questions/1/toggle_answered/` shows `403` "You do not have permission to perform this action." On `/api/questions/1/`, `sam` gets no edit or delete form at all.

[click] As `mod`: everything works, including the edit form on `/api/questions/1/`.

- The browsable API hides forms you can't use. To see sam's 403 on an edit, use the terminal: `curl -i -u sam:PASSWORD -X PATCH http://127.0.0.1:8000/api/questions/1/ -H "Content-Type: application/json" -d '{"text": "x"}'` → `403`. (DRF also accepts basic auth by default; that's what `-u` uses.)

If behind: show it as `mod` and describe the others (cut list item 4).
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
