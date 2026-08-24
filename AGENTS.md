# AGENTS.md

Primary source of truth for this project is **`CLAUDE.md`** (repo root) — read it first, every session.

- Detailed reference docs: `docs/` (architecture, data domains, routes, Supabase, conventions, deployment, and a self-updating learnings log). `CLAUDE.md` has a table of which doc to read for what.
- Skills: `.agents/skills/<name>/SKILL.md`. Check for a relevant skill (e.g. `sumup`, `cafe-new-feature`) before implementing a task those skills cover — read the SKILL.md before starting.
- This is an **agent-only project** — no human reads the code directly, so documentation quality directly determines how fast and correct future work is. If you learn something reusable, add it to `docs/LEARNINGS.md` or the relevant doc before finishing your task (see `CLAUDE.md` → Self-Improvement).
- Don't duplicate facts from `CLAUDE.md`/`docs/` into this file — it stays a pointer so nothing drifts out of sync again.
