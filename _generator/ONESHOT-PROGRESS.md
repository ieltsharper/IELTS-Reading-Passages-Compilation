# One-shot guides – progress

Goal (2026-11-24): every Reading passage on the site gets a "Hướng dẫn One-Shot" (`strategy`) like the teacher's Lời giải One-Shot docx.

## Tooling
- `python _generator/oneshot-dump.py <topic> <slug>` prints a passage with paragraph numbers, questions and key (`--list` lists slugs, `*` = has strategy).
- Write the guide as `_generator/strategy/<topic>/<slug>.json` (see `strategy/psychology/unit-01-optimism-and-health.json`).
- `node _generator/oneshot-apply.mjs <topic> --check` validates (answers = key, quotes occur in passage, all questions covered).
- `node _generator/oneshot-apply.mjs <topic>` writes `strategy` into `data/<topic>.json`; then `node _generator/build-html.mjs` regenerates HTML.
- NOTE: build-data from the original docx would overwrite `strategy`; re-run the apply script afterwards.

## Status (all pushed to main)
- psychology: units 01–09 DONE.
- psychology-p3: units 01–19 DONE.
- recent-actual-test-7: passages 01–18 DONE (passage 01 has no key for Q14–15; guide covers Q16–26 and notes the rest).
- Topics that already had a strategy from the docx: untouched.
- Also DONE 2026-11-25 (own repos, own ONESHOT-PROGRESS.md): IELTS-Reading-Actual-Tests (vol-1/2/3 + practice-1, 69 passages, 806c16d), IELTS-Forecast-Tests (30 Reading passages, bc32bf0).
- NOT yet covered: single-passage practice repos (TFNG, MCQs, Matching etc.).
- Arguable keys flagged inside guides (key kept): psychology-p3 unit-05 Q34, unit-14 Q27.
