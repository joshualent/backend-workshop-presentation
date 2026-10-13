---
plan: 37
clicks: 5
---

# From a count to a list of voters

<StepVideo name="v3-count-to-voters" alt="The votes column is removed from questions_question, a questions_question_votes join table links question 1 to sam and mod, sam's row is removed, and the JSON still says votes 1." />

<!--
[8:14 · 2 min] [SLIDES]

- Lesson 4: store who voted, not how many. The video shows what happens in the database.
- 0:00 (hold): today, `votes` is a number in the `questions_question` table: 3, after sam's three clicks. `auth_user` holds `mod` (id 1) and `sam` (id 2).

[click] 0:00–0:04: the migration's `RemoveField`. The `votes` column disappears, and the 3 goes with it.

[click] 0:04–0:08.5: `AddField` with a ManyToManyField. Django creates a new table, `questions_question_votes`, with `question_id` and `user_id`.

[click] 0:08.5–0:13.5: each vote is a row. Question 1 links to sam and to mod. Say: "A vote is now a fact: this user voted for this question."

[click] 0:13.5–0:18: sam calls `toggle_vote` again and their row is deleted. Nothing else changes.

[click] 0:18–0:24: the serializer counts the rows, so the JSON still says `"votes": 1`. Say: "Storage changed completely. The API didn't change at all."

- If anyone asks: Django also adds a unique index on (question_id, user_id), so the database itself refuses a second vote from the same user.
- Time check: if the checkpoint pause didn't start by 8:05, demo this lesson from `checkpoint-4-m2m` in about 3 minutes (cut list item 5), but still show this video and the serializer slide.
-->

---
plan: 38
---

# Change the field

<div class="field">
<div>
<div class="file-label">questions/models.py</div>

<!-- code-block: models-3-to-4 -->
````md magic-move
```python
from django.db import models


class Question(models.Model):
    text = models.CharField(max_length=300)
    votes = models.IntegerField(default=0)
    answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```
```python {1,7}
from django.conf import settings
from django.db import models


class Question(models.Model):
    text = models.CharField(max_length=300)
    votes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```
````
<!-- /code-block -->

</div>

```bash
uv run manage.py makemigrations questions --name votes_many_to_many
uv run manage.py migrate
```

<p class="small">Vote totals reset to zero: a number can't say who voted.<br><span class="muted">In production, plan migrations so you keep your data.</span></p>
</div>

<style>
.field {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

<!--
[8:16 · 3 min] [VS CODE]

- Same field name, `votes`, new type.

[click] `votes` becomes a `ManyToManyField` to the user model, and we import `settings` to name it. `blank=True` lets a question have no votes.

- Say plainly: the old totals are thrown away. The migration removes the integer column and adds the join table; a number like 3 can't be turned into "which three users". Questions and accounts are kept.

→ SWITCH TO VS CODE: questions/models.py

- Make the two changes. Save. Until the serializer change on the next slide, the API shows `votes` as a list of user ids; that's expected.

→ SWITCH TO TERMINAL

- `uv run manage.py makemigrations questions --name votes_many_to_many` → expect `0002_votes_many_to_many.py` with `- Remove field votes from question` and `+ Add field votes to question`.
- `uv run manage.py migrate` → `Applying questions.0002_votes_many_to_many... OK`.

Back here when: most people have applied 0002.

If behind: `git switch checkpoint-4-m2m` then `uv run manage.py migrate` (the migration is already in the branch).
-->

---
plan: 39
---

# The API doesn't change

<div class="same">
<div>
<div class="file-label">questions/serializers.py</div>

<!-- code-block: serializer-cp4 -->
```python {2}
class QuestionSerializer(serializers.ModelSerializer):
    votes = serializers.IntegerField(source="votes.count", read_only=True)

    class Meta:
        model = Question
        fields = ("id", "text", "votes", "answered", "created_at")
        read_only_fields = ("id", "votes", "answered", "created_at")
```
<!-- /code-block -->

</div>
<div v-click="1" class="pair">
<div>
<div class="file-label">Before: an integer column</div>
<pre class="json">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 1,
 "answered": false, …}</pre>
</div>
<div>
<div class="file-label">After: votes.count</div>
<pre class="json">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 1,
 "answered": false, …}</pre>
</div>
</div>
</div>

<style>
.same {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.same .pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.same .json {
  margin: 0;
  padding: var(--code-pad-y) var(--code-pad-x);
  background: var(--surface);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  line-height: var(--lh-code);
}
</style>

<!--
[8:19 · 2 min] [VS CODE]

- Without this line, DRF would show `votes` as a list of user ids. Every client reading `"votes": 3` would break.
- `source="votes.count"`: call `.count()` on the relation and show the number. `read_only=True`: clients still can't set it.

[click] Before and after, side by side: the same JSON. Say: "Storage changed, the contract didn't. Clients never notice."

→ SWITCH TO VS CODE: questions/serializers.py

- Add the one line above `class Meta`. Save. Runserver should be happy again.

Back here when: the line is saved.
-->

---
plan: 40
---

# Upvote becomes toggle

<div class="toggle">
<div>
<div class="file-label">questions/views.py</div>

<!-- code-block: upvote-to-toggle -->
````md magic-move
```python
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None, format=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)
```
```python
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def toggle_vote(self, request, pk=None, format=None):
        question = self.get_object()
        has_voted = question.votes.filter(pk=request.user.pk).exists()

        if has_voted:
            question.votes.remove(request.user)
        else:
            question.votes.add(request.user)

        return Response(self.get_serializer(question).data)
```
````
<!-- /code-block -->

</div>
<p v-click="2" class="small muted"><code>/upvote/</code> is gone. Any client still calling it would break.</p>
</div>

<style>
.toggle {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

<!--
[8:21 · 2 min] [VS CODE]

- `upvote` from checkpoint 3.

[click] It becomes `toggle_vote`. Has this user voted? Remove their vote. Otherwise, add it. No `save()`: `add` and `remove` write to the join table directly. Still `IsAuthenticated`, so we always know who `request.user` is.

[click] Renaming the action changes the URL. One line: "In a real API with real clients, you'd keep the old URL around or version the API."

→ SWITCH TO VS CODE: questions/views.py

- Replace `upvote` with `toggle_vote`. Save. Paste it if short on time.

Back here when: saved, and runserver shows no errors.
-->

---
plan: 41
---

# Try it

<div class="tries">
<Exchange who="sam" method="POST" url="/api/questions/1/toggle_vote/" :status="200" response='"votes": 1' :at="1" />
<Exchange who="sam" method="POST" url="/api/questions/1/toggle_vote/" :status="200" response='"votes": 0' :at="2" />
<Exchange who="mod" method="POST" url="/api/questions/1/toggle_vote/" :status="200" response='"votes": 1' :at="3" />
<p v-click="3" class="lead accent">Two users, one vote each.</p>
</div>

<style>
.tries {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

<!--
[8:23 · 2 min] [BROWSER]

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/1/toggle_vote/ (logged in as sam)

[click] sam presses POST: `"votes": 1`.

[click] sam presses POST again: `"votes": 0`. The vote toggled off instead of climbing.

[click] Log in as mod, POST: `"votes": 1`. Each user counts once. Optional: sam votes again and it's 2.

- `/api/questions/1/upvote/` now gives 404: the route is gone.

If behind: show it yourself. Wrap-up starts at 8:25 regardless.
-->
