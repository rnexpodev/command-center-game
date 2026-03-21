# Improvement Plans

## Structure

```
plans/
├── README.md          ← You are here
├── pending/           ← Plans waiting to be executed
│   ├── 01-sound-design.md
│   ├── 02-after-action-replay.md
│   ├── 07-civilian-behavior.md
│   ├── 08-scenario-editor.md
│   ├── 09-training-mode.md
│   ├── 10-campaign-mode.md
│   ├── 11-achievements-stats.md
│   ├── 12-performance-analytics.md
│   └── ...
└── executed/          ← Completed plans (moved from pending/)
```

## Workflow

1. Plans are created in `pending/` with a numbered prefix indicating priority order
2. When starting work on a plan, reference it by filename
3. When a plan is fully implemented and verified, move it to `executed/`
4. Each plan file contains: objective, competitive reference, requirements, technical design, acceptance criteria

## Priority Levels

- **P1** (01-03): High impact, do first
- **P2** (04-06, 11-12): Medium-high impact, second wave
- **P3** (07-10): Larger scope or lower priority, third wave

## Relationship to Real Software

Plans marked "Serves Real Software: YES" directly inform the municipal command center at `C:\devprojects\municipal-command-center`. Insights from game implementation feed back into the real system's design.
