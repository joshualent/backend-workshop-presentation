---
plan: 42
---

# What you built

<BuiltMap :at="1" />

<!--
[8:25 · 1 min] [SLIDES]

- The same map, with the names you wrote.

[click] `DefaultRouter`, `QuestionViewSet` with `get_permissions` and `toggle_vote`, `QuestionSerializer`, `Question`, and two tables, including the join table Django made for us.

- "A real API: validation, permissions, and a many-to-many relationship, in about 60 lines of your own code."
- Anyone who fell behind: `checkpoint-4-m2m` is the finished project.
-->

---
plan: 43
---

# Where to go next

<div class="next">
<ul>
<li>Token auth, for frontends and apps</li>
<li>PostgreSQL instead of SQLite</li>
<li>Tests with DRF's <code>APITestCase</code></li>
<li>Pagination and ordering</li>
<li>Deploying it somewhere public</li>
<li>A frontend that calls your API</li>
<li>The official DRF tutorial</li>
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

- Pick one. Each builds straight on tonight's code.
- Token auth is the next step if you want a React or mobile app to log in.
- `APITestCase` lets you write tonight's "try it" checks as tests that run in a second.
- The QR code has links for all of these.
-->

---
plan: 44–45
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

- Thank the helpers and the club by name, then take questions. Never cut this.
- Good fallbacks if it's quiet: "Why 403 and not 401?" (session auth; see slide 9's notes), "Why not let clients send votes?" (lesson 2), "How would a phone app log in?" (tokens).
- Repeat each question into the room before answering.
- Announce the next event before people start packing up.
- The QR code is the repo, the same one from the setup slide. Leave this slide on screen at the end.
-->
