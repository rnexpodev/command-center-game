#!/bin/bash
# Session Start Hook — Loads previous session state and provides context
# Inspired by Claude Code Game Studios session recovery pattern

STATE_FILE="production/session-state/active.md"
GAPS_FOUND=0

echo "=== Urban Command Center — Session Start ==="
echo ""

# 1. Recover previous session state if exists
if [ -f "$STATE_FILE" ]; then
  echo "📋 Previous session state found:"
  echo "---"
  cat "$STATE_FILE"
  echo "---"
  echo ""
fi

# 2. Quick project health check
echo "🔍 Project Health Check:"

# Check for build errors
if [ -f "package.json" ]; then
  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    echo "  ⚠️  node_modules missing — run npm install"
    GAPS_FOUND=$((GAPS_FOUND + 1))
  fi

  # Check for stale .next/.vite cache
  if [ -d ".vite" ] || [ -d "dist" ]; then
    CACHE_AGE=$(find dist -maxdepth 0 -mmin +1440 2>/dev/null)
    if [ -n "$CACHE_AGE" ]; then
      echo "  ⚠️  Build cache older than 24h — consider cleaning"
      GAPS_FOUND=$((GAPS_FOUND + 1))
    fi
  fi
fi

# 3. Check for uncommitted work
DIRTY=$(git status --porcelain 2>/dev/null | wc -l)
if [ "$DIRTY" -gt 0 ]; then
  echo "  📝 $DIRTY uncommitted changes"
fi

# 4. Recent activity
echo ""
echo "📊 Recent Activity (last 5 commits):"
git log --oneline -5 2>/dev/null | sed 's/^/  /'

# 5. Gap detection — missing docs or incomplete features
echo ""
echo "🔎 Gap Detection:"

# Check for engine modules without corresponding data
ENGINE_MODULES=$(ls src/engine/*.ts 2>/dev/null | wc -l)
echo "  Engine modules: $ENGINE_MODULES"

# Check docs freshness
if [ -f "docs/dev-log/DEV-LOG.md" ]; then
  LAST_LOG=$(head -20 docs/dev-log/DEV-LOG.md | grep -m1 "^## " || echo "none")
  echo "  Last dev log: $LAST_LOG"
else
  echo "  ⚠️  No DEV-LOG.md found"
  GAPS_FOUND=$((GAPS_FOUND + 1))
fi

# Check for TODO/FIXME/HACK in codebase
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
  echo "  ⚠️  $TODO_COUNT files with TODO/FIXME markers"
fi

echo ""
if [ "$GAPS_FOUND" -gt 0 ]; then
  echo "Found $GAPS_FOUND gaps to address."
else
  echo "✅ No critical gaps detected."
fi
echo "=== Ready ==="
