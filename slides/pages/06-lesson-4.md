---
plan: 39–41
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
[8:19 · 6 min] [SLIDES]

- The browser just showed `"votes": []`. A client that reads `"votes": 3` as a number would break.
- Every client depends on the JSON's field names and types. We can change how we store votes, as long as the JSON keeps the same fields.

[click] We fix it in the serializer: `votes = serializers.IntegerField(source="votes.count", read_only=True)`. `source="votes.count"` tells DRF to call `.count()` on the relation and send the number. `read_only=True` stops clients from setting it. The fields from before have the same names and types.
- We also add one new field, `has_voted`: true if the logged-in user voted for this question. Adding a field doesn't break existing clients, because they ignore fields they don't use. Logged-out visitors always get false.

[click] Renaming `upvote` to `toggle_vote` changes its URL, so this change does break clients. Say: "In an API with real users, you'd keep the old URL working for a while, or release a new version of the API."

→ SWITCH TO VS CODE (8:21): questions/serializers.py, then questions/views.py (cheat sheet steps 10 and 11)

- Serializer: add the `votes` and `has_voted` lines above `class Meta`, add `"has_voted"` to `fields`, and add `get_has_voted` below `Meta`. A `SerializerMethodField` calls the method named `get_<field name>`. `self.context["request"].user` is the user who sent the request. Save. Refresh `/api/questions/`: `"votes"` is a number again.
- Views: replace `upvote` with `toggle_vote`. If this user already voted, remove their vote. Otherwise, add it. There's no `save()`, because `add` and `remove` write to the join table directly. The action still requires `IsAuthenticated`, so `request.user` is always a real user. Save. Paste both files if you're short on time.

→ SWITCH TO BROWSER (8:23): http://127.0.0.1:8000/api/questions/1/toggle_vote/ (logged in as sam)

- sam presses POST: `"votes": 1, "has_voted": true`. Again: `"votes": 0, "has_voted": false`. The second click removes the vote.
- Log in as mod and press POST: `"votes": 1, "has_voted": true`. Each user can add one vote.
- `/api/questions/1/upvote/` now returns 404, because the route no longer exists.

Back here when: 8:25. The wrap-up starts then, even if people are still typing.

If behind: paste both files from the cheat sheet and do the toggle yourself. Show this slide even when lesson 4 is a demo.
-->
