---
plan: 29
---

<StepCard
  step="A"
  mode="Stretch · VS Code"
  title="Log in, then lock it down"
  :file="['config/urls.py', 'config/settings.py']"
  command="uv run python manage.py createsuperuser"
  highlight="router,viewset"
>
  <template #expect>
    Uncomment <code>api-auth/</code> and <code>DEFAULT_PERMISSION_CLASSES</code>
  </template>
  <div class="perm">
    <div v-click class="card perm-card">
      <div class="perm-who"><ph-user-bold /> Logged out</div>
      <div class="perm-req"><MethodBadge method="POST" /> <span class="arrow">→</span> <StatusBadge :code="403" /></div>
    </div>
    <div v-click class="card perm-card">
      <div class="perm-who"><ph-user-check-bold /> Logged in</div>
      <div class="perm-req"><MethodBadge method="POST" /> <span class="arrow">→</span> <StatusBadge :code="201" /></div>
    </div>
  </div>
</StepCard>

<style>
.perm { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.perm-card { display: flex; flex-direction: column; gap: 10px; padding: 12px 16px; }
.perm-who { display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 800; }
.perm-req { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
.perm-req .arrow { font-weight: 800; color: var(--text-muted); }
</style>

<!--
[8:05 · 1 min, then VS Code + browser until ~8:13] [MODE: SLIDES]

Say:
- "Three small changes, and two of them are already in your files, commented out."
- "createsuperuser makes an admin account. Uncommenting api-auth/ adds a Log in link to the browsable API. Uncommenting DEFAULT_PERMISSION_CLASSES says: anyone can read, only logged-in users can write."

[click] "Logged out, a POST gets 403 Forbidden."

[click] "Logged in, the same POST gets 201 Created."

→ SWITCH TO VS CODE: Part A (cheat sheet §A1–A2). In the terminal: `uv run python manage.py createsuperuser` (the password doesn't show while you type; that's normal). Uncomment the `api-auth/` line in config/urls.py and the REST_FRAMEWORK block in config/settings.py. Save.

→ SWITCH TO BROWSER: refresh /api/questions/ logged out: the POST form is gone. Run the curl from cheat sheet §A3 → 403 "Authentication credentials were not provided." Click "Log in" (top right), log in, POST a question → 201.

Optional (4th on the cut list): admin-only mark_answered (cheat sheet §A4). Show that a non-admin gets 403.

(Come back to the slides at slide 30.)

If behind: skip admin-only mark_answered and the curl; show the vanishing form instead.
-->

---
plan: 30
---

# Heads up: votes reset

Old votes don't record who cast them.

<div class="reset-row">
  <VoteReset />
  <div class="reset-points">
    <p>Swapping <code>votes</code> for <code>voters</code> starts every count at 0.</p>
    <p class="muted">A real product would write a data migration to keep them.</p>
  </div>
</div>

<style>
.reset-row { display: grid; grid-template-columns: 340px 1fr; gap: 36px; align-items: center; margin-top: 26px; }
.reset-points p { margin: 0 0 18px; font-size: 26px; font-weight: 600; }
</style>

<!--
[8:13 · 1 min] [MODE: SLIDES]

← Back from the browser: logged out → 403, logged in → 201.

Say:
- "Part B changes how votes are stored, so a heads-up first."

[click] "votes was a number. voters is a list of people. A number doesn't say who voted, so there's nothing to copy over. Every count goes back to zero."

- "On a real product you'd write a data migration to keep them. Tonight, zero is fine."

If behind: click and say the first sentence only.
-->

---
plan: 31
---

<StepCard
  step="B"
  mode="Stretch · paste, don't type"
  title="One vote per user"
  :file="['questions/models.py', 'questions/serializers.py', 'questions/views.py']"
  :command="['uv run python manage.py makemigrations', 'uv run python manage.py migrate']"
  highlight="viewset,serializer,model"
>
  <template #expect>
    Second upvote by the same user → <StatusBadge :code="400" size="sm" />
  </template>
  <div class="partb">
    <div><span class="kicker">Prove it</span> log in as a second user and upvote</div>
    <div><span class="kicker">Then</span> fix ordering: <code>?ordering=-num_votes</code></div>
  </div>
</StepCard>

<style>
.partb { display: flex; flex-direction: column; gap: 10px; font-size: 24px; font-weight: 600; }
.partb .kicker { margin-right: 10px; }
</style>

<!--
[8:14 · 1 min, then VS Code + browser until ~8:24] [MODE: SLIDES]

Say:
- "Paste this part. Three files change."
- "Model: votes becomes voters, a ManyToManyField to User, plus a vote_count property for display."
- "Serializer: shows vote_count, and has_voted: did I already vote?"
- "ViewSet: upvote adds you to voters, or returns 400 if you're already there. You must be logged in to vote."

→ SWITCH TO VS CODE: Part B (cheat sheet §B1–B3): replace the model, the serializer, and the ViewSet. Run makemigrations, then migrate.

→ SWITCH TO BROWSER: logged in, POST /api/questions/1/upvote/ → vote_count 1, has_voted true. POST again → 400 "You already voted for this question."

- Prove it: create a second user at /admin/ (Users → Add user), open a private window, log in as them at /api-auth/login/, upvote the same question → vote_count 2.
- Ordering fix (first thing to cut): ?ordering=-votes is now broken because votes is gone. The annotate + num_votes lines (already in §B3) make ?ordering=-num_votes work. Short on time: `ordering_fields = ['created_at']` instead.

(Come back to the slides at slide 32. Wrap-up starts at 8:25 no matter what.)

If behind: cut the ordering fix first. If it's past 8:15, don't start Part B: `git stash -u`, `git checkout tier-3-m2m`, `uv run python manage.py migrate`, and demo it in about three minutes.
-->
