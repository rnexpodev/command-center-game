# Cortex Improvement Suggestions

Based on building the Municipal Emergency Command Center game using Cortex as the primary development guide.

---

## Priority 1: Critical (Blocking Issues)

### 1. Studio AI Suggestions Return Null with Local Models
**Problem:** All 9 suggestion types (features, personas, stories, pages, design-direction, nav-flows, data-models, relationships, tech-stack, phases) return `null` when using Llama 3.3 70B via Ollama.
**Impact:** Studio's core value proposition is non-functional.
**Suggestion:**
- Add structured output prompting (JSON mode) for Ollama models
- Add retry logic with different prompting strategies
- Fall back to template suggestions when AI returns unparseable output
- Test Studio suggestions with each supported model before release

### 2. Studio Council-Mode Suggestions Lack Project Context
**Problem:** When using `?mode=council`, the suggestions are generated for Cortex itself instead of the user's project. The AI doesn't receive the project's idea text, description, or existing features as context.
**Impact:** Even with working models, suggestions are irrelevant.
**Suggestion:**
- Inject project context (ideaText, description, existing features) into the suggestion prompt
- Add a system prompt that says "You are suggesting features for THIS project, not for the platform you're running on"
- Include the project name and description prominently in the prompt

### 3. Hebrew/UTF-8 Encoding Broken
**Problem:** Hebrew text gets garbled (shows as `???`) in council queries sent through the API, and in PRD titles stored in the database.
**Impact:** The system is unusable for non-English projects.
**Suggestion:**
- Ensure all database columns use UTF-8 encoding
- Set `Content-Type: application/json; charset=utf-8` on all API responses
- Test with Hebrew, Arabic, Chinese, and emoji content
- Fix the council query storage to preserve Unicode

---

## Priority 2: High (Major Gaps)

### 4. PRD Export Creates Empty Documents
**Problem:** `POST /api/studio/:id/export/prd` creates a PRD with 0/5 completed sections. No AI generation occurs.
**Impact:** PRD feature is essentially a stub.
**Suggestion:**
- Auto-generate PRD sections using AI based on project studio data
- Use the existing features, personas, pages, data models to populate sections
- Add a "Generate All Sections" button or auto-generate on export

### 5. No Fallback for Failed AI Suggestions
**Problem:** When `generateAiSuggestion` fails, the `catch` block calls `generateSuggestions` (template fallback), but this also returns null/empty for most types.
**Impact:** There's no safety net when AI fails.
**Suggestion:**
- Create meaningful template suggestions for all suggestion types
- Templates should be generic but useful (e.g., common features for web apps, common personas)
- Show a clear message: "AI unavailable — showing template suggestions. Customize these for your project."

### 6. Llama 3.3 70B Returns Empty Responses in Council
**Problem:** The Llama model consistently returns empty strings as council responses, contributing nothing to the synthesis.
**Impact:** 1 of 3 council models is wasted, reducing response diversity.
**Suggestion:**
- Add response validation — if a model returns empty/very short, retry or exclude from synthesis
- Show a warning in the UI when a model fails to contribute
- Consider using a different Ollama model (e.g., Mistral, Qwen) that handles structured output better

---

## Priority 3: Medium (Improvements)

### 7. Council Synthesis Takes Too Long
**Problem:** Full council pipeline (research → query models → review → synthesize) takes 60-90 seconds.
**Impact:** Feels slow for interactive use.
**Suggestion:**
- Stream partial results (show individual model responses as they arrive)
- Allow users to read responses before synthesis completes
- Add a "Quick Mode" that uses a single model for faster responses
- Cache synthesis for identical or similar questions

### 8. Studio AI Chat Returns Empty Messages
**Problem:** `POST /api/studio/:id/ai-chat` returns `{"message": "", "model": "Llama 3.3 70B"}` — empty message.
**Impact:** The chat feature in Studio is non-functional with local models.
**Suggestion:**
- Same as #1 — ensure the local model can generate responses
- Add conversation context (project data) to the chat prompt
- Fall back to a simple response generator if AI fails

### 9. Research Phase Needs API Keys
**Problem:** Web search requires SerpAPI key, GitHub search requires GitHub token. Without these, research returns empty results.
**Impact:** Council responses lack external context.
**Suggestion:**
- Make it clearer during setup which API keys are needed
- Show a prominent warning in the UI when research capabilities are limited
- Consider free alternatives for web search (DuckDuckGo API, Brave Search)

### 10. Studio Suggestion Types Missing "Design Direction"
**Problem:** The `design-direction` suggestion type exists in the API but there's no structured schema for it — it's just a `Record<string, unknown>`.
**Impact:** Hard to know what to expect from design direction suggestions.
**Suggestion:**
- Define a clear schema: color palette, typography, layout style, visual references
- Include operational/professional design presets for domain-specific apps (command center, dashboard, etc.)

---

## Priority 4: Nice-to-Have

### 11. Add Game/Simulation Domain Templates
**Suggestion:** Add project templates for common domains — game simulation, SaaS, e-commerce, mobile app. Each template pre-fills personas, features, and design direction for that domain.

### 12. Studio → Code Generation Pipeline
**Suggestion:** After defining features, pages, and data models in Studio, offer a "Generate Scaffold" option that creates the project files. Connect to the prompts lab to generate implementation prompts from Studio data.

### 13. Council Should Remember Project Context
**Suggestion:** Allow linking a council query to a Studio project so the Council can reference the project's features, tech stack, and architecture when answering questions.

### 14. Multi-Language UI Support for Studio
**Suggestion:** Studio UI should support Hebrew/RTL for projects targeting Hebrew audiences. The project data is in Hebrew but the Studio interface is in English — this disconnect is awkward.

---

## Summary

| Priority | Count | Theme |
|----------|-------|-------|
| Critical | 3 | AI output quality, encoding, project context |
| High | 3 | PRD generation, fallbacks, model reliability |
| Medium | 4 | Performance, chat, research, design schema |
| Nice-to-have | 4 | Templates, code gen, context, i18n |

**The single most impactful fix:** Make Studio suggestions work reliably with at least one model. This would transform Studio from a dead feature into its core value proposition.
