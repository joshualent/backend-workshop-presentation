---
plan: 28
---

# You built a REST API

<div class="built">
<RequestMap :highlight="['router', 'viewset', 'serializer', 'model', 'db']" />

<div>
<div class="file-label">Behind? Catch up to the end of lesson 2</div>

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

- Halfway. Every box on the map is now code you wrote: URLs, a ViewSet with two custom actions, a serializer, a model, and a table.
- REST in one line: resources at URLs, methods say what to do, status codes say what happened.
- Catch-up time. Anyone behind runs these three commands; helpers go to raised hands. `migrate` is safe to run even when nothing changed.

Ask: "Stretch for a minute. Anyone with an error, hand up now."

Back here when: hands are down, or 7:58 at the latest.

If behind: time check. If this pause hasn't started by 8:05, lesson 4 becomes a demo from `checkpoint-4-m2m`.
-->

---
plan: 29
---

# What's still broken?

<ul>
<li v-click>Anyone can upvote, forever.</li>
<li v-click>Anyone can mark a question answered.</li>
<li v-click>Anyone can edit or delete any question.</li>
</ul>

<!--
[7:58 · 4 min] [BROWSER]

Ask first: "We're not logged in. What can we do that we shouldn't?" Let the room answer before you click.

→ SWITCH TO BROWSER: http://127.0.0.1:8000/api/questions/1/upvote/

- Demo: press POST ten times, logged out. Votes climb to whatever you like.

→ SWITCH TO SLIDES

[click] Unlimited upvotes, from anyone, logged in or not.

[click] Anyone can mark answered. Moderating is everyone's job, which means nobody's.

[click] Anyone can PATCH or DELETE any question. Show the DELETE button on `/api/questions/1/` if you want, but don't press it.

- "Next: who are you, and what are you allowed to do?"
-->
