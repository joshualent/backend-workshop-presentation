---
backstage: true
backstageIndex: true
part: Appendix
---

# Appendix

<BackstageIndex />

<!--
[backstage] [SLIDES]

- The clicker and arrow keys skip backstage slides. To open one, press `g`, type the number, and press Enter.
- To leave a backstage slide, press `g` and type the number of the slide you came from. The presenter view shows it.
- The numbers in this list update automatically when slides are added or removed.
-->

---
backstage: true
part: Appendix
---

# Switching checkpoints

<div class="stack">
<div>
<div class="file-label">Save your work, switch branches, and update the database:</div>

```bash
git stash -u
git switch checkpoint-3-auth
uv run manage.py migrate
```

</div>
<div>
<div class="file-label">To go back from checkpoint-4-m2m, undo its migration before you switch:</div>

```bash
uv run manage.py migrate questions 0001
git switch checkpoint-3-auth
```

</div>
<p class="small muted">To start fresh on any checkpoint, stop the server, delete <code>db.sqlite3</code>, and run <code>migrate</code>.</p>
</div>

<!--
[backstage] [SLIDES]

- Say: "The stash keeps your own code. `git stash list` shows it. You don't need to apply it to keep going."
- `git switch` changes the code, not the database. When you move forward, `migrate` updates the database.
- To go back past lesson 4, reverse migration 0002 before you switch branches, because the earlier branches don't have that migration file. Vote totals come back as zero.
- If someone already switched back: switch to `checkpoint-4-m2m`, run the reversal, and switch again. Or delete `db.sqlite3`. That deletes all questions and accounts, so they need to create `mod` again with `createsuperuser`.
-->

---
backstage: true
part: Appendix
---

# Troubleshooting

<div class="trouble">
<div><span class="muted">git: command not found</span><code>install Git from git-scm.com (macOS: run git --version)</code></div>
<div><span class="muted">uv: command not found (macOS, Linux)</span><code>curl -LsSf https://astral.sh/uv/install.sh | sh</code></div>
<div><span class="muted">uv: command not found (Windows PowerShell)</span><code>powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"</code></div>
<div><span class="muted">That port is already in use</span><code>uv run manage.py runserver 8001</code></div>
<div><span class="muted">no such table</span><code>uv run manage.py migrate</code></div>
<div><span class="muted">No module named django</span><code>use uv run manage.py …, not python manage.py …</code></div>
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

- Port in use: another runserver is still running, often in another terminal. Use port 8001 and open http://127.0.0.1:8001/.
- no such table: the database doesn't have the tables the code expects. Run `migrate`. If they wrote the model themselves, run `makemigrations questions` first.
- git not found: Windows needs Git for Windows from git-scm.com; the default options are fine. On macOS, `git --version` offers to install the Command Line Tools, which include Git. Open a new terminal afterwards.
- uv not found: install it, then open a new terminal so the PATH includes it.
- No module named django or rest_framework: they ran the system Python. `uv run` uses the project's environment.
- Anything else: `uv run manage.py check` names the file and line with the error. If that doesn't help, they can switch to the last checkpoint with the line on that lesson's first slide.
-->

---
backstage: true
part: Appendix
---

# Video still: one backend, many clients

<StepVideo name="v1-one-backend-many-clients" still alt="Final frame of video V1" />

<!--
[backstage] [SLIDES]

- Final frame of video V1 (slide 5). Use it if the video won't play.
-->

---
backstage: true
part: Appendix
---

# Video still: life of a POST request

<StepVideo name="v2-life-of-a-post" still alt="Final frame of video V2" />

<!--
[backstage] [SLIDES]

- Final frame of video V2 (slide 10). It shows the request and the response together. Use it if the video won't play.
-->

---
backstage: true
part: Appendix
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
- Check that you can tell every color swatch apart, and that you can read the 16 px label line and the dimmed code line.
- If the colors look faded, turn the projector's brightness down instead of changing the deck.
-->

---
backstage: true
part: Appendix
---

# Status codes in our API

<div class="codes-ref">
<StatusBadge :code="200" /><span>A read, an edit, or an action worked.</span>
<StatusBadge :code="201" /><span>A POST to <code>/api/questions/</code> created a question.</span>
<StatusBadge :code="204" /><span>A DELETE removed the question. The response has no body.</span>
<StatusBadge :code="400" /><span>The data is invalid, for example blank text.</span>
<StatusBadge :code="403" /><span>You aren't logged in, or you aren't allowed to make this request.</span>
<StatusBadge :code="404" /><span>No question has that id, or the URL doesn't exist.</span>
<StatusBadge :code="405" /><span>The URL doesn't accept that method, for example a GET on <code>/upvote/</code>.</span>
</div>

<style>
.codes-ref {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 20px;
  align-items: baseline;
  font-size: var(--fs-small);
}
.codes-ref > :nth-child(odd) {
  font-size: var(--fs-code);
  justify-self: start;
}
</style>

<!--
[backstage] [SLIDES]

- Every status code the API sends during the workshop. Use it if someone asks about a code.
- 2xx means the request worked. 4xx means a problem with the request.
- 403: logged out, the message is "Authentication credentials were not provided." Logged in without permission, it's "You do not have permission to perform this action." DRF sends 403 rather than 401 because the browsable API uses session login.
- 404 also covers `/api/questions/1/upvote/` after lesson 4, because that route no longer exists.
- 405 shows when you open an action URL in the browser, because the browser sends a GET. Press the POST button instead.
-->
