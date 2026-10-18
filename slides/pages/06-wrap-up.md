---
part: Wrap-up
---

# What you built

<BuiltMap :at="1" />

<!--
[8:25 · 1 min] [SLIDES]

- The same diagram, turned on its side, with the client at the top and SQLite at the bottom.

[click] Next to each part are the names you wrote: the `DefaultRouter`, `QuestionViewSet` with `get_permissions` and `toggle_vote`, `QuestionSerializer`, `Question`, and two tables (Django created the join table).

- Say: "This API validates input, checks permissions, and stores votes in a many-to-many relationship. You wrote about 60 lines of code for it."
- Anyone who fell behind can switch to `checkpoint-4-m2m` to get the finished project.
-->

---
part: Wrap-up
---

# Where to go next

<div class="next">
<ul>
<li>The official DRF tutorial</li>
<li>Tests with DRF's <code>APITestCase</code></li>
<li>Pagination and ordering</li>
<li>A frontend that calls your API</li>
<li>Deploying</li>
</ul>
<QrCode :url="$workshop.resourceListUrl" :size="170" />
</div>

<style>
.next {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 30px;
  align-items: start;
}
.next ul {
  gap: 8px;
  font-size: var(--fs-small);
}
</style>

<!--
[8:26 · 1 min] [SLIDES]

- Each of these builds on the code you wrote in this workshop.
- The DRF tutorial covers the same ideas in more depth: serializers, views, routers, and permissions.
- With `APITestCase`, you can turn the browser checks from this workshop into tests that run in about a second.
- Pagination returns a long list in pages. Ordering sorts it, for example by votes.
- A frontend, such as a React app, can call `/api/questions/` with `fetch`.
- Deploying puts the API on a server so other people can use it.
- The QR code links to resources for each of these.
-->

---
part: Wrap-up
---

# Questions?

<div class="thanks">
<div class="stack">
<p class="lead">Thanks for coming. The finished code is on <code>checkpoint-4-m2m</code>.</p>
<div>
<div class="file-label">Next Developer Club event</div>
<p v-if="!$isPlaceholder($workshop.nextEvent)">{{ $workshop.nextEvent }}</p>
<div v-else class="placeholder">Placeholder: next event (set nextEvent in workshop.config.ts)</div>
</div>
<ClubMark :height="48" />
</div>
<QrCode :url="$workshop.repoUrl" :size="170" />
</div>

<style>
.thanks {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 30px;
  align-items: start;
}
</style>

<!--
[8:27 · 3 min] [SLIDES]

- Thank the club, and anyone who helped, by name. Then take questions. Never cut this slide.
- Questions to answer if the room is quiet: "Why 403 and not 401?" (session login; see the notes on slide 14), "Why not let clients send the vote count?" (lesson 2), "How would a phone app log in?" (with a token).
- Repeat each question into the room before answering.
- Announce the next event before people start packing up.
- The QR code is the repo, the same one from the setup slide. Leave this slide on screen at the end.
-->
