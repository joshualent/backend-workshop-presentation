---
plan: 28
---

# You built a REST API

<div class="built">
<RequestMap :highlight="['router', 'viewset', 'serializer', 'model', 'db']" />

<div>
<div class="file-label">If you're behind, catch up to the end of lesson 2:</div>

```bash
git stash push -u -m "my work"
git switch checkpoint-2-actions
uv run manage.py migrate
```

</div>
</div>

<style>
.built {
  display: flex;
  flex-direction: column;
  gap: 26px;
}
</style>

<!--
[7:55 · 3 min] [SLIDES]

- We're halfway. You wrote the code for every box on the diagram: the URLs, a ViewSet with two custom actions, a serializer, and a model. `migrate` created the table.
- A REST API in one sentence: each resource has a URL, the method says what to do with it, and the status code says what happened.
- Anyone who is behind runs these three commands, and helpers go to raised hands. `migrate` is safe to run even when nothing changed.

Ask: "Stretch for a minute. Anyone with an error, hand up now."

Back here when: hands are down, or 7:58 at the latest.

If behind: time check. If this pause hasn't started by 8:05, lesson 4 becomes a demo from `checkpoint-4-m2m`.
-->

---
plan: 29
---

# What's still broken?

<ul>
<li v-click>Anyone can upvote a question as many times as they want, without logging in.</li>
<li v-click>Anyone can mark a question answered.</li>
<li v-click>Anyone can edit or delete any question.</li>
</ul>

<!--
[7:58 · 4 min] [BROWSER]

Ask first: "We're not logged in. What can we do that we shouldn't?" Let the room answer before you click.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/1/upvote/

- While logged out, press POST ten times. The vote count goes up by one each time.

→ SWITCH TO SLIDES

[click] Anyone can upvote as often as they want, without logging in.

[click] Anyone can mark a question answered. Only moderators should be able to do that.

[click] Anyone can PATCH or DELETE any question. You can show the DELETE button on `/api/questions/1/`, but don't press it.

- Say: "Lesson 3 adds logins, and rules for what each user is allowed to do."
-->
