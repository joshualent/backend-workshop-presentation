# Cheat sheet: every snippet, in paste order

Every Python block here matches Appendix A of `docs/presentation-plan.md` character for character (checked by `pnpm --dir slides check:code`). Section numbers (§) are the ones the presenter notes refer to.

Run all commands from the repo folder (`questions-api/`), in a **second** terminal tab so `runserver` keeps running in the first. The server reloads on every save.

---

## v1

### §1 Step 1: the model (slide 15)

**File:** `questions/models.py`. Replace the empty stub with:

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

**Run:**

```bash
uv run python manage.py makemigrations
uv run python manage.py migrate
```

**Expect:** `Migrations for 'questions':` → `questions/migrations/0001_initial.py` → `+ Create model Question`, then `Applying questions.0001_initial... OK`.

---

### §2 Step 2: the serializer (slide 17)

**File:** `questions/serializers.py`. Replace the empty stub with:

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

**Run:** nothing. **Expect:** no red errors in the runserver terminal.

---

### §3a Step 3: the ViewSet (slide 19)

**File:** `questions/views.py`. Replace the empty stub. First line at the top:

```python
from rest_framework import viewsets
```

Leave one line of room below it (steps 4 and 5 add three more imports there), then:

```python
from .models import Question
from .serializers import QuestionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
```

### §3b Step 3: turn on the router (slide 19)

**File:** `config/urls.py`. Uncomment the router lines so the file reads exactly like this (leave the `api-auth/` line commented for now):

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

**Browser:** <http://127.0.0.1:8000/api/questions/>

| Test | How | Expect |
|---|---|---|
| Create | Form at the bottom → Content: `{"text": "What is REST?"}` → POST | `201 Created` |
| Validation | POST `{"text": ""}` | `400 Bad Request`, `"This field may not be blank."` |
| Not found | Visit `/api/questions/999/` | `404 Not Found` |
| The 9,999 question | POST `{"text": "Hi", "votes": 9999}` | `201`, and `"votes": 0` |

### §3c Optional curl callback (cut first)

macOS / Linux / Git Bash:

```bash
curl -X POST http://127.0.0.1:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Asked from curl"}'
```

Windows PowerShell: use `curl.exe` (plain `curl` is an alias for `Invoke-WebRequest`) and escape the quotes: `curl.exe -X POST http://127.0.0.1:8000/api/questions/ -H "Content-Type: application/json" -d '{\"text\": \"Asked from curl\"}'`

**Expect:** the new question as JSON, with an `id`.

---

### §4 Step 4: the upvote action (slide 20)

**File:** `questions/views.py`. Two imports, directly under `from rest_framework import viewsets`:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
```

Then this method, inside `QuestionViewSet` (indented under `serializer_class`, one blank line above it):

```python
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        question = self.get_object()
        question.votes += 1
        question.save()
        return Response(self.get_serializer(question).data)
```

**Browser:** <http://127.0.0.1:8000/api/questions/1/upvote/> → **POST** button. `votes` goes up by one each time. (The page's own GET shows `405 Method Not Allowed`. Expected: upvote only takes POST.)

### §4b "Your turn": mark_answered (slide 21)

Inside `QuestionViewSet`, below `upvote`, one blank line between them:

```python
    @action(detail=True, methods=['post'])
    def mark_answered(self, request, pk=None):
        question = self.get_object()
        question.answered = True
        question.save()
        return Response(self.get_serializer(question).data)
```

**Browser:** POST to <http://127.0.0.1:8000/api/questions/1/mark_answered/> → `"answered": true`.

---

### §5 Step 5: ordering (slide 23)

**File:** `questions/views.py`. One import, under the `Response` import:

```python
from rest_framework.filters import OrderingFilter
```

Two lines inside `QuestionViewSet`, directly under `serializer_class = QuestionSerializer`:

```python
    filter_backends = [OrderingFilter]
    ordering_fields = ['votes', 'created_at']
