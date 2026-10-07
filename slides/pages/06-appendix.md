---
backstage: true
plan: A0
routeAlias: backstage
backstageTitle: Backstage index
---

<div class="kicker">Backstage · press g and type a number</div>

# Backstage

<BackstageIndex class="mt-2" />

<!--
[any time · 0 min] [MODE: SLIDES]

Say:
- Nothing. This slide and everything after it are backstage: Space, arrows, and the clicker skip them.

Reach any of them with `g` + the number shown here. Live-board slides also jump to their fallback with `b`.

→ To get back to the show: `g` + the slide number you left (the plan number is on the yellow tag in presenter view; Slidev number = plan number + 1).
-->

---
backstage: true
plan: A1
routeAlias: board-preview-fallback
fallbackFor: board-preview
backstageTitle: "Fallback: Here's what you'll build (slide 2)"
---

# Here's what you'll build

The live board: your questions, sorted by votes.

<LiveBoard screenshot :height="400" />

<!--
[6:56 · 1.5 min] [MODE: SLIDES]

Fallback for plan slide 2 (the live board didn't load). Same talk track as slide 2:

Say:
- "This is the finished app. Normally it's live; tonight's wifi had other plans. These are questions from earlier."
- "By 7:55 you'll have built this API yourself."

→ Press → to continue with slide 3 (the clicker skips back into the show), or `b` to retry the live slide.
-->

---
backstage: true
plan: A2
routeAlias: vote-now-fallback
fallbackFor: vote-now
backstageTitle: "Fallback: Vote now (slide 25)"
---

# Vote now

Upvote what you want answered at the end.

<div class="vote">
  <LiveBoard screenshot :height="390" />
  <QrCode :url="$workshop.liveBoardUrl" caption="Scan to vote" :size="150" />
</div>

<style>
.vote { display: grid; grid-template-columns: 1fr 170px; gap: 24px; align-items: start; }
</style>

<!--
[7:56 · 3 min] [MODE: SLIDES]

Fallback for plan slide 25. People can still vote on their phones if their own data works; the QR code is local.

Say:
- "Scan and upvote what you want answered at 8:25. The projector is offline, your phone probably isn't."
- Helpers: catch people up with tier-1-done.

→ Press → to continue with slide 26, or `b` to retry the live slide.
-->

---
backstage: true
plan: A3
routeAlias: your-questions-fallback
fallbackFor: your-questions
backstageTitle: "Fallback: Your questions (slide 34)"
---

# Your questions

<LiveBoard screenshot :height="440" />

<!--
[8:27 · 2.5 min] [MODE: SLIDES]

Fallback for plan slide 34. The screenshot may be stale: read the top questions from your phone (the board's URL is on the QR code), or take questions from the room by hand.

Say:
- "Let's do the top questions." Answer three to five.

→ Press → for the Thanks slide, or `b` to retry the live slide.
-->

---
backstage: true
plan: A4
backstageTitle: "Clip still: server-rendered vs. API (slide 7)"
---

# Server-rendered pages vs. an API

<ClipPlayer still name="server-vs-api" alt="Poster frame: a full page to one browser on the left, JSON packets to four clients on the right." width="752px" class="mx-auto" />

<!--
[7:03 · 2 min] [MODE: SLIDES]

Still of showpiece clip 1, for when video won't play. Same talk track as slide 7.

→ Press → to continue with slide 8.
-->

---
backstage: true
plan: A5
backstageTitle: "Clip still: class to table (slide 14)"
---

# Step 1: the model

<ClipPlayer still name="orm-class-to-table" alt="Poster frame: the Question class beside a questions table with three rows and a stack of migration files." width="752px" class="mx-auto" />

<!--
[7:15 · 1 min] [MODE: SLIDES]

Still of showpiece clip 2. Same talk track as slide 14: class = table, attribute = column, object = row; migrations = version control for the database.

→ Press → to continue with slide 15.
-->

---
backstage: true
plan: A6
backstageTitle: "Clip still: counter to many-to-many (slide 28)"
---

# A counter can't remember who voted

<ClipPlayer still name="counter-to-m2m" alt="Poster frame: a questions table and a users table joined by a votes table." width="752px" class="mx-auto" />

<!--
[8:03 · 2 min] [MODE: SLIDES]

Still of showpiece clip 3. Same talk track as slide 28.

→ Press → to continue with slide 29.
-->

---
backstage: true
class: ref-code
plan: A7
backstageTitle: "Reference v1: models.py"
---

<div class="kicker">Reference · v1 · step 1</div>

```python [questions/models.py]
from django.db import models

class Question(models.Model):
    text = models.CharField(max_length=300)
    votes = models.IntegerField(default=0)
    answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
```

<!--
[any · 0 min] [MODE: SLIDES]

Full v1 model (Appendix A.1). Show this if your editor dies or someone asks to see the whole file.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A8
backstageTitle: "Reference v1: serializers.py"
---

<div class="kicker">Reference · v1 · step 2</div>

```python [questions/serializers.py]
from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['votes', 'answered']
```

<!--
[any · 0 min] [MODE: SLIDES]

Full v1 serializer (Appendix A.1).

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A9
backstageTitle: "Reference v1: views.py (1/2)"
---

<div class="kicker">Reference · v1 · steps 3–5 · part 1 of 2</div>

```python [questions/views.py]
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
```

<!--
[any · 0 min] [MODE: SLIDES]

Final v1 views.py, top half (Appendix A.1): imports, the ViewSet, ordering. Part 2 is the next backstage slide.

→ Press → for part 2, or return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A10
backstageTitle: "Reference v1: views.py (2/2)"
---

<div class="kicker">Reference · v1 · step 4 · part 2 of 2 (inside the class)</div>

```python [questions/views.py]
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

<!--
[any · 0 min] [MODE: SLIDES]

Final v1 views.py, bottom half (Appendix A.1): the two custom actions, indented inside QuestionViewSet.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A11
backstageTitle: "Reference v1: config/urls.py"
---

<div class="kicker">Reference · v1 · step 3</div>

```python [config/urls.py]
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

<!--
[any · 0 min] [MODE: SLIDES]

Final v1 config/urls.py (Appendix A.1). In the starter repo every line except the admin ones is already there, commented out.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A12
backstageTitle: "Reference v2 Part A: login + permissions"
---

<div class="kicker">Reference · v2 Part A</div>

```python [config/urls.py: add to urlpatterns]
    path('api-auth/', include('rest_framework.urls')),
```

```python [config/settings.py: uncomment]
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}
```

```python [questions/views.py: optional, admin-only mark_answered]
from rest_framework.permissions import IsAdminUser

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_answered(self, request, pk=None):
        ...
```

<style>
.slidev-layout .slidev-code-wrapper { margin-bottom: 12px; }
</style>

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.2. The admin-only change only touches the decorator line of mark_answered; the body stays the same.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A13
backstageTitle: "Reference v2 Part B: models.py"
---

<div class="kicker">Reference · v2 Part B</div>

```python [questions/models.py]
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

<style>
.slidev-layout .slidev-code { --slidev-code-line-height: 1.4; line-height: 1.4; }
</style>

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.3 model: votes (integer) becomes voters (many-to-many to User). vote_count is a property for display.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A14
backstageTitle: "Reference v2 Part B: serializers.py (1/2)"
---

<div class="kicker">Reference · v2 Part B · part 1 of 2 (replaces the class)</div>

```python [questions/serializers.py]
class QuestionSerializer(serializers.ModelSerializer):
    vote_count = serializers.ReadOnlyField()
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'vote_count', 'has_voted', 'answered', 'created_at']
        read_only_fields = ['answered']
```

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.3 serializer, top. Replaces the v1 class; the v1 imports stay.

→ Press → for part 2, or return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A15
backstageTitle: "Reference v2 Part B: serializers.py (2/2)"
---

<div class="kicker">Reference · v2 Part B · part 2 of 2 (inside the class)</div>

```python [questions/serializers.py]
    def get_has_voted(self, obj):
        request = self.context.get('request')
        return bool(
            request
            and request.user.is_authenticated
            and obj.voters.filter(pk=request.user.pk).exists()
        )
```

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.3 serializer, bottom. has_voted answers "did I already vote?" for whoever is logged in; logged out it's always false.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A16
backstageTitle: "Reference v2 Part B: views.py (1/3)"
---

<div class="kicker">Reference · v2 Part B · part 1 of 3 (new imports + class top)</div>

```python [questions/views.py]
from django.db.models import Count
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.annotate(num_votes=Count('voters'))
    serializer_class = QuestionSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['num_votes', 'created_at']
```

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.3 views.py, top: three new imports (keep the v1 imports) and the annotated queryset, which makes ?ordering=-num_votes work.

→ Press → for part 2, or return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A17
backstageTitle: "Reference v2 Part B: views.py (2/3)"
---

<div class="kicker">Reference · v2 Part B · part 2 of 3 (inside the class)</div>

```python [questions/views.py]
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
```

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.3 views.py, upvote: needs a login, refuses a second vote with 400, otherwise adds the user to voters.

→ Press → for part 3, or return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A18
backstageTitle: "Reference v2 Part B: views.py (3/3)"
---

<div class="kicker">Reference · v2 Part B · part 3 of 3 (inside the class)</div>

```python [questions/views.py]
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_answered(self, request, pk=None):
        question = self.get_object()
        question.answered = True
        question.save()
        return Response(self.get_serializer(question).data)
```

<!--
[any · 0 min] [MODE: SLIDES]

Appendix A.3 views.py, mark_answered: admin only. Same body as v1.

→ Return with `g` + the slide you came from.
-->

---
backstage: true
class: ref-code
plan: A19
backstageTitle: "Troubleshooting: setup"
---

# Troubleshooting: setup

<div class="trouble">
  <div class="trouble-item">
    <div class="symptom"><code>uv: command not found</code></div>
    <div class="fix">macOS / Linux, then open a new terminal:</div>
    <pre class="cmd">curl -LsSf https://astral.sh/uv/install.sh | sh</pre>
    <div class="fix">Windows (PowerShell), then open a new terminal:</div>
    <pre class="cmd">powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"</pre>
  </div>
  <div class="trouble-item">
    <div class="symptom"><code>Error: That port is already in use.</code></div>
    <pre class="cmd">uv run python manage.py runserver 8001</pre>
    <div class="fix">…and use <code>127.0.0.1:8001</code> in the browser.</div>
  </div>
</div>

<style>
.trouble { display: flex; flex-direction: column; gap: 18px; }
.trouble-item { display: flex; flex-direction: column; gap: 6px; }
.symptom code { font-size: 22px !important; color: var(--error) !important; }
.fix { font-size: 20px; font-weight: 600; color: var(--text-muted); }
.cmd { margin: 0; font-family: var(--font-mono); font-size: var(--fs-code); font-weight: 600; background: var(--surface); border: var(--stroke) solid var(--border); border-radius: var(--radius-sm); padding: 6px 12px; color: var(--text); white-space: pre; }
</style>

<!--
[any · 0 min] [MODE: SLIDES]

Show this during the pre-show or whenever several people hit the same setup error.

Say:
- "No uv? Run the line for your system, then close and reopen your terminal."
- "Port in use? Something else is on 8000, usually an old runserver. Use 8001."

→ Return with `g` + the slide you came from (P1 is slide 1).
-->

---
backstage: true
class: ref-code
plan: A20
backstageTitle: "Troubleshooting: database"
---

# Troubleshooting: database

<div class="trouble">
  <div class="trouble-item">
    <div class="symptom"><code>no such table: questions_question</code></div>
    <div class="fix">The migration was never made or applied:</div>
    <pre class="cmd">uv run python manage.py makemigrations
uv run python manage.py migrate</pre>
  </div>
  <div class="trouble-item">
    <div class="symptom"><code>no such column</code> after a checkpoint checkout</div>
    <div class="fix">Your database is from different code. Start it fresh:</div>
    <pre class="cmd">rm db.sqlite3          # Windows: del db.sqlite3
uv run python manage.py migrate</pre>
  </div>
  <div class="trouble-item">
    <div class="symptom"><code>No changes detected</code></div>
    <div class="fix">Save models.py first, then run makemigrations again.</div>
  </div>
</div>

<style>
.trouble { display: flex; flex-direction: column; gap: 16px; }
.trouble-item { display: flex; flex-direction: column; gap: 6px; }
.symptom { font-size: 22px; font-weight: 700; }
.symptom code { font-size: 22px !important; color: var(--error) !important; }
.fix { font-size: 20px; font-weight: 600; color: var(--text-muted); }
.cmd { margin: 0; font-family: var(--font-mono); font-size: var(--fs-code); font-weight: 600; background: var(--surface); border: var(--stroke) solid var(--border); border-radius: var(--radius-sm); padding: 6px 12px; color: var(--text); white-space: pre; }
</style>

<!--
[any · 0 min] [MODE: SLIDES]

Say:
- "no such table: you skipped makemigrations or migrate. Run both."
- "no such column after switching branches: delete db.sqlite3 and migrate again. You'll lose your test questions, nothing else."
- "No changes detected: the file isn't saved."

→ Return with `g` + the slide you came from.
-->

---
backstage: true
plan: A21
routeAlias: projector-check
backstageTitle: Projector check
---

# Projector check

<ProjectorCheck />

<!--
[before doors · 2 min] [MODE: SLIDES]

Run this in the room before 6:30.

Say:
- Nothing; it's for you. Stand at the back row.

Check:
- Every swatch is distinguishable, especially --border against --bg and --surface.
- The 16 px line is readable from the back. If it isn't, ask for the lights to be dimmed near the screen.
- Method and status badges keep their colors (GET blue, POST green, PATCH amber, DELETE red).

At home, test the same thing with the projector simulation: add ?projector to the URL (or press p in dev).

→ Return with `g` + 1 for the pre-show loop.
-->

---
backstage: true
layout: bare
plan: A22
backstageTitle: "Title direction B: title + terminal"
---

<TitleHero variant="b" />

<div class="direction-tag">Direction B</div>

<style>
.direction-tag { position: absolute; right: 16px; bottom: 12px; z-index: 2; font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 800; color: var(--bg); background: var(--accent-2); border-radius: var(--radius-sm); padding: 2px 8px; }
</style>

<!--
[phase 1 review · 0 min] [MODE: SLIDES]

Alternative title direction B (title + terminal). Slide 1 uses direction A. To switch, change `variant="a"` to `variant="b"` in pages/01-opening.md.

→ Return with `g` + 2 for the title slide.
-->

---
backstage: true
layout: bare
plan: A23
backstageTitle: "Title direction C: request line"
---

<TitleHero variant="c" />

<div class="direction-tag">Direction C</div>

<style>
.direction-tag { position: absolute; right: 16px; bottom: 12px; z-index: 2; font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 800; color: var(--bg); background: var(--accent-2); border-radius: var(--radius-sm); padding: 2px 8px; }
</style>

<!--
[phase 1 review · 0 min] [MODE: SLIDES]

Alternative title direction C (request line). Slide 1 uses direction A. To switch, change `variant="a"` to `variant="c"` in pages/01-opening.md.

→ Return with `g` + 2 for the title slide.
-->
