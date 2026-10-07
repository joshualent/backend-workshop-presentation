# Presentation Build Plan: Backend Workshop (Q&A API with Django + DRF)

This is the source of truth for building the slide deck and presenter notes. Read it end to end before writing any code. Work in the phases in section 9 and stop at each review checkpoint for the presenter's sign-off.

---

## 1. The workshop you are building for

| | |
|---|---|
| Event | Backend Workshop: Build a Q&A API with Python & Django |
| Host | Developer Club (WMU) |
| When | Monday, October 19, 2026, 6:30–8:30 PM (doors 6:30, talk starts ~6:55) |
| Where | Floyd Hall D-109, campus projector (decent, not excellent) |
| Audience | CS and software development students of mixed skill. Most know some Python; many have never built a backend. |
| Format | Live code-along. The presenter alternates between slides and VS Code; attendees type along on their own laptops. |

**The starter repo attendees clone** (separate repo, already built):
- `git clone` + `uv sync` gives a Django 5.2 + DRF 3.x project.
- `config/` project, `questions` app already in `INSTALLED_APPS`, DRF installed.
- Empty stubs: `questions/models.py`, `questions/serializers.py`, `questions/views.py`.
- `config/urls.py` has the router commented out, mounted at `api/`, plus a commented `api-auth/` line.
- `settings.py` has a commented `DEFAULT_PERMISSION_CLASSES` block for the auth section.
- Checkpoint branches for catching up: `tier-1-done`, `tier-2-auth`, `tier-3-m2m`.

**What gets built live:** a Q&A board API where people submit questions, upvote them, and mark them answered.
- **v1 (everyone):** `Question` model (text, votes, answered, created_at) → `ModelSerializer` with `votes`/`answered` read-only → `ModelViewSet` + `DefaultRouter` at `/api/questions/` → custom actions `upvote` and `mark_answered` → `OrderingFilter` (`?ordering=-votes`).
- **v2 (stretch):** session login via the browsable API, `IsAuthenticatedOrReadOnly`, admin-only `mark_answered`, then `votes` (integer) becomes `voters` (many-to-many to `User`) so each user votes once.

Full reference code is in Appendix A. Code on slides must match it exactly.

**The live board:** the presenter has deployed the finished v1 app publicly (self-hosted, exposed through Pangolin at a stable URL). It runs the no-auth v1 version all night and is never redeployed during the talk. Attendees submit and upvote real questions on it during arrival. It reappears at the checkpoint pause and the closing Q&A.

---

## 2. Deck philosophy

1. **The slides serve the coding, not the other way around.** Code is the deliverable. Slides exist to set up each coding step and get out of the way.
2. **Front-loading is capped at ~20 minutes and ~13 slides.** People have just eaten and want to code. Only teach up front what the first 15 minutes of coding needs.
3. **Teach concepts just in time.** Serializers, migrations, permissions, and relationships are each introduced on a short slide right before the code that uses them.
4. **One recurring map.** The request-flow diagram (Client → Router → ViewSet → Serializer → Model → Database, JSON back to the client) is the deck's spine. It appears in the intro, comes back at each coding step with the relevant box highlighted, and closes the night.
5. **Motion that costs zero extra time.** Animation must ride on clicks the presenter already makes, or loop silently while they talk (section 6).
6. **Clean.** One idea per slide, generous whitespace, no clip art, no decorative gradients.

---

## 3. Run of show

| Clock | Block | Mode | Slides |
|---|---|---|---|
| 6:30–6:55 | Arrival, food, setup | Pre-show loop on projector, helpers circulate | P1 |
| 6:55–7:15 | Opening and concepts (~20 min) | Slides | 1–13 |
| 7:15–7:55 | Build v1 (5 steps) | Short concept slide → VS Code → browser, repeated | 14–23 |
| 7:55–8:05 | Checkpoint pause | Slides + live board | 24–28 |
| 8:05–8:25 | Build v2 (stretch, pasted code) | Short slides → VS Code | 29–31 |
| 8:25–8:30 | Wrap-up and top-voted questions | Slides + live board | 32–35 |

