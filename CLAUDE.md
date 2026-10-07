# Workshop Presentation Repo

Slides and presenter notes for the Developer Club backend workshop: a live code-along building a Q&A board REST API with Django + Django REST Framework (Monday, October 19, 2026, 6:30–8:30 PM, Floyd Hall D-109).

**Start here:** read `docs/presentation-plan.md` in full before doing anything. It is the source of truth for the run of show, every slide, the visual system, animation rules, presenter-note format, build phases, and the reference code.

## Standing rules

- **Stack:** Slidev in `slides/`, GSAP/Vue for live animations, HyperFrames (preferred) or Motion Canvas for at most three pre-rendered clips in `animations/`.
- **Front-loaded concepts stay at ~20 minutes and ~13 slides.** Don't add intro slides; propose cuts instead.
- **Zero extra time:** every animation is click-driven (≤ 700 ms per step) or a silent ambient loop (≤ 15 s). Nothing the presenter has to wait for.
- **Dark theme tuned for an average projector:** only the tokens in `slides/styles/tokens.css`; no pure black, no thin font weights, no low-contrast greys; minimum sizes from plan section 5.
- **Offline at runtime:** no CDN assets. Fonts, media, and QR codes are local.
- **Every slide gets presenter notes** in the plan's section 8.1 format, including explicit `→ SWITCH TO …` lines for every move between slides, VS Code, the browser, and the live board.
- **Code on slides and in `notes/cheat-sheet.md` must match Appendix A of the plan exactly.**
- **Stop at each review checkpoint** in plan section 9 and wait for the presenter's sign-off.
- Use placeholders (e.g. `{{LIVE_BOARD_URL}}`) for inputs listed in plan section 10 until the presenter supplies them.

## Commands

Add the exact commands here once the projects exist (Slidev dev, build, export; clip render).
