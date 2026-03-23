#!/bin/bash
# Pre-Compact Hook — Saves session state before context compaction
# Inspired by Claude Code Game Studios session management pattern
# Adapted for Urban Command Center (Vite+React+Zustand)

STATE_DIR="production/session-state"
STATE_FILE="$STATE_DIR/active.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p "$STATE_DIR"

# Collect git status
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
LAST_COMMIT=$(git log -1 --format="%h %s" 2>/dev/null || echo "none")
MODIFIED_FILES=$(git diff --name-only 2>/dev/null | head -20)
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null | head -20)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | head -10)

# Detect active work area from recent git changes
RECENT_AREAS=""
if echo "$MODIFIED_FILES" | grep -q "src/engine/"; then
  RECENT_AREAS="$RECENT_AREAS engine"
fi
if echo "$MODIFIED_FILES" | grep -q "src/components/"; then
  RECENT_AREAS="$RECENT_AREAS ui"
fi
if echo "$MODIFIED_FILES" | grep -q "src/data/"; then
  RECENT_AREAS="$RECENT_AREAS data"
fi
if echo "$MODIFIED_FILES" | grep -q "src/store/"; then
  RECENT_AREAS="$RECENT_AREAS store"
fi

cat > "$STATE_FILE" << EOF
# Session State — Auto-saved before context compaction
> Generated: $TIMESTAMP

## Git State
- **Branch:** $BRANCH
- **Last commit:** $LAST_COMMIT
- **Active areas:** ${RECENT_AREAS:-none detected}

## Modified Files (unstaged)
\`\`\`
${MODIFIED_FILES:-none}
\`\`\`

## Staged Files
\`\`\`
${STAGED_FILES:-none}
\`\`\`

## Untracked Files
\`\`\`
${UNTRACKED:-none}
\`\`\`

## Recovery Instructions
1. Read this file to restore context
2. Check git status for current state
3. Review modified files listed above
4. Continue from where the previous session left off
EOF

echo "Session state saved to $STATE_FILE"
