---
layout: stage
plan: P1
routeAlias: preshow
---

<div class="preshow">
  <header>
    <div class="titles">
      <ClubWordmark :height="36" />
      <h1 class="display">Get set up while you eat</h1>
    </div>
    <CountdownTimer :until="$workshop.talkStartsAt" label="We start in" size="md" />
  </header>
  <div class="body">
    <SetupCommands />
    <div class="qrs">
      <QrCode :url="$workshop.starterRepoUrl" caption="1 · Starter repo" :size="112" :show-url="false" />
      <QrCode :url="$workshop.liveBoardUrl" caption="2 · Ask a question" :size="112" :show-url="false" />
    </div>
  </div>
</div>

<style>
.preshow { height: 100%; display: flex; flex-direction: column; gap: 16px; }
.preshow header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
.preshow .titles { display: flex; flex-direction: column; gap: 10px; }
.preshow h1.display { font-size: 50px; line-height: 1; margin: 0; }
.preshow .body { display: grid; grid-template-columns: 1fr 168px; gap: 22px; align-items: start; }
.preshow .qrs { display: flex; flex-direction: column; gap: 12px; align-items: center; }
.preshow .qrs .caption { font-size: var(--fs-label); white-space: nowrap; }
</style>

<!--
[6:30 · 25 min] [MODE: SLIDES]

Say:
- Nothing to present yet. This loops on the projector while people eat and set up. Greet people at the door and point them at the screen.
- Helpers circulate. Most common blocker: `uv` not installed. The install one-liners are on the troubleshooting slide: press `g`, type `56`, Enter (`g` `1` comes back here).
- About 6:45, announce: "Ten minutes. If runserver works, scan the second QR code and post a question for the end of the night."

Ask: (one-on-one) "Does http://127.0.0.1:8000/admin/ show a Django login page? Then you're ready." (It's a login page because there is no admin user yet. That's expected.)

→ At 6:55, whatever the countdown says: press → for the title slide.

If behind: if many people are still installing at 6:55, start anyway. Helpers keep helping, and the checkpoint branches catch everyone up later.
-->
