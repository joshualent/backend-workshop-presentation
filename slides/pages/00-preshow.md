---
layout: default
plan: 0
---

# Build a Q&A API with Python & Django

<div class="setup">
<div class="stack">

<p>Get set up while we wait. In a terminal:</p>

```bash
git clone https://github.com/joshualent/questions-api.git
cd questions-api
uv sync --locked
uv run manage.py migrate
uv run manage.py runserver
```

<p>Done? Open <code>http://127.0.0.1:8000/admin/</code>. You should see a login page.</p>

<p class="small muted">No Python 3.14? <code>uv sync</code> installs it for you.</p>

</div>
<QrCode :url="$workshop.repoUrl" :size="176" />
</div>

<style>
.setup {
  display: grid;
  grid-template-columns: 1fr 190px;
  gap: 28px;
  align-items: start;
}
</style>

<!--
[6:30 · 25 min] [SLIDES]

- Leave this up while people arrive, eat, and set up. Helpers walk the room.
- Say it once at 6:40 and again at 6:50: "Clone the repo, run the commands on screen, and open the admin page."
- Expected result in the browser: the Django administration login page at http://127.0.0.1:8000/admin/. No account yet; that's fine.
- Before 6:55: your own project is on main with a fresh db.sqlite3, runserver is running, and the browser tabs from notes/screen-setup.md are open.

Common snags (details on the troubleshooting slide, slide 49):

- `uv: command not found` → install uv (docs.astral.sh/uv), open a new terminal.
- "That port is already in use" → `uv run manage.py runserver 8001`.
- `no such table` → they skipped `uv run manage.py migrate`.

Ask: "Hands up if you see the login page." Aim for most of the room by 6:55.

If behind: start at 6:55 anyway. Helpers keep going with anyone still installing; the first 20 minutes are slides.
-->
