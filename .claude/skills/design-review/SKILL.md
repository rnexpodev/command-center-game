---
name: design-review
description: Structured design review process using the collaborative protocol — question, options, decision, draft, approval. For game design decisions, feature proposals, and UX changes.
---

# Design Review — Urban Command Center

## Purpose
Ensures every design decision goes through a structured process instead of ad-hoc implementation. Prevents costly rework by presenting tradeoffs before writing code.

## The Collaborative Protocol

Every design decision follows this 5-step flow:

```
שאלה → אופציות → החלטה → טיוטה → אישור
Question → Options → Decision → Draft → Approval
```

## Procedure

### Step 1: Frame the Question (שאלה)
Clearly state what design problem needs solving:
- What feature or change is being considered?
- What's the current state?
- What's the motivation / user need?
- What constraints exist (technical, time, scope)?

Present this to the user as a concise problem statement in Hebrew.

### Step 2: Present Options (אופציות)
Generate 2-4 concrete options. For each option:

```markdown
### אופציה א׳: [שם]
**תיאור:** [מה זה עושה]
**יתרונות:**
- [יתרון 1]
- [יתרון 2]
**חסרונות:**
- [חסרון 1]
- [חסרון 2]
**מורכבות:** [נמוכה/בינונית/גבוהה]
**השפעה על מערכות קיימות:** [פירוט]
```

Always include:
- A "do nothing" / minimal option
- The most ambitious option
- A balanced middle-ground option

### Step 3: Decision (החלטה)
- Present a recommendation with reasoning
- **Wait for user approval** — never proceed without explicit choice
- Document the decision and reasoning

### Step 4: Draft (טיוטה)
Once the user chooses:
- Create a technical design outline
- List files to create/modify
- Identify dependencies and risks
- Estimate scope (small/medium/large)
- Present for user review

### Step 5: Approval (אישור)
- User reviews the draft
- Modifications requested → return to Step 4
- Approved → proceed to implementation
- Save the design decision to docs

### Decision Record
After approval, save an Architecture Decision Record:

```markdown
# ADR-[XXX]: [כותרת]

## תאריך
[YYYY-MM-DD]

## סטטוס
מאושר

## הקשר
[מה הבעיה שנפתרה]

## האופציות שנבדקו
1. [אופציה א׳ — נדחתה כי...]
2. [אופציה ב׳ — נבחרה כי...]
3. [אופציה ג׳ — נדחתה כי...]

## ההחלטה
[מה הוחלט ולמה]

## ההשלכות
- [השלכה 1]
- [השלכה 2]
```

Save to `docs/studio/decisions/ADR-[XXX]-[slug].md`

## When to Use This Skill
- New feature proposals
- Changes to game mechanics
- UI/UX redesigns
- Data model changes
- Balance philosophy changes
- Architecture decisions
