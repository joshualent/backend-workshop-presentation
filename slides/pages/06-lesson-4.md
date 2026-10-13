---
plan: 37–38
clicks: 5
---

# From a count to a list of voters

<StepVideo name="v3-count-to-voters" alt="The votes column is removed from questions_question, a questions_question_votes join table links question 1 to sam and mod, sam's row is removed, and the JSON still says votes 1." />

<!--
[8:14 · 5 min] [SLIDES]

- Lesson 4: store who voted, not how many. The video shows what happens in the database.
- 0:00 (hold): today, `votes` is a number in the `questions_question` table: 3, after sam's three clicks. `auth_user` holds `mod` (id 1) and `sam` (id 2).

[click] 0:00–0:04: the migration's `RemoveField`. The `votes` column disappears, and the 3 goes with it.

[click] 0:04–0:08.5: `AddField` with a ManyToManyField. Django creates a new table, `questions_question_votes`, with `question_id` and `user_id`.

[click] 0:08.5–0:13.5: each vote is a row. Question 1 links to sam and to mod. Say: "A vote is now a fact: this user voted for this question."

[click] 0:13.5–0:18: sam calls `toggle_vote` again and their row is deleted. Nothing else changes.

[click] 0:18–0:24: the serializer counts the rows, so the JSON still says `"votes": 1`. Say: "Storage changed completely. The API didn't change at all." We make that true on the next slide.

- Say plainly: the migration throws the old totals away. A number like 3 can't be turned into "which three users". Questions and accounts are kept. In production, you plan migrations so you keep your data.
- If anyone asks: Django also adds a unique index on (question_id, user_id), so the database itself refuses a second vote from the same user.

→ SWITCH TO VS CODE (8:16): questions/models.py (cheat sheet step 9)

- Import `settings` (`from django.conf import settings`). `votes` becomes `models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)`: same name, new type. `blank=True` lets a question have no votes. Save.

→ SWITCH TO TERMINAL

- `uv run manage.py makemigrations questions --name votes_many_to_many` → expect `0002_votes_many_to_many.py` with `- Remove field votes from question` and `+ Add field votes to question`.
- `uv run manage.py migrate` → expect `Applying questions.0002_votes_many_to_many... OK`.

→ SWITCH TO BROWSER (8:18): http://127.0.0.1:8000/api/questions/

- Point at `"votes": []`: DRF shows a many-to-many field as a list of user ids. "We changed storage, and the JSON changed shape. Every client reading a number just broke."

Back here when: most people have applied 0002 (8:19).

If behind: `git switch checkpoint-4-m2m`, then `uv run manage.py migrate` (the migration is already in the branch; that code already has the serializer fix, so skip the `[]` moment). Time check: if the checkpoint pause didn't start by 8:05, demo this whole lesson from `checkpoint-4-m2m` in about 3 minutes (cut list item 5), but still show this video and the next slide.
-->

---
plan: 39–41
clicks: 2
---

# The API doesn't change

<div class="same">
<p>Clients only see the JSON. If it stays the same, they never notice.</p>

<div class="pair">
<div>
<div class="file-label">Before: an integer column</div>
<pre class="json">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 1,
 "answered": false, …}</pre>
</div>
<div v-click="1">
<div class="file-label">After: a count of the voters</div>
<pre class="json">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 1,
 "answered": false, …}</pre>
</div>
</div>

<p v-click="1" class="small">One serializer field does it: <code>votes</code> reports <code>votes.count</code>.</p>

<p v-click="2" class="small">One thing clients do notice: <code>/upvote/</code> becomes <code>/toggle_vote/</code>. Anything still calling <code>/upvote/</code> breaks.</p>
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
[8:19 · 6 min] [SLIDES]

- What the browser just showed: `"votes": []`. Every client reading `"votes": 3` would break.
- The JSON is a contract with every client. How we store votes is our business; what the JSON looks like is theirs.

[click] One serializer field fixes it: `votes = serializers.IntegerField(source="votes.count", read_only=True)`. `source` says "call `.count()` on the relation and show the number"; `read_only` keeps clients from setting it. Before and after are the same JSON. Say: "Storage changed, the contract didn't. Clients never notice."

[click] Renaming `upvote` to `toggle_vote` changes its URL. "In a real API with real clients, you'd keep the old URL around or version the API."

→ SWITCH TO VS CODE (8:21): questions/serializers.py, then questions/views.py (cheat sheet steps 10 and 11)

- Serializer: add the `votes` line above `class Meta`. Save. Refresh `/api/questions/`: `"votes"` is a number again.
- Views: replace `upvote` with `toggle_vote`. Has this user voted? Remove their vote. Otherwise, add it. No `save()`: `add` and `remove` write to the join table directly. Still `IsAuthenticated`, so we always know who `request.user` is. Save. Paste it if short on time.

→ SWITCH TO BROWSER (8:23): http://127.0.0.1:8000/api/questions/1/toggle_vote/ (logged in as sam)

- sam presses POST: `"votes": 1`. Again: `"votes": 0`. The vote toggles off instead of climbing.
- Log in as mod, POST: `"votes": 1`. Two users, one vote each.
- `/api/questions/1/upvote/` now gives 404: the route is gone.

Back here when: 8:25. Wrap-up starts then regardless.

If behind: paste both files from the cheat sheet and do the toggle yourself. Keep this slide even when lesson 4 is a demo.
-->
