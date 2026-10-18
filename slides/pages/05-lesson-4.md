---
part: Lesson 4
---

# Lesson 4: One vote per user

<div class="voters">
<p><code>votes</code> is a number, so the server can't tell who voted.</p>

<div v-click="1" class="join-wrap">
<p>Lesson 4 makes <code>votes</code> a many-to-many field. Django stores each vote as a row in a new table:</p>
<div>
<div class="file-label">questions_question_votes</div>
<table class="join">
<thead>
<tr><th>id</th><th>question_id</th><th>user_id</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>1</td><td>1 <span class="who">(mod)</span></td></tr>
<tr><td>2</td><td>1</td><td>2 <span class="who">(sam)</span></td></tr>
</tbody>
</table>
</div>
</div>

<p v-click="2" class="small">The migration deletes the old vote counts.</p>

<CatchUp branch="checkpoint-3-auth" class="push-down" />
</div>

<style>
.voters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}
.voters .join-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.join {
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
}
.join th,
.join td {
  text-align: left;
  padding: 6px 40px 6px 0;
  border-bottom: var(--stroke-w) solid var(--rule);
}
.join th {
  font-weight: 600;
  color: var(--text-2);
}
.join .who {
  font-family: var(--font-sans);
  font-size: var(--fs-label);
  color: var(--text-2);
}
</style>

<!--
[8:13 · 2 min] [SLIDES]

- Start from the browser: sam voted three times, and the count went up each time.
- `votes` is a number. Ask: "When sam clicks again, how would the server know that sam already voted?" It can't. The server needs to store who voted, not how many votes there are.

[click] A many-to-many field links each question to any number of users, and each user to any number of questions. Django stores the links in a new table, `questions_question_votes`. Each row has a `question_id` and a `user_id`, and means "this user voted for this question". Removing a vote deletes one row.

- Django also adds a unique index on (`question_id`, `user_id`), so the database rejects a second vote from the same user. Mention this only if someone asks.

[click] Say: "The migration deletes the old vote counts. A count like 3 doesn't say which three users voted, so Django can't turn it into rows. Questions and accounts stay." In production, you write migrations that keep your data.

- Point at the last line: "If you're behind, run this line now. It switches you to the finished code for lesson 3."
-->

---
part: Lesson 4
clicks: 2
---

# Keep the JSON compatible

<div class="same">
<p>Clients see only the JSON. If the existing fields keep their names and types, existing clients keep working.</p>

<div class="pair">
<div>
<div class="file-label">Before: votes is an integer column</div>
<pre class="json">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 1,
 "answered": false, …}</pre>
</div>
<div v-click="1">
<div class="file-label">After: votes counts the users who voted</div>
<pre class="json">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 1,
 <span class="accent">"has_voted": false,</span>
 "answered": false, …}</pre>
</div>
</div>

<p v-click="1" class="small">The serializer reports <code>votes</code> as <code>votes.count</code>, so <code>votes</code> is still a number. It also adds a new field, <code>has_voted</code>.</p>

<p v-click="2" class="small">Renaming <code>upvote</code> to <code>toggle_vote</code> changes the URL. Clients that still call <code>/upvote/</code> get a 404.</p>
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
[8:15 · 10 min] [SLIDES]

- If we change only the model, DRF sends `votes` as a list of user ids, such as `"votes": []`. A client that reads `"votes": 3` as a number would break.
- Every client depends on the JSON's field names and types. We can change how we store votes, as long as the JSON keeps the same fields.

[click] We fix it in the serializer: `votes = serializers.IntegerField(source="votes.count", read_only=True)`. `source="votes.count"` tells DRF to call `.count()` on the relation and send the number. `read_only=True` stops clients from setting it. The fields from before have the same names and types.

- We also add one new field, `has_voted`: true if the logged-in user voted for this question. Adding a field doesn't break existing clients, because they ignore fields they don't use. Logged-out visitors always get false.

[click] `upvote` becomes `toggle_vote`: if you already voted, it removes your vote, and otherwise it adds it. The new name changes the URL, so this change does break clients. Say: "In an API with real users, you'd keep the old URL working for a while, or release a new version of the API."

- Say: "Now we write all of lesson 4."

→ SWITCH TO VS CODE (8:17): questions/models.py (cheat sheet step 9)

- Import `settings` (`from django.conf import settings`). Change `votes` to `models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)`. The field keeps its name and gets a new type. `blank=True` allows a question with no votes. Save.

→ SWITCH TO TERMINAL (8:18)

- `uv run manage.py makemigrations questions --name votes_many_to_many` → expect `0002_votes_many_to_many.py` with `- Remove field votes from question` and `+ Add field votes to question`.
- `uv run manage.py migrate` → expect `Applying questions.0002_votes_many_to_many... OK`.

→ SWITCH TO BROWSER (8:19): http://127.0.0.1:8000/api/questions/

- Point at `"votes": []`. Say: "This is the problem from the slide. The JSON changed, and a client that expects a number in `votes` now breaks. The serializer fixes it."

→ SWITCH TO VS CODE (8:20): questions/serializers.py, then questions/views.py (cheat sheet steps 10 and 11)

- Serializer: add the `votes` and `has_voted` lines above `class Meta`, add `"has_voted"` to `fields`, and add `get_has_voted` below `Meta`. A `SerializerMethodField` calls the method named `get_<field name>`. `self.context["request"].user` is the user who sent the request. Save. Refresh `/api/questions/`: `"votes"` is a number again.
- Views: replace `upvote` with `toggle_vote`. If this user already voted, remove their vote. Otherwise, add it. There's no `save()`, because `add` and `remove` write to the join table directly. The action still requires `IsAuthenticated`, so `request.user` is always a real user. Save. Paste both files if you're short on time.

→ SWITCH TO BROWSER (8:23): http://127.0.0.1:8000/api/questions/1/toggle_vote/ (logged in as sam)

- sam presses POST: `"votes": 1, "has_voted": true`. Again: `"votes": 0, "has_voted": false`. The second click removes the vote.
- Log in as mod and press POST: `"votes": 1, "has_voted": true`. Each user can add one vote.
- `/api/questions/1/upvote/` now returns 404, because the route no longer exists.

Back here when: 8:25. The wrap-up starts then, even if people are still typing.

If behind: run `git switch checkpoint-4-m2m`, then `uv run manage.py migrate`. The branch already has the migration and the serializer fix, so skip the `[]` step. Time check: if the break didn't start by 8:05, demo the whole lesson from `checkpoint-4-m2m` in about 3 minutes (cut list item 4), but still show both lesson 4 slides.
-->
