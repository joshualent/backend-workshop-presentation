---
backstage: true
backstageIndex: true
plan: A
---

# Appendix

<BackstageIndex />

<!--
[backstage] [SLIDES]

- Backstage slides: the clicker and arrow keys never land here. Press `g`, type the number, press Enter.
- Leaving a backstage slide: `g` and the number of the slide you came from (the presenter view shows it).
- These numbers update themselves if slides are added.
-->

---
backstage: true
plan: A1
---

# Switching checkpoints

<div class="stack">
<div>
<div class="file-label">Save your work, switch, migrate</div>

```bash
git stash push -u -m "my work"
git switch checkpoint-3-auth
uv run manage.py migrate
```

</div>
<div>
<div class="file-label">Going back from checkpoint-4-m2m? Undo its migration first, while still on it</div>

```bash
uv run manage.py migrate questions 0001
git switch checkpoint-3-auth
```

</div>
<p class="small muted">Or start fresh on any checkpoint: stop the server, delete <code>db.sqlite3</code>, run <code>migrate</code>.</p>
</div>

<!--
[backstage] [SLIDES]

- Say: "Your stash keeps your own code. `git stash list` shows it; you don't need to apply it to carry on."
- Git switches code, not the database. Moving forward, `migrate` is all you need.
- Backward across lesson 4: reverse migration 0002 before switching branches, while the code for it still exists. Vote totals come back as zero.
- Already switched back? Switch to `checkpoint-4-m2m`, run the reversal, then switch again. Or delete `db.sqlite3` (this deletes questions and accounts; make `mod` again with `createsuperuser`).
-->

---
backstage: true
plan: A2
---

# Troubleshooting

<div class="trouble">
<div><span class="muted">That port is already in use</span><code>uv run manage.py runserver 8001</code></div>
<div><span class="muted">no such table</span><code>uv run manage.py migrate</code></div>
<div><span class="muted">uv: command not found (macOS, Linux)</span><code>curl -LsSf https://astral.sh/uv/install.sh | sh</code></div>
<div><span class="muted">uv: command not found (Windows PowerShell)</span><code>powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"</code></div>
<div><span class="muted">No module named django</span><code>uv run manage.py …, not python manage.py …</code></div>
</div>

<style>
.trouble {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: var(--fs-small);
}
.trouble > div {
  display: flex;
  flex-direction: column;
}
.trouble code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
}
</style>

<!--
[backstage] [SLIDES]

- Port in use: another runserver is still running (often in another terminal). Use 8001 and open http://127.0.0.1:8001/.
- no such table: the database is behind the code. Run `migrate`. If they wrote the model themselves, `makemigrations questions` first.
- uv not found: install it, then open a new terminal so the PATH updates.
- No module named django or rest_framework: they ran the system Python. `uv run` uses the project's environment.
- Anything else: `uv run manage.py check` names the broken file and line. Helpers can switch them to the last checkpoint.
-->

---
backstage: true
plan: A3
---

# Still: one backend, many clients

<StepVideo name="v1-one-backend-many-clients" still alt="Final frame of video V1" />

<!--
[backstage] [SLIDES]

- Final frame of video V1 (slide 6). Use it if the video won't play.
-->

---
backstage: true
plan: A4
---

# Still: life of a POST

<StepVideo name="v2-life-of-a-post" still alt="Final frame of video V2" />

<!--
[backstage] [SLIDES]

- Final frame of video V2 (slide 12): the whole journey in one picture. Use it if the video won't play.
-->

---
backstage: true
plan: A5
---

# Still: from a count to a list of voters

<StepVideo name="v3-count-to-voters" still alt="Final frame of video V3" />

<!--
[backstage] [SLIDES]

- Final frame of video V3 (slide 27). Use it if the video won't play.
-->

---
backstage: true
plan: A6
---

# Projector check

<ProjectorCheck>

<!-- code-block: projector-check -->
```python {2}
class Question(models.Model):
    text = models.CharField(max_length=300)
    votes = models.IntegerField(default=0)
```
<!-- /code-block -->

</ProjectorCheck>

<!--
[backstage] [SLIDES]

- Put this up in the room before people arrive. Walk to the back row.
- Every swatch should be distinct. The 16 px label line and the dimmed code line should still be readable.
- If the projector washes things out, turn its brightness down rather than changing the deck.
-->
