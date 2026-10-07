# Screen setup

## Displays

- **Extended display, not mirrored.** The projector shows either the slides or VS Code / the browser. The laptop screen shows Slidev's presenter view (current slide, next slide, notes with the current click highlighted, timer).
- Run the deck from the **local build**, not the dev server (see the README): `pnpm --dir slides build`, then `pnpm --dir slides serve`. It needs no network.
- Open two browser windows on the same browser profile (they sync through the browser, no network needed):
  - **Projector window:** <http://localhost:3031/#/1>, moved to the projector, fullscreen with `f`.
  - **Laptop window:** <http://localhost:3031/#/presenter/1>, the presenter view. Drive the talk from here: clicks and keys in this window move the projector window too.

## Moving between slides and VS Code

- Put VS Code and the browser (local API tabs) on the **projector** display, behind the slide window, all maximized.
- Switch windows with `Alt+Tab` (Windows/Linux) or `Cmd+Tab` (macOS). One press goes back to whatever was last on screen, which is almost always the right move.
- Coming back: switch to the slide window, then the notes for the next slide start with "← Back from …", which tells you what the room should have working before you move on.
- **Jump to a slide:** `g`, type the Slidev number, `Enter`. Slidev number = plan number + 1 (plan slide 16 is `g` `17`). Presenter view shows the plan number on a yellow tag.
- **Overview:** `o` (arrow keys + Enter to pick). **Fullscreen:** `f`.

## Keys that matter tonight

| Key | Does |
|---|---|
| `→` `Space` `PageDown` / clicker forward | Next click, then next slide. **Skips backstage slides.** |
| `←` `PageUp` / clicker back | Previous click / slide (also skips backstage) |
| `b` | On a live-board slide (2, 25, 34): jump to its screenshot fallback. Press again to go back to the live slide. |
| `g` + number | Go to any slide, including backstage (see the table below) |
| `o` | Slide overview |
| `?projector` in the URL | Projector simulation (contrast 0.75, brightness 1.15). In dev, `p` toggles it. |

Clicker note: many clickers have a "blank screen" button that sends `b` or `.`. On a live-board slide, `b` jumps to the screenshot; press it again to return.

## Backstage slides (Slidev numbers)

| # | Slide |
|---|---|
| 37 | Backstage index (lists all of these) |
| 38 / 39 / 40 | Screenshot fallbacks for slides 2 / 25 / 34 |
| 41 / 42 / 43 | Clip stills for slides 7 / 14 / 28 |
| 44–48 | Reference code v1 (models, serializers, views ×2, urls) |
| 49 | Reference code v2 Part A |
| 50–55 | Reference code v2 Part B (models, serializers ×2, views ×3) |
| 56 | Troubleshooting: setup (`uv` not found, port in use) |
| 57 | Troubleshooting: database (no such table, no such column, no changes detected) |
| 58 | Projector check |
| 59 / 60 | Title directions B and C |

## VS Code

- **Font zoom 18–20 pt** for the editor and terminal. In `settings.json` for the workshop profile:

  ```json
  {
    "editor.fontSize": 20,
    "terminal.integrated.fontSize": 18,
    "editor.lineHeight": 1.5,
    "editor.minimap.enabled": false,
    "workbench.colorTheme": "Default High Contrast",
    "editor.renderWhitespace": "none",
    "breadcrumbs.enabled": false
  }
  ```

  ("GitHub Dark High Contrast" also works if installed.) Use a separate VS Code profile so this doesn't touch your daily setup.
- **Hide the file tree** when typing (`Ctrl+B` / `Cmd+B`); show it only when opening a file. Open files with `Ctrl+P` / `Cmd+P` and type the name.
- **Two terminal tabs**: tab 1 runs `uv run python manage.py runserver` all night; tab 2 for `makemigrations`, `migrate`, `createsuperuser`, `curl`, `git`.
- Keep `notes/cheat-sheet.md` open on the **laptop** screen (not the projector) for pasting in v2.
- Close notifications, Slack, email. Turn on Do Not Disturb.

## Browser tabs to pre-open (projector display)

1. Local API: <http://127.0.0.1:8000/api/questions/>
2. The deployed board: `{{LIVE_BOARD_URL}}`
3. The deployed board's admin, logged in, to delete spam: `{{LIVE_BOARD_ADMIN_URL}}`
4. The starter repo: <https://github.com/joshualent/questions-api>

Zoom the browser to 150% so the browsable API is readable from the back.

## The deployed board in an iframe

Slides 2, 25, and 34 frame the deployed board. Django refuses to be framed by default (`XFrameOptionsMiddleware` sends `X-Frame-Options: DENY`), so on the **deployed** instance only:

- remove `"django.middleware.clickjacking.XFrameOptionsMiddleware"` from `MIDDLEWARE`, or
- send `Content-Security-Policy: frame-ancestors 'self' http://localhost:3031` (via Pangolin or a middleware) instead.

Check it the day before: open slide 2 in the built deck. A green **LIVE** badge with the board inside means it works; a yellow **SCREENSHOT** badge means the probe failed (network) and the slide fell back by itself. A blank frame with a green badge means the board refuses framing: fix the header or use `b`.

Refresh the fallback screenshot on the afternoon of the talk, once the room's questions start coming in: `pnpm --dir slides capture:board` (saves `slides/public/media/board/board-fallback.png`), then rebuild.

## Pre-talk checklist

**The day before**

- [ ] `workshop.config.ts` has the live board URL, admin URL, logo, next event, and resources URL. No `{{…}}` placeholders left on any slide (`grep -rn "{{" slides/workshop.config.ts`).
- [ ] The starter repo (and its `tier-1-done`, `tier-2-auth`, `tier-3-m2m` branches) is **public**.
- [ ] `pnpm --dir slides check:code` passes.
- [ ] `pnpm --dir slides build` succeeds; `pnpm --dir slides export` produced the PDF backup (copy it to a USB stick).

**At the venue (6:00)**

- [ ] Deck running from the local build (`pnpm --dir slides serve`), presenter view on the laptop, slide window fullscreen on the projector.
- [ ] **Wifi-off test passed:** turn wifi off, click through slides 1–13 and 24–35. Everything renders; slides 2, 25, 34 switch to the screenshot by themselves. Turn wifi back on.
- [ ] Clips play on slides 7, 14, 28 (silent, looping).
- [ ] Live board iframes load on slides 2, 25, 34 (green LIVE badge).
- [ ] Projector check (`g` `58`): every swatch distinct, 16 px line readable from the back row.
- [ ] VS Code: workshop profile, font 20, file tree hidden, runserver running in terminal tab 1, a fresh clone of the starter repo on `main`.
- [ ] Browser tabs 1–4 open and zoomed.
- [ ] Laptop on power, sleep disabled (the deck also holds a wake lock), notifications off.
- [ ] `g` `1` → P1 looping by 6:30.
