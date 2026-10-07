---
plan: 32
---

# What you built

Same map, real names. You wrote every one of these.

<RequestFlowMap morph class="mt-8" />

<!--
[8:25 · 1 min] [MODE: SLIDES]

← Back from VS Code: wrap-up starts at 8:25 no matter where Part B is. Stop coding mid-step if you have to; tier-3-m2m has the rest.

Say:
- "Remember this map from the start?"

[click] "Here it is with the real names: DefaultRouter, QuestionViewSet, QuestionSerializer, Question. You wrote every one of those tonight."

- "Everything on the internet that says 'API' has some version of these boxes."

If behind: click and say the first line.
-->

---
plan: 33
---

# Where to go next

<div class="next">
  <ul class="next-list">
    <li>Token auth (JWT)</li>
    <li>PostgreSQL instead of SQLite</li>
    <li>Tests with <code>APITestCase</code></li>
    <li>Pagination</li>
    <li>Deploying your API</li>
    <li>A frontend that calls your API</li>
    <li>The official DRF tutorial</li>
  </ul>
  <QrCode :url="$workshop.resourcesUrl" caption="All the links" :size="180" />
</div>

<style>
.next { display: grid; grid-template-columns: 1fr 200px; gap: 30px; align-items: start; margin-top: 10px; }
.next-list li { font-size: 24px !important; font-weight: 700 !important; margin-bottom: 14px !important; }
</style>

<!--
[8:26 · 1 min] [MODE: SLIDES]

Say:
- "If you want to keep going, here's the order I'd take it in."
- "Token auth is how phone apps log in. PostgreSQL is what you'd run in production. APITestCase lets you test every endpoint automatically."
- "Pagination stops /api/questions/ from returning ten thousand rows at once."
- "And the official DRF tutorial walks through everything we did, slower, with more detail."

Ask: "Take a photo of this slide, or scan the code for all the links."

If behind: just leave it up while you switch to questions.
-->

---
plan: 34
routeAlias: your-questions
fallback: your-questions-fallback
---

# Your questions

<LiveBoard :height="440" />

<!--
[8:27 · 2.5 min] [MODE: LIVE BOARD]

Say:
- "You've been voting all night. Let's answer the top ones."
- Read the top question aloud, answer it in a sentence or two, repeat. Aim for three to five.
- Skip anything that needs a whiteboard: "Find me after."

If the frame fails: press `b` for the screenshot; `b` again to come back.

If behind: answer the top two only. Stop at 8:29:30 for the last slide.
-->

---
layout: stage
plan: 35
routeAlias: thanks
---

<div class="thanks">
  <div class="thanks-main">
    <ClubWordmark :height="48" />
    <h1 class="display thanks-title">Thanks for building with us</h1>
    <div class="next-event">
      <span class="kicker">Next Developer Club event</span>
      <span class="event-title">{{ $workshop.nextEvent.title }}</span>
      <span class="event-meta">{{ $workshop.nextEvent.when }} · {{ $workshop.nextEvent.where }}</span>
    </div>
    <div class="repo-line"><span class="kicker">Starter repo</span> <code>{{ $display($workshop.starterRepoUrl) }}</code></div>
  </div>
  <div class="thanks-repo">
    <QrCode :url="$workshop.starterRepoUrl" caption="Starter repo" :size="170" :show-url="false" />
    <div class="thanks-branches"><code>tier-1-done</code><code>tier-2-auth</code><code>tier-3-m2m</code></div>
  </div>
</div>

<style>
.thanks { height: 100%; display: grid; grid-template-columns: 1fr 220px; gap: 30px; align-items: center; }
.thanks-main { display: flex; flex-direction: column; gap: 22px; }
.thanks-title { font-size: 76px !important; line-height: 0.98 !important; margin: 0 !important; }
.next-event { display: flex; flex-direction: column; gap: 6px; }
.event-title { font-size: 32px; font-weight: 800; }
.event-meta { font-size: 24px; font-weight: 700; color: var(--accent); }
.repo-line { display: flex; align-items: center; gap: 12px; }
.repo-line code { font-size: 20px !important; }
.thanks-repo { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.thanks-branches { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.thanks-branches code { font-size: var(--fs-label) !important; }
</style>

<!--
[8:29:30 · 30 s] [MODE: SLIDES]

Say:
- "Thank you for coming and building with us."
- "The starter repo stays up, checkpoint branches included, so you can finish the stretch goals at home."
- Announce the next Developer Club event (on the slide).

Leave this up while people pack. Helpers: collect any feedback, help anyone who wants to finish v2.
-->