**Cut list if running long, in order:** curl callback (step 3) → "your turn" exercise (show instead) → v2 ordering fix → admin-only permission → all of v2 Part B (demo from `tier-3-m2m` branch in ~3 min) → v2 Part A (explain with slide only). Never cut the v1 build or the closing Q&A. Time checkpoints: router not working by 7:40 → cut ordering; pause not started by 8:05 → skip Part B; wrap-up starts at 8:25 no matter what.

---

## 4. Stack and repo structure

- **Slides:** [Slidev](https://sli.dev). Markdown slides, Vue components, built-in presenter view, click steps, Shiki code highlighting with Magic Move, slide imports via `src:` frontmatter, PDF export. Read Slidev's "Work with AI" guide (sli.dev/guide/work-with-ai) before starting.
- **Live animations:** Vue components using GSAP (or Slidev's built-in `v-click`/`v-motion` where that's enough).
- **Pre-rendered clips (max 3):** HyperFrames is preferred. It authors videos as HTML + CSS + GSAP, renders deterministic MP4 through headless Chrome + FFmpeg, and ships Claude Code skills (`npx hyperframes init`). The same GSAP knowledge transfers between live components and clips. Motion Canvas is an acceptable alternative for the code-to-table clip if HyperFrames struggles with it. Don't add Remotion unless both fail.
- **Video over GIF.** Embed MP4 (H.264) + WebM loops, not GIFs: sharper and far smaller. Only export GIFs for the README or social posts.
- **Fully offline at runtime.** No CDN fonts, scripts, or images during the talk. Venue wifi is not guaranteed. Bundle fonts and every asset locally.

```
workshop-presentation/
├── CLAUDE.md
├── README.md                     # how to run, present, export
├── docs/
│   ├── presentation-plan.md      # this file
│   └── workshop-run-of-show.md   # presenter's original plan (if added)
├── slides/                       # Slidev project
│   ├── slides.md                 # headmatter + section imports only
│   ├── pages/                    # one file per section (00-preshow.md … 06-appendix.md)
│   ├── components/               # reusable Vue components (section 7.1)
│   ├── styles/                   # tokens.css + global styles
│   ├── public/media/             # rendered clips, posters, screenshots, QR codes
│   └── package.json
├── animations/                   # HyperFrames (or Motion Canvas) sources for the clips
│   └── <clip-name>/
└── notes/
    ├── presenter-flow.md         # slide ↔ editor interleave, minute by minute
    ├── cheat-sheet.md            # every code snippet in paste order
    └── screen-setup.md           # displays, windows, tabs, zoom, shortcuts
```

---

## 5. Visual system: dark theme for an average projector

Projectors lose contrast and crush dark tones. A dark theme only works if the background is not pure black, text is bright and heavy enough, and accents are saturated but not neon. Put all values as CSS custom properties in `styles/tokens.css` and use only tokens in components.

| Token | Value | Notes |
|---|---|---|
| `--bg` | `#15171c` | Near-black charcoal, never `#000` |
| `--surface` | `#20242b` | Cards, code blocks, diagram boxes |
| `--border` | `#3a404a` | Box outlines, dividers |
| `--text` | `#f4f1ea` | Warm off-white, a nod to the club's cream |
| `--text-muted` | `#c4c8cf` | Dimmest allowed text color. No `#888`-style greys. |
| `--accent` | `#4fd1b5` | Teal, brightened from the club flyers |
| `--accent-2` | `#f5c451` | Amber for secondary emphasis |
| `--get` / `--post` / `--patch` / `--delete` | `#6cb6ff` / `#5fd68a` / `#f5c451` / `#ff7a7a` | HTTP method badges, used consistently everywhere |
| `--ok` / `--error` | `#5fd68a` / `#ff7a7a` | 2xx vs 4xx/5xx status badges |

Rules:
- **Type:** a clean sans (e.g. Inter) for text, a mono (e.g. JetBrains Mono) for code, both self-hosted. Body weight ≥ 500; thin weights vanish on projectors. A condensed bold display face (e.g. Oswald) may appear on the title and section-divider slides only, echoing the club flyers.
- **Minimum sizes on Slidev's default 980 px canvas (16:9):** titles 40 px, body 24 px, code 18 px, diagram labels 16 px. That limits code blocks to roughly 14 lines and slides to about 6 bullets or 30 words.
- **Strokes ≥ 2 px** and large arrowheads on all diagrams. No glows, no text over images, no overlay opacity below 0.2.
- **Code theme:** a high-contrast dark Shiki theme, checked against `--bg`/`--surface`.
- **Never encode meaning by color alone.** Every colored badge also has a text label (GET, 201, 403).
- **Contrast:** body text ≥ 7:1 against its background; diagram labels ≥ 4.5:1.
- **Projector simulation:** add a dev-only toggle (a keyboard shortcut or URL param) that applies `filter: contrast(0.75) brightness(1.15)` to the whole deck. Every slide must stay readable with it on. Add a hidden "projector check" slide with swatches of every token and the smallest text size, for testing in the room.
- **Branding:** Developer Club wordmark on the title, the pre-show loop, and the closing slide only. Ask the presenter for the logo file; don't recreate it.

---

## 6. Animation and media rules

**The zero-extra-time rule.** Every animation is one of two kinds:
1. **Click-driven.** It advances on clicks the presenter would make anyway (`v-click`, `$clicks`, Magic Move steps). Each step finishes in ≤ 700 ms, so the presenter never waits for it.
2. **Ambient loop.** Autoplays muted, loops seamlessly, ≤ 15 s per cycle, and makes sense from any frame. It runs while the presenter talks. Nothing ever requires "let's watch this play".

**More rules:**
- One animation idea per slide. Ease-out curves, 300–700 ms. No bounces or spins, except one brief celebration on slide 24.
- Every animated slide has a meaningful final state, which is also what PDF export shows.
- Clips: 1920×1080, 30 fps, ≤ 15 s, seamless loop, ≤ 5 MB each, MP4 + WebM, with a PNG poster frame. Embed muted, autoplay, loop, `playsinline`. Clips are always rendered from source in `animations/`; never commit hand-edited binaries without their source.
- Live iframes (the deployed board): each iframe slide is followed by a hidden fallback slide with a recent screenshot, in case the network fails.
- Respect the method and status colors from section 5 inside every animation and clip.

---

## 7. Slide-by-slide specification

Asset key: **Static**, **Click** (live, click-driven component), **Loop** (live ambient loop), **Clip** (pre-rendered video), **Iframe** (live board).

### 7.1 Reusable components (build these first)

| Component | Purpose |
|---|---|
| `<RequestFlowMap :highlight :stepped :labels>` | The spine diagram. Can highlight one box, animate a packet along the path step by step on clicks, and swap labels from concepts to code names (for the recap). |
| `<Packet>` | A small labeled envelope (e.g. `GET /questions/`, `{ "text": … }`) that travels along a path. Used by several slides. |
| `<MethodBadge>` / `<StatusBadge>` | Consistent HTTP method and status code chips. |
| `<HttpMessage>` | Renders a request or response with parts (method, URL, headers, body, status) that highlight per click. |
| `<StepCard step title file command>` | The "Now in VS Code" card for each coding step. |
| `<CountdownTimer :seconds>` | Starts on click; used for the pre-show countdown and the "your turn" exercise. |
| `<QrCode :url>` | Generated locally at build time, never fetched. |

### 7.2 Pre-show loop (6:30–6:55)

| # | Slide | Content | Visual | Asset |
|---|---|---|---|---|
| P1 | Welcome + setup | Event title; QR codes for the starter repo and the live board; the four setup commands (`git clone …`, `uv sync`, `uv run python manage.py migrate`, `uv run python manage.py runserver`); "Done? Open http://127.0.0.1:8000/admin/, then scan the second QR code and ask a question." Countdown to 6:55. | Very slow ambient background of faint request dots drifting along lines between nodes. It must not distract from reading the commands. | Loop + Static |

### 7.3 Opening and concepts (6:55–7:15)

| # | Slide | Content | Visual | Asset |
|---|---|---|---|---|
| 1 | Title | Workshop title, club wordmark, date and room | Same ambient background as P1 | Loop |
| 2 | "Here's what you'll build" | The live board, sorted by votes, with the room's own questions | Iframe of the deployed board (hidden screenshot fallback after it) | Iframe |
| 3 | How tonight works | Show of hands (Python? Django? called an API?); code along; checkpoint branches; the stuck signal | Three icons reveal on click | Click |
| 4 | What is a backend? | Client sends a request, the server does work, a response comes back | `<Packet>` travels client → server on click, server pulses, a JSON response travels back | Click |
| 5 | The restaurant | Dining room = frontend, order ticket = API, kitchen = backend | Simple line illustration; a ticket slides across on click, then labels map each part | Click |
| 6 | What the backend owns | Store data · enforce rules · security. Callout: "Never trust the client." | Three cards reveal; the callout appears last (it pays off later) | Click |
| 7 | Server-rendered vs. API | Left: server builds full HTML for one browser. Right: server sends small JSON packets that fan out to a web app, a phone, a terminal, and another service. | **Showpiece clip 1.** Split screen: on the left, a heavy "page" crosses to one browser, which flashes and reloads; on the right, light JSON packets fan out to four different clients simultaneously. Seamless ~12 s loop. | Clip |
| 8 | Why an API? | One backend, many clients · separation of concerns · test and scale each side independently. Caveat card: server-rendered apps are still a great choice for many projects. | Three benefits reveal; caveat card last | Click |
| 9 | Anatomy of HTTP | A request is method + URL + headers + body; a response is status + body | `<HttpMessage>` builds part by part, then the response appears beneath it | Click |
| 10 | Methods and status codes | GET/POST/PUT-PATCH/DELETE as used tonight; 200/201, 400, 403, 404, 500 with "when you'll see it" | Badge rows; keep compact, no animation needed | Static |
| 11 | REST in one slide | Nouns in URLs, verbs in methods; `/questions/` vs `/questions/5/`; preview of `/questions/5/upvote/` | Shiki Magic Move morphs the URL through the three forms, with method badges beside each | Click |
| 12 | The map | Router → ViewSet → Serializer → Model → DB, JSON back; build order runs right to left | `<RequestFlowMap stepped>`: a packet walks box by box on clicks, each box labeled with its file; the JSON response returns along the bottom | Click |
| 13 | Tour of the starter repo | File tree with `models.py`, `serializers.py`, `views.py`, `config/urls.py` highlighted; settings already wired | Static tree with the four files in accent | Static |

### 7.4 Build v1 interludes (7:15–7:55)

Each step follows the same pattern: a concept slide (≤ 1 minute) → a `<StepCard>` that names the step, the file, and the command → switch to VS Code. The step card stays useful as a reference if anyone glances back at the slides.

| # | Slide | Content | Visual | Asset |
|---|---|---|---|---|
| 14 | Step 1 concept: the ORM | A class is a table, an attribute is a column, an object is a row. Migrations are version control for the database. | **Showpiece clip 2.** The `Question` class code morphs into a table: each field slides into a column header, then three example objects drop in as rows. Small coda: migration files stack like commits. (Fallback if the clip doesn't come together: Magic Move code → table on clicks.) | Clip |
| 15 | Step card 1 | `models.py` · `makemigrations` · `migrate` | `<RequestFlowMap highlight="model">` in miniature | Static |
| 16 | Step 2 concept: the serializer | Translator (JSON ↔ Python) and bouncer (validation) | Click 1: JSON packet passes through and becomes a Python object. Click 2: a packet carrying `"votes": 9999` passes but the field is stripped. Click 3: an empty `"text"` bounces back with a red 400. | Click |
| 17 | Step card 2 | `serializers.py`; the 9,999-votes question to ask the room | Map with Serializer highlighted | Static |
| 18 | Step 3 concept: ViewSet + router | One `ModelViewSet` gives five endpoints; the router writes their URLs | One ViewSet box splits into five method+URL rows on click | Click |
| 19 | Step card 3 + tests | `views.py`, uncomment router; tests: POST → 201, empty POST → 400, `/999/` → 404 | Status badges tick on per click as the presenter runs each test | Click |
| 20 | Step 4 concept: custom actions | Not everything is CRUD. The server decides how votes change. | Click 1: `PATCH {"votes": 9999}` gets rejected. Click 2: `POST /questions/5/upvote/` succeeds and the count ticks from 3 to 4. | Click |
| 21 | Your turn | "Write `mark_answered` yourself." Hint revealed on click. | `<CountdownTimer :seconds="120">` | Click |
| 22 | Step 5 concept: ordering | Query parameters sort a collection instead of creating new URLs | Question cards visibly reorder (FLIP animation) when `?ordering=-votes` is "typed" into a URL bar on click | Click |
| 23 | Step card 5 + commit | `filter_backends`, `ordering_fields`; checkpoint `tier-1-done` | Static | Static |

### 7.5 Checkpoint pause (7:55–8:05)

| # | Slide | Content | Visual | Asset |
|---|---|---|---|---|
| 24 | You built a REST API | Celebration; `git checkout tier-1-done` shown for anyone behind | Every box on the map lights up with a check; one brief celebratory burst (≤ 1.5 s) | Click |
| 25 | Vote now | "Upvote what you want answered" | Live board iframe (+ hidden fallback) | Iframe |
| 26 | What's wrong with our app? | Question first. Reveals: one person can upvote forever · anyone can mark answered · anyone can delete. | Ambient loop of a vote counter climbing endlessly from a single user's clicks | Loop + Click |
| 27 | Authentication vs. authorization | "Who are you?" vs. "What are you allowed to do?" Session login tonight; apps usually use tokens (JWT), but the permission code stays the same. | ID badge on the left, keycard door on the right, revealed on clicks | Click |
| 28 | A counter can't remember | An integer can't answer "did Sam already vote?" A list of voters can. Question ↔ User is many-to-many, and Django builds the join table. | **Showpiece clip 3.** The number "3" morphs into three voter avatars; then two tables appear (questions, users) and a join table slides in between them with lines connecting rows. | Clip |

### 7.6 Build v2 (8:05–8:25)

| # | Slide | Content | Visual | Asset |
|---|---|---|---|---|
| 29 | Part A step card: login + permissions | `createsuperuser`; uncomment `api-auth/`; uncomment `DEFAULT_PERMISSION_CLASSES`; optional admin-only `mark_answered` | Side by side: logged out → POST → 403, logged in → POST → 201, revealed on clicks | Click |
| 30 | Heads up: votes reset | Old votes don't record who cast them, so counts reset. A real product would write a data migration. | A counter drops to 0 on click | Click |
| 31 | Part B step card | Model, serializer, and upvote changes; "prove it" with a second user; ordering fix (first to cut) | Static, map with Model + Serializer + ViewSet highlighted | Static |

### 7.7 Wrap-up (8:25–8:30)

| # | Slide | Content | Visual | Asset |
|---|---|---|---|---|
| 32 | What you built | The map again, now labeled with the actual code (`Question`, `QuestionSerializer`, `QuestionViewSet`, `DefaultRouter`) | Labels morph from concept names to code names on one click | Click |
| 33 | Where to go next | Token auth (JWT) · PostgreSQL · tests with `APITestCase` · pagination · deploying · a frontend that calls your API · the official DRF tutorial | Static, photo-friendly, with a QR code to a resources list | Static |
| 34 | Your questions | Top-voted questions answered live | Live board iframe (+ hidden fallback) | Iframe |
| 35 | Thanks | Next Developer Club event; starter repo QR (with checkpoint branches) | Same ambient background as the title | Loop |

### 7.8 Appendix (hidden slides)

Use Slidev's per-slide `hide: true` so these never appear in normal navigation:
- Screenshot fallbacks for every iframe slide.
- Poster-frame stills of the three clips.
- Full reference code for v1, v2 Part A, and v2 Part B.
- Troubleshooting commands (port in use, "no such table", `uv` not found).
- Projector check slide (section 5).

---

## 8. Presenter notes requirements

Notes are a deliverable, not an afterthought. The presenter will run the night from Slidev's presenter view, so the notes must tell them exactly what to do, when to switch screens, and what to cut.

### 8.1 Per-slide notes (Slidev comment block at the end of every slide)

Every slide, including hidden ones, gets notes in this order:

```
[7:02 · 2 min] [MODE: SLIDES]
Say:
- 2–4 short talking points, not a script
[click] what the first click reveals, and the line to say with it
[click] what the second click reveals
Ask: audience prompt, if any
→ SWITCH TO VS CODE: Step 1, models.py (come back at slide 16)
If behind: what to skip on this slide
```

- `MODE` is one of `SLIDES`, `VS CODE`, `BROWSER`, `LIVE BOARD`.
- Use Slidev's `[click]` markers so the notes highlight in sync with each click.
- Every screen switch is an explicit arrow line: `→ SWITCH TO …` when leaving the slides, and the first line of the next slide's notes says what should already be done when returning (e.g. "Back from VS Code: everyone should have run `migrate`").
- Step cards include the exact commands and the expected visible result, so the presenter can check the room before moving on.

### 8.2 `notes/presenter-flow.md`

One master table for the whole night, minute by minute, so the interleaving of slides and coding is visible at a glance:

| Clock | Slide(s) | Mode | What happens | Transition cue | Cut if behind |
|---|---|---|---|---|---|

Include every switch between slides, VS Code, the browsable API, and the live board. Mark the time checkpoints from section 3 as their own rows.

### 8.3 `notes/cheat-sheet.md`

Every code snippet the presenter will type or paste, in exact order, grouped by step, matching Appendix A character for character. Each snippet notes its file and where it goes in that file.

### 8.4 `notes/screen-setup.md`

- Extended display: projector shows slides or VS Code; the laptop shows Slidev's presenter view.
- How to move between the slide window and VS Code quickly, and how to jump to a slide number in Slidev.
- VS Code: font zoom 18–20 pt, a high-contrast theme, file tree hidden when not needed.
- Browser tabs to pre-open: local `/api/questions/`, the deployed board, the deployed board's `/admin/` (to remove spam), and the starter repo.
- Pre-talk checklist: deck running from a local build, wifi off test passed, clips playing, iframes loading.

---

## 9. Build phases and review checkpoints

1. **Scaffold and look.** Set up Slidev in `slides/`, `tokens.css`, self-hosted fonts, the projector-simulation toggle, and the projector check slide. Build the title slide in 2–3 visual directions within the dark theme. **Stop for the presenter to pick one.**
2. **Components and skeleton.** Build the section 7.1 components. Create every slide from section 7 with final text, static versions of every visual, and full presenter notes. **Stop for review of content and notes.**
3. **Flow docs.** Write `presenter-flow.md`, `cheat-sheet.md`, and `screen-setup.md`. Verify the cheat sheet matches Appendix A exactly.
4. **Live animations.** Upgrade the Click and Loop slides one section at a time, re-checking each against the section 6 rules.
5. **Showpiece clips.** Build the three clips in `animations/` (HyperFrames preferred), render MP4 + WebM + poster, and embed them. **Stop for review of the clips.**
6. **QA.**
   - Click through the entire deck in presenter mode, checking every click step and note.
   - Estimate spoken time per section against section 3 and flag anything over budget.
   - `slidev build` succeeds; the built deck works with networking off (except the live-board iframes, which fall back).
   - `slidev export` produces a readable PDF backup with final animation states.
   - Every slide passes with the projector-simulation toggle on.
   - Render a few slides at 1280×720 and view them at 50% size to judge back-row readability.

**Definition of done:** all 36 slides (P1 + 1–35) plus the appendix exist; every slide has notes in the 8.1 format; the three flow docs exist; three clips render from source; the deck runs offline; the PDF export exists; the README explains how to run, present, and export.

---

## 10. Inputs to ask the presenter for

Ask for these when you reach the phase that needs them. Use clearly marked placeholders until then.
- Live board URL (stable Pangolin URL) and its `/admin/` URL
- Starter repo URL
- Developer Club logo/wordmark files
- Next club event details for the closing slide
- Any resources link for the "where next" QR code

---

## Appendix A: Reference code

Slides, notes, and the cheat sheet must match this exactly.

### A.1 v1

```python
# questions/models.py
from django.db import models

class Question(models.Model):
    text = models.CharField(max_length=300)
    votes = models.IntegerField(default=0)
    answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
```

```python
# questions/serializers.py
from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['votes', 'answered']
```

```python
# questions/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from .models import Question
from .serializers import QuestionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['votes', 'created_at']

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)

    @action(detail=True, methods=['post'])
    def mark_answered(self, request, pk=None):
        question = self.get_object()
        question.answered = True
        question.save()
        return Response(self.get_serializer(question).data)
```

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from questions.views import QuestionViewSet

router = DefaultRouter()
router.register('questions', QuestionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
```

### A.2 v2 Part A: login and permissions

```python
# config/urls.py: add to urlpatterns
    path('api-auth/', include('rest_framework.urls')),
```

```python
# config/settings.py: uncomment
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}
```

```python
# questions/views.py: optional, admin-only mark_answered
from rest_framework.permissions import IsAdminUser

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_answered(self, request, pk=None):
        ...
```

### A.3 v2 Part B: one vote per user

```python
# questions/models.py
from django.contrib.auth.models import User
from django.db import models

class Question(models.Model):
    text = models.CharField(max_length=300)
    voters = models.ManyToManyField(User, related_name='voted_questions', blank=True)
    answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def vote_count(self):
        return self.voters.count()

    def __str__(self):
        return self.text
```

```python
# questions/serializers.py
class QuestionSerializer(serializers.ModelSerializer):
    vote_count = serializers.ReadOnlyField()
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'vote_count', 'has_voted', 'answered', 'created_at']
        read_only_fields = ['answered']

    def get_has_voted(self, obj):
        request = self.context.get('request')
        return bool(
            request
            and request.user.is_authenticated
            and obj.voters.filter(pk=request.user.pk).exists()
        )
```

```python
# questions/views.py
from django.db.models import Count
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.annotate(num_votes=Count('voters'))
    serializer_class = QuestionSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['num_votes', 'created_at']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None):
        question = self.get_object()
        if question.voters.filter(pk=request.user.pk).exists():
            return Response(
                {'detail': 'You already voted for this question.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        question.voters.add(request.user)
        return Response(self.get_serializer(question).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_answered(self, request, pk=None):
        question = self.get_object()
        question.answered = True
        question.save()
        return Response(self.get_serializer(question).data)
```

Teaching notes for Part B:
- Swapping `votes` for `voters` resets counts. Say so out loud.
- `?ordering=-votes` breaks once the field is gone; the `annotate` + `num_votes` change fixes it. If short on time, set `ordering_fields = ['created_at']` instead.
- `vote_count` is a model property for display; `num_votes` exists only so the list can be ordered.
