---
section: Wrap-up
---

# What you built

<BuiltMap :at="1" />

<!--
[8:25 · 5 min] [SLIDES]

- The same diagram, turned on its side, with the client at the top and SQLite at the bottom.

[click] Next to each box are the names you wrote: the `DefaultRouter`, `QuestionViewSet` with `get_permissions` and `toggle_vote`, `QuestionSerializer`, `Question`, and two tables (Django created the join table).

- Say: "This API validates input, checks permissions, and stores votes in a many-to-many relationship. You wrote about 60 lines of code for it."
- Anyone who fell behind can switch to `checkpoint-4-m2m` to get the finished project.
- Thank the club, and anyone who helped, by name. Then take questions, and repeat each question into the room before answering.
- Questions to answer if the room is quiet: "Why 403 and not 401?" (session login; see the notes on slide 12), "Why not let clients send the vote count?" (part 2), "How would a phone app log in?" (with a token).
- Where to go next, if anyone asks: the official DRF tutorial, tests with DRF's `APITestCase`, pagination and ordering, a frontend that calls the API with `fetch`, and deploying.
- This is the last slide. Leave it on screen at the end.
-->