```

**Browser:** <http://127.0.0.1:8000/api/questions/?ordering=-votes>, then `?ordering=created_at`.

**Commit:**

```bash
git add -A
git commit -m "v1 done"
```

(If git asks who you are, skip it. The files are saved either way.)

**Behind? Catch up to here:**

```bash
git stash -u
git checkout tier-1-done
uv run python manage.py migrate
```

---

## v2 (stretch)

### §A1 Part A: an admin user (slide 29)

```bash
uv run python manage.py createsuperuser
```

Any username, skip the email, a password you'll remember. Typing the password shows nothing; that's normal. Django may warn that it's too common: answer `y`.

### §A2 Part A: login link + permissions (slide 29)

**File:** `config/urls.py`. Uncomment the last line of `urlpatterns`:

```python
# config/urls.py: add to urlpatterns
    path('api-auth/', include('rest_framework.urls')),
```

**File:** `config/settings.py`. Uncomment the block at the bottom:

```python
# config/settings.py: uncomment
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}
```

**Browser:** refresh `/api/questions/` while logged out: the POST form is gone. "Log in" appears top right.

### §A3 Part A: prove the 403 (slide 29)

```bash
curl -X POST http://127.0.0.1:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Not logged in"}'
```

**Expect:** `{"detail":"Authentication credentials were not provided."}` with status 403 (add `-i` to see the status line). Then log in through the browsable API and POST a question → `201 Created`.

### §A4 Part A, optional (4th on the cut list): admin-only mark_answered

**File:** `questions/views.py`. Add the import at the top, and change only the decorator line above `mark_answered` (its body stays the same):

```python
# questions/views.py: optional, admin-only mark_answered
from rest_framework.permissions import IsAdminUser

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_answered(self, request, pk=None):
        ...
```

**Expect:** a non-admin user gets `403`; your superuser still gets `200`.

**Checkpoint branch for Part A:** `tier-2-auth`.

---

### §B1 Part B: the model (slide 31)

Say it out loud first: **votes reset to zero** (slide 30).

**File:** `questions/models.py`. Replace the whole file:

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

### §B2 Part B: the serializer

**File:** `questions/serializers.py`. Keep the two imports; replace the class:

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

### §B3 Part B: the ViewSet

**File:** `questions/views.py`. Add the three imports under the existing ones (if §A4 already imported `IsAdminUser`, the duplicate is harmless), then replace the whole `QuestionViewSet` class:

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

**Run:**

```bash
uv run python manage.py makemigrations
uv run python manage.py migrate
```

**Expect:** `Remove field votes from question` and `Add field voters to question`, then `Applying questions.0002_… OK`.

### §B4 Part B: prove it

1. Logged in, POST <http://127.0.0.1:8000/api/questions/1/upvote/> → `"vote_count": 1, "has_voted": true`.
2. POST again → `400 Bad Request`, `"You already voted for this question."`
3. Second user: <http://127.0.0.1:8000/admin/auth/user/add/> → username + password → Save.
4. Private window → <http://127.0.0.1:8000/api-auth/login/> → log in as the second user → upvote question 1 → `"vote_count": 2`.

### §B5 Part B: ordering fix (first to cut)

`?ordering=-votes` stopped working because `votes` is gone. The `annotate(num_votes=Count('voters'))` and `ordering_fields = ['num_votes', 'created_at']` lines in §B3 already fix it:

<http://127.0.0.1:8000/api/questions/?ordering=-num_votes>

Short on time: use `ordering_fields = ['created_at']` instead and skip the annotate explanation. (`vote_count` is the property you see in the JSON; `num_votes` only exists so the list can be sorted.)

**Checkpoint branch for Part B:** `tier-3-m2m`. Demo-from-branch fallback:

```bash
git stash -u
git checkout tier-3-m2m
uv run python manage.py migrate
```
