"""Run every request from plan section 2 against a checkpoint and print the real results.

Usage (from the deck repo root):
    scripts/verify-responses.sh            # all checkpoints, in throwaway worktrees

This file is executed inside a checkpoint's own environment with
`uv run python verify-responses.py <checkpoint>`; it uses DRF's APIClient
with session login, the same authentication the browsable API uses.
"""

import json
import os
import sys

sys.path.insert(0, os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402

django.setup()

from django.contrib.auth.models import User  # noqa: E402
from rest_framework.test import APIClient  # noqa: E402

checkpoint = sys.argv[1]
n = int(checkpoint.split("-")[1])


def show(label, response):
    body = response.content.decode() or ""
    try:
        body = json.dumps(json.loads(body), separators=(",", ":"))
    except ValueError:
        body = f"<{response.get('Content-Type', '')}, {len(body)} bytes>"
    print(f"{checkpoint} | {label} | {response.status_code} | {body}")


def client():
    # runserver accepts 127.0.0.1 with DEBUG and an empty ALLOWED_HOSTS; "testserver" would get a 400.
    return APIClient(HTTP_HOST="127.0.0.1:8000")


anon = client()

if n == 0:
    show("GET /admin/ (anon)", anon.get("/admin/", follow=False))
    show("GET /api/questions/ (anon)", anon.get("/api/questions/"))
    sys.exit()

mod = User.objects.create_superuser("mod", "mod@example.com", "pw-mod-123456")
sam = User.objects.create_user("sam", password="pw-sam-123456")
as_mod = client()
as_mod.login(username="mod", password="pw-mod-123456")
as_sam = client()
as_sam.login(username="sam", password="pw-sam-123456")

show("POST /api/questions/ text", anon.post("/api/questions/", {"text": "What does a serializer do?"}, format="json"))
show("POST /api/questions/ blank", anon.post("/api/questions/", {"text": ""}, format="json"))
show("POST /api/questions/ votes 9999", anon.post("/api/questions/", {"text": "hi", "votes": 9999}, format="json"))
show("GET /api/questions/999/", anon.get("/api/questions/999/"))
show("GET /api/questions/", anon.get("/api/questions/"))
show("PATCH /1/ votes 9999 (anon)", anon.patch("/api/questions/1/", {"votes": 9999}, format="json"))

if n == 1:
    show("DELETE /2/ (anon)", anon.delete("/api/questions/2/"))
    sys.exit()

if n == 2:
    for _ in range(3):
        show("POST /1/upvote/ (anon)", anon.post("/api/questions/1/upvote/"))
    show("POST /1/toggle_answered/ (anon)", anon.post("/api/questions/1/toggle_answered/"))
    show("POST /1/toggle_answered/ (anon)", anon.post("/api/questions/1/toggle_answered/"))
    show("DELETE /2/ (anon)", anon.delete("/api/questions/2/"))
    show("GET /1/upvote/ (anon)", anon.get("/api/questions/1/upvote/"))
    sys.exit()

vote = "upvote" if n == 3 else "toggle_vote"
show(f"POST /1/{vote}/ (anon)", anon.post(f"/api/questions/1/{vote}/"))
for _ in range(3 if n == 3 else 2):
    show(f"POST /1/{vote}/ (sam)", as_sam.post(f"/api/questions/1/{vote}/"))
show(f"POST /1/{vote}/ (mod)", as_mod.post(f"/api/questions/1/{vote}/"))
show("POST /1/toggle_answered/ (anon)", anon.post("/api/questions/1/toggle_answered/"))
show("POST /1/toggle_answered/ (sam)", as_sam.post("/api/questions/1/toggle_answered/"))
show("POST /1/toggle_answered/ (mod)", as_mod.post("/api/questions/1/toggle_answered/"))
show("PATCH /1/ (anon)", anon.patch("/api/questions/1/", {"text": "Edited"}, format="json"))
show("PATCH /1/ (sam)", as_sam.patch("/api/questions/1/", {"text": "Edited"}, format="json"))
show("PATCH /1/ (mod)", as_mod.patch("/api/questions/1/", {"text": "What does a serializer do, exactly?"}, format="json"))
show("DELETE /2/ (anon)", anon.delete("/api/questions/2/"))
show("DELETE /2/ (sam)", as_sam.delete("/api/questions/2/"))
show("DELETE /2/ (mod)", as_mod.delete("/api/questions/2/"))
show("POST /api/questions/ (sam)", as_sam.post("/api/questions/", {"text": "Logged-in create"}, format="json"))
if n == 4:
    show("POST /1/upvote/ (sam)", as_sam.post("/api/questions/1/upvote/"))
