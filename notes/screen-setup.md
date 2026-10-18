# Screen setup

## Displays

- **Extended display, not mirrored.** The projector shows whatever you're working in: the slides, VS Code, a terminal, or the browser. The laptop screen shows Slidev's presenter view (notes, next slide, timer).
- Open the deck twice in the same browser: on the laptop at `/#/presenter/1`, on the projector at `/#/1`. They stay in sync: clicks in the presenter view drive the projector window.
- Make the projector window full screen (`f` in Slidev, or the browser's full-screen key).

## Moving between windows

- Keep four windows on the projector, each full screen in its own space or behind the others: the slides, VS Code, a terminal, and the browser.
- macOS: `Cmd`+`Tab` between apps; `Ctrl`+arrow if each window is in its own full-screen space. Windows: `Alt`+`Tab`. Practise the exact order once before the talk.
- Coming back to the slides, click the presenter view on the laptop before pressing the clicker, so the keys go to Slidev.
- **Jump to a slide by number:** press `g`, type the number, press `Enter`. Numbers are the deck's (1–15), shown in the presenter view; the section of the night ("Part 2") is in its corner there.
- The clicker and arrow keys skip the backstage appendix (slides 16–22). Reach those with `g`.
- `o` shows the slide overview. Don't press `d` or `p`; nothing is bound to them on the night (the projector simulation is dev-only).

## VS Code

No slide shows the code in this version of the deck, so VS Code is where the room reads it. Set it up for the back row.

- Zoom to 18–20 pt: `Cmd`/`Ctrl` + `=` until the editor font is about 20 pt, or set `"editor.fontSize": 20` and `"terminal.integrated.fontSize": 18`.
- Use a high-contrast theme: **Dark High Contrast** or **Light High Contrast** (a light theme often reads better on a weak projector).
- Hide the file tree when you're not using it: `Cmd`/`Ctrl` + `B`.
- Turn off the minimap and breadcrumbs: fewer things competing with the code.
- Open these files as tabs, in order: `questions/models.py`, `questions/serializers.py`, `questions/views.py`, `config/urls.py`, `questions/admin.py`.

## Terminal

- Two terminals in the project folder: one running `uv run manage.py runserver`, one for commands.
- Font 18 pt or larger. Clear it (`Ctrl`+`L`) before each switch so the room sees only the new output.

## Browser tabs to pre-open

1. <http://127.0.0.1:8000/api/questions/>: the browsable API.
2. <http://127.0.0.1:8000/admin/>: the admin.
3. <https://github.com/joshualent/questions-api>: the repo (for the setup slide and for questions).
4. Optional: <http://127.0.0.1:8000/admin/auth/user/add/> for creating `sam` in lesson 3.

Zoom the browser to 150% or more.

**Don't iframe the API into the slides.** Django sends `X-Frame-Options: DENY`, so an embedded browsable API won't load. Switch to the browser tab instead; every slide that needs it says `→ SWITCH TO BROWSER`.

Public instance for the audience: `{{PUBLIC_INSTANCE_URL}}` (checkpoint: `{{CHECKPOINT}}`). If there is one, open it as tab 5 and switch to it the same way; never embed it. Set it in `slides/workshop.config.ts`, or set `publicInstance: null` there and delete this paragraph if there isn't one.

## Running the deck

From `slides/`:

```bash
pnpm install          # once, with network
pnpm build            # builds dist/
pnpm serve            # serves dist/ offline at http://localhost:3031
```

Presenter view: <http://localhost:3031/#/presenter/1>. Projector: <http://localhost:3031/#/1>.

`pnpm dev` (port 3030) works offline too, but present from the built copy: it's what `pnpm qa` tested.

## Pre-talk checklist

- [ ] `pnpm build` done after the last change; `pnpm serve` running.
- [ ] Wi-Fi off, then: deck loads, fonts look right, both videos play (slides 4 and 9), QR codes show. Wi-Fi back on.
- [ ] `pnpm qa` passed (offline check, navigation, click counts, notes).
- [ ] Presenter view on the laptop, slides full screen on the projector, synced.
- [ ] Projector check (`g` 21) from the back row: every swatch distinct, the 16 px line readable.
- [ ] Your own `questions-api`: on `main` (same as `checkpoint-0-setup`), `db.sqlite3` deleted, `uv sync --locked`, `uv run manage.py migrate`, `runserver` running.
- [ ] VS Code zoomed, high-contrast theme, file tree hidden, the five files open.
- [ ] Browser tabs open and zoomed.
- [ ] `notes/cheat-sheet.md` open somewhere only you can see (phone, printout, or the laptop).
- [ ] Clicker paired; it advances the presenter view.
- [ ] Placeholders filled in `slides/workshop.config.ts` (the public instance), or accepted as they are.
