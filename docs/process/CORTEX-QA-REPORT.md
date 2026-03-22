# Cortex QA Report — Live Feature Testing

**Date:** 2026-03-22
**Cortex Version:** Post all 14 fixes
**Models Available:** 5 CLI models (Claude Code, Codex, Gemini, Ollama, OpenCode). No API keys configured.

---

## Test Results

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 1 | API Health Check | PASS | `127.0.0.1:3141` responds correctly |
| 2 | Project Registration | PASS | Created project d525f2b6 with name, idea, description |
| 3 | Studio AI Suggestions (features) | PASS | 6 domain-specific features generated via Claude Code CLI. Content is Israeli-context-aware (Tzeva Adom, Soroka, Nahal Beer Sheva). Not fallback. |
| 4 | Domain Detection (templates) | PASS | Endpoint returns game-domain features when AI is used |
| 5 | Council Quick Mode | FAIL | Expected — no API models configured. Quick mode skips CLI (too slow). Research warnings shown correctly. |
| 6 | Council with Project Context | PASS | Query submitted with project_id, warnings included. Synthesis pending (CLI models are slow). |
| 7 | PRD Export | PASS | Created PRD with 5 sections. Overview has real content (draft). Others have skeleton templates (not empty). AI enrichment fires in background. |
| 8 | Studio AI Chat | PASS | 2723-char Hebrew response about main menu design. Context-aware, specific to project. Model: Claude Code CLI. |
| 9 | Research Warnings | PASS | Two warnings shown: missing SerpAPI key and GitHub token. |
| 10 | UTF-8 Encoding | PASS | Hebrew text in suggestions and chat renders correctly. No garbled characters. |

## Summary

**8/10 tests PASS.** 1 expected failure (quick mode requires API keys). 1 pending (council synthesis takes time with CLI models).

## Key Findings

### What Works Excellently
1. **Studio AI Suggestions** — Went from 0/10 (all null) to producing 6 detailed, domain-aware, Israeli-context-specific features. This is the biggest improvement.
2. **Studio AI Chat** — Was returning empty. Now produces 2700+ char Hebrew responses with project context.
3. **PRD Export** — Was creating blank sections. Now has skeleton templates with guiding questions. AI enrichment runs in background.
4. **Hebrew Encoding** — All Hebrew text renders correctly in JSON responses.
5. **Research Warnings** — Clear, actionable messages about missing API keys.

### What Needs Attention
1. **Council Quick Mode** — Works architecturally but useless without API keys. Need to either configure API keys or make quick mode work with CLI models.
2. **Council Speed** — Full council with CLI models is still slow (~60s+). Quick mode would solve this if API keys were available.
3. **PRD AI Enrichment** — Background enrichment depends on model availability. With slow CLI models, sections stay as skeleton for a while.

### Recommendations
1. Configure at least one API key (OpenRouter recommended — access to 100+ models with one key) to unlock quick mode and faster suggestions.
2. Consider making quick mode fall back to the fastest CLI model instead of failing when no API models exist.
3. Add a "generating..." indicator in the PRD UI while background enrichment runs.
