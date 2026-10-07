---
plan: 24
---

<h1 class="display celebrate-title">You built a REST API</h1>

<RequestFlowMap checks class="mt-4" />

<div class="catchup">
  <span class="kicker">Behind? Catch up:</span>
  <code>git stash -u</code>
  <code>git checkout tier-1-done</code>
  <code>uv run python manage.py migrate</code>
</div>

<style>
.celebrate-title { font-size: 64px !important; line-height: 1 !important; }
.catchup { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 10px; }
.catchup code { font-size: 20px !important; }
</style>

<!--
[7:55 · 1.5 min] [MODE: SLIDES]

← Back from the browser: ?ordering=-votes works for most people.

TIME CHECK 8:05: if it's already past 8:05 when you reach this slide, skip v2 Part B tonight (demo it from tier-3-m2m in about 3 minutes instead).

Say:

[click] "Every box is done: router, ViewSet, serializer, model, database. That's a real REST API, the same shape as the ones behind real products."

- "If you're behind, these three commands put you exactly here." (`git stash -u` sets your changes aside; you can get them back with `git stash pop`.)

Ask: "Give yourselves a hand."

If behind: click once, say the first line, move on.
-->

---
plan: 25
routeAlias: vote-now
fallback: vote-now-fallback
---

# Vote now

Upvote what you want answered at the end.

<div class="vote">
  <LiveBoard :height="390" />
  <QrCode :url="$workshop.liveBoardUrl" caption="Scan to vote" :size="150" />
</div>

<style>
.vote { display: grid; grid-template-columns: 1fr 170px; gap: 24px; align-items: start; }
</style>

<!--
[7:56 · 3 min] [MODE: LIVE BOARD]

Say:
- "Stretch break. Scan the code and upvote what you want answered at 8:25."
- "If you're behind, this is the time: helpers will get you onto tier-1-done."
- Watch the board. Delete spam from the board's /admin/ (browser tab 3, see notes/screen-setup.md).

If the frame fails: press `b` for the screenshot; `b` again to come back.

If behind: one minute here instead of three.
-->

---
plan: 26
---

# What's wrong with our app?

<div class="wrong">
  <ul class="wrong-list">
    <li v-click>One person can upvote forever</li>
    <li v-click>Anyone can mark a question answered</li>
    <li v-click>Anyone can delete any question</li>
  </ul>
  <VoteSpam />
</div>

<style>
.wrong { display: grid; grid-template-columns: 1fr 370px; gap: 36px; align-items: start; margin-top: 24px; }
.wrong-list li { font-size: 28px !important; font-weight: 700 !important; margin-bottom: 26px !important; }
.wrong-list li::before { background: var(--error) !important; }
</style>

<!--
[7:59 · 2 min] [MODE: SLIDES]

Say:
- Ask first, reveal after.

Ask: "It works. So what's wrong with it?" Wait ten seconds. Take two or three answers.

[click] "One person can upvote forever." Point at the counter on the right: one user, every click.

[click] "Anyone can mark a question answered."

[click] "Anyone can delete any question. The app has no idea who you are."

- "Fixing this takes two ideas: authentication and authorization."

If behind: reveal all three at once and go.
-->

---
plan: 27
---

# Authentication vs. authorization

<div class="grid-2 auth">
  <div v-click class="card auth-card">
    <ph-identification-badge-bold class="auth-icon" />
    <h3>Authentication</h3>
    <p class="auth-q">Who are you?</p>
    <p class="muted">Logging in.</p>
  </div>
  <div v-click class="card auth-card">
    <ph-door-open-bold class="auth-icon" />
    <h3>Authorization</h3>
    <p class="auth-q">What are you allowed to do?</p>
    <p class="muted">Permissions.</p>
  </div>
</div>

<div v-click class="callout auth-note">
  Tonight: session login. Real apps usually use tokens (JWT), but the permission code stays the same.
</div>

<style>
.auth { margin-top: 18px; }
.auth-card { display: flex; flex-direction: column; gap: 6px; }
.auth-card h3 { margin: 0; font-size: 30px; }
.auth-card p { margin: 0; }
.auth-q { font-size: 28px !important; font-weight: 700 !important; color: var(--accent); }
.auth-icon { font-size: 64px; color: var(--accent-2); }
.auth-note { margin-top: 22px; font-size: 24px; }
</style>

<!--
[8:01 · 2 min] [MODE: SLIDES]

Say:

[click] "Authentication: who are you? An ID badge. That's logging in."

[click] "Authorization: what are you allowed to do? The keycard door. Your badge says who you are; the door decides whether you get in. That's permissions."

[click] "Tonight we log in with a session: the browsable API's own login page. Real apps, especially phone apps, usually send a token like a JWT instead. But the permission code you write stays exactly the same."

If behind: skip the token sentence.
-->

---
plan: 28
---

# A counter can't remember who voted

<div class="m2m">
  <ClipPlayer name="counter-to-m2m" alt="The number 3 morphs into three voter avatars; then a questions table and a users table appear with a join table sliding in between, lines connecting their rows." width="620px" />
  <div class="m2m-points">
    <p>An integer can't answer <strong>"did Sam already vote?"</strong></p>
    <p>A list of voters can.</p>
    <p class="m2m-rel">Question ↔ User is many-to-many. Django builds the join table.</p>
  </div>
</div>

<style>
.m2m { display: grid; grid-template-columns: 620px 1fr; gap: 26px; align-items: center; margin-top: 12px; }
.m2m-points p { margin: 0 0 18px; font-size: 26px; font-weight: 600; }
.m2m-points .m2m-rel { color: var(--accent-2); font-weight: 700; font-size: 24px; }
</style>

<!--
[8:03 · 2 min] [MODE: SLIDES]

Say:
- "votes is just a number. If it says 3, can it tell us whether Sam already voted? No."
- "A list of voters can. Each question has many voters, and each user votes on many questions. That's a many-to-many relationship."
- "Django builds the table in the middle for us, the join table: one row per vote."

- "Next: Part A, logins and permissions. Then Part B, one vote per person."

If behind: say the first and last lines.
-->
