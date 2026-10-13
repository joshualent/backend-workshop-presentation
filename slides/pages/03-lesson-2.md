---
layout: section
plan: 23
---

# Lesson 2: custom actions

<p>Some operations aren't create, read, update, or delete.</p>

<!--
[7:42 · 1 min] [SLIDES]

- Voting and marking answered change a question, but they aren't a free-form edit. They're named operations with a rule inside.
- This lesson: two new URLs, no new model fields, no migration.
-->

---
plan: 24
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

<!-- code-block: upvote-decorator -->
```python
    @action(detail=True, methods=["post"])
    def upvote(self, request, pk=None, format=None):
```
<!-- /code-block -->

<p class="small muted"><code>detail=True</code>: it acts on one question, so the URL has the id in it.</p>
</div>
</div>

<style>
.why {
  display: flex;
  flex-direction: column;
  gap: 22px;
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
[7:43 · 2 min] [SLIDES]

- Take the answer from the last slide: "just send the new number".

[click] If `votes` were writable, a client could PATCH `9999`. It isn't writable in our code, so our server ignores it, but that's the design we're avoiding. "Never trust the client."

[click] Instead: POST to an action URL with no body. The server decides what an upvote does: plus one, nothing else.

[click] DRF's `@action` decorator adds the route. `detail=True` means "one question", so the URL is `/api/questions/<id>/upvote/`. `methods=["post"]` because it changes data.
-->

---
plan: 25
---

# Add the actions

<div>
<div class="file-label">questions/views.py</div>

<!-- code-block: views-1-to-2 -->
````md magic-move
```python
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Question
from .serializers import QuestionSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
```
```python {2-3}
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
```python {6-11}
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["post"])
    def upvote(self, request, pk=None, format=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)
```
```python {9-14}
    @action(detail=True, methods=["post"])
    def upvote(self, request, pk=None, format=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)


    @action(detail=True, methods=["post"])
    def toggle_answered(self, request, pk=None, format=None):
        question = self.get_object()
        question.answered = not question.answered
        question.save()
        return Response(self.get_serializer(question).data)
```
````
<!-- /code-block -->

</div>

<!--
[7:45 · 4 min] [VS CODE]

- `views.py` from checkpoint 1, morphing to checkpoint 2.

[click] Two imports: the `action` decorator and DRF's `Response`.

[click] `upvote`: get the question from the URL's id (`get_object` also gives the 404), add one, save, and return it through the serializer.

[click] `toggle_answered`: the same shape; `not` flips the boolean. (The two blank lines above it are in the repo as-is.)

→ SWITCH TO VS CODE: questions/views.py

- Add the two imports and type `upvote` with the room. Save.
- If you're doing the exercise (next slide), stop after `upvote`. If not, type `toggle_answered` too.

Back here when: `upvote` is saved and runserver shows no errors.

If behind: skip the exercise and paste `toggle_answered` from the cheat sheet.
-->

---
plan: 26
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
[7:49 · 3 min] [SLIDES]

- Leave this slide on the projector while people type.

[click] Starts the two-minute timer. Say: "Two minutes. Same file, right under `upvote`."

[click] Hint, around the one-minute mark: copy `upvote`, rename it, and change one line.

- When the timer ends, show the answer: go back one slide (the last Magic Move step) or paste from the cheat sheet.

If behind: skip this slide entirely (cut list item 3). Lesson 1 not done by 7:45 means skip it.
-->

---
plan: 27
---

# Try it

<div class="tries">
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='{"id": 1, …, "votes": 1, "answered": false, …}' />
<Exchange method="POST" url="/api/questions/1/upvote/" :status="200" response='{"id": 1, …, "votes": 2, "answered": false, …}' />
<Exchange method="POST" url="/api/questions/1/toggle_answered/" :status="200" response='{"id": 1, …, "votes": 2, "answered": true, …}' />
<Exchange method="POST" url="/api/questions/1/toggle_answered/" :status="200" response='{"id": 1, …, "votes": 2, "answered": false, …}' />
</div>

<style>
.tries {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

<!--
[7:52 · 3 min] [BROWSER]

- Upvote climbs; toggling twice puts it back.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/1/upvote/

- The page shows `405 Method Not Allowed` for the GET. That's expected. Press the POST button at the bottom. Expect `"votes": 1`, then `"votes": 2`.
- Open http://127.0.0.1:8000/api/questions/1/toggle_answered/ and press POST twice: `"answered": true`, then `false`.
- Show the list at `/api/questions/`: the numbers stuck.

Back here when: most people have upvoted.

If behind: do it once yourself on the projector and move on.
-->
