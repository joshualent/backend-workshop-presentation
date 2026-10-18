---
layout: default
part: Setup
---

# Set up while you wait

<div class="setup">
<ol class="steps">
<li>
<p>Install Git, uv, and VS Code. uv installs Python.</p>
<p class="links">git-scm.com · docs.astral.sh/uv · code.visualstudio.com</p>
</li>
<li>
<p>Clone the repo in a terminal:</p>

```bash
git clone https://github.com/joshualent/questions-api.git
```

</li>
<li>
<p>Open the <code>questions-api</code> folder in VS Code. In VS Code's terminal, run:</p>

```bash
uv sync --locked
uv run manage.py migrate
uv run manage.py runserver
```

</li>
<li><p>Open <code>http://127.0.0.1:8000/admin/</code>. You should see the Django login page.</p></li>
</ol>
<QrCode :url="$workshop.repoUrl" :size="150" />
</div>

<style>
.setup {
  display: grid;
  grid-template-columns: 1fr 160px;
  gap: 24px;
  align-items: start;
}
.setup .steps {
  list-style: decimal;
  gap: 12px;
}
.setup .steps li {
  font-size: var(--fs-small);
  padding-left: 6px;
}
.setup .steps li > * + * {
  margin-top: 6px;
}
.setup .links {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  color: var(--text-2);
}
</style>

<!--
[6:30 · 30 min] [SLIDES]

- Leave this up while people arrive, eat, and set up. Walk the room and go to raised hands.
- Say it at 6:40 and again at 6:50: "Install the three tools, then follow the steps on screen until you see the Django login page." If you're stuck, ask the person next to you or put your hand up.
- The QR code opens the repo. Its README has the same steps.
- Expected result in the browser: the Django administration login page at http://127.0.0.1:8000/admin/. Nobody has an account yet; that's fine.
- You don't need to install Python. `uv sync` downloads Python 3.14 if it's missing.
- Step 3 opens the folder before `runserver` on purpose: opening a folder in VS Code restarts its terminals, which would stop the server.
- Before 7:00: your own project is on `main` with a fresh `db.sqlite3`, `runserver` is running, and the browser tabs from notes/screen-setup.md are open.

Installing the tools:

- Git on Windows: Git for Windows from git-scm.com, with the default options. On macOS, running `git --version` offers to install it. On Linux, use the package manager.
- uv: the install command for each system is on uv's page and on the Troubleshooting slide (`g` 22). After installing, open a new terminal so it can find `uv`.
- VS Code: Terminal → New Terminal (or Ctrl+backtick) opens a terminal in the project folder.

Common snags (details on the Troubleshooting slide, `g` 22):

- `uv: command not found` → open a new terminal. If it's still missing, install uv again.
- "That port is already in use" → `uv run manage.py runserver 8001`.
- `no such table` → they skipped `uv run manage.py migrate`.

If behind: start at 7:00 anyway. The first 17 minutes are slides, so people can finish installing while you talk.
-->
