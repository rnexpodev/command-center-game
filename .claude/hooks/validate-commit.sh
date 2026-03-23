#!/bin/bash
# Commit Validation Hook — Checks code quality before commits
# Inspired by Claude Code Game Studios validate-commit pattern
# Adapted for Urban Command Center engine/UI structure

ERRORS=0
WARNINGS=0

echo "=== Commit Validation ==="

# Get staged files
STAGED=$(git diff --cached --name-only 2>/dev/null)
if [ -z "$STAGED" ]; then
  echo "No staged files to validate."
  exit 0
fi

# 1. Check engine files for magic numbers
ENGINE_FILES=$(echo "$STAGED" | grep "^src/engine/")
if [ -n "$ENGINE_FILES" ]; then
  echo "🔧 Checking engine files..."

  for f in $ENGINE_FILES; do
    if [ -f "$f" ]; then
      # Magic numbers (excluding 0, 1, -1, common constants, and array indices)
      MAGIC=$(grep -nE '= [0-9]{2,}[^x]|[><=] [0-9]{2,}' "$f" 2>/dev/null | grep -vE 'const |// |TICK|PHASE|Duration|Timer|Score|Weight|Modifier|Speed|Rate|Threshold|MAX_|MIN_|DEFAULT_' | head -5)
      if [ -n "$MAGIC" ]; then
        echo "  ⚠️  $f — possible magic numbers (consider named constants):"
        echo "$MAGIC" | sed 's/^/    /'
        WARNINGS=$((WARNINGS + 1))
      fi

      # React imports in engine
      REACT_IMPORT=$(grep -n "from 'react\|from \"react\|import React" "$f" 2>/dev/null)
      if [ -n "$REACT_IMPORT" ]; then
        echo "  ❌ $f — React import in engine module!"
        echo "$REACT_IMPORT" | sed 's/^/    /'
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done
fi

# 2. Check UI files for missing Hebrew / RTL issues
UI_FILES=$(echo "$STAGED" | grep "^src/components/.*\.tsx$")
if [ -n "$UI_FILES" ]; then
  echo "🎨 Checking UI files..."

  for f in $UI_FILES; do
    if [ -f "$f" ]; then
      # Hardcoded English text (excluding className, imports, comments)
      ENGLISH=$(grep -nE "'[A-Z][a-z]+ [a-z]+'" "$f" 2>/dev/null | grep -vE 'className|import|//|console\.|key=' | head -3)
      if [ -n "$ENGLISH" ]; then
        echo "  ⚠️  $f — possible hardcoded English text (should be Hebrew):"
        echo "$ENGLISH" | sed 's/^/    /'
        WARNINGS=$((WARNINGS + 1))
      fi

      # Left/Right instead of Start/End (RTL issue)
      LR=$(grep -nE 'margin-left|margin-right|padding-left|padding-right|text-left|text-right|float: left|float: right' "$f" 2>/dev/null | grep -vE '//' | head -3)
      if [ -n "$LR" ]; then
        echo "  ⚠️  $f — LTR-specific CSS (use logical properties for RTL):"
        echo "$LR" | sed 's/^/    /'
        WARNINGS=$((WARNINGS + 1))
      fi
    fi
  done
fi

# 3. Check data files for enum usage (violates erasableSyntaxOnly)
DATA_FILES=$(echo "$STAGED" | grep "^src/.*\.ts$")
if [ -n "$DATA_FILES" ]; then
  echo "📦 Checking TypeScript patterns..."

  for f in $DATA_FILES; do
    if [ -f "$f" ]; then
      ENUM=$(grep -n "^export enum \|^enum " "$f" 2>/dev/null)
      if [ -n "$ENUM" ]; then
        echo "  ❌ $f — enum detected (use 'as const' objects for erasableSyntaxOnly):"
        echo "$ENUM" | sed 's/^/    /'
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done
fi

# 4. Check for forgotten debug code
DEBUG_FILES=$(echo "$STAGED" | grep "\.tsx\?$")
if [ -n "$DEBUG_FILES" ]; then
  for f in $DEBUG_FILES; do
    if [ -f "$f" ]; then
      DEBUG=$(grep -n "console\.log\|debugger\|console\.debug" "$f" 2>/dev/null | grep -vE "// debug|// keep" | head -3)
      if [ -n "$DEBUG" ]; then
        echo "  ⚠️  $f — debug statements found:"
        echo "$DEBUG" | sed 's/^/    /'
        WARNINGS=$((WARNINGS + 1))
      fi
    fi
  done
fi

# 5. Check for hardcoded map coordinates (should reference city.ts)
COORD_FILES=$(echo "$STAGED" | grep "\.tsx\?$" | grep -v "src/data/city\.ts\|src/data/base-locations\.ts\|src/data/population\.ts")
if [ -n "$COORD_FILES" ]; then
  for f in $COORD_FILES; do
    if [ -f "$f" ]; then
      COORDS=$(grep -nE '31\.[0-9]{2,}|34\.[0-9]{2,}' "$f" 2>/dev/null | grep -vE '// coord|import|from' | head -3)
      if [ -n "$COORDS" ]; then
        echo "  ⚠️  $f — hardcoded Beer Sheva coordinates (reference city.ts):"
        echo "$COORDS" | sed 's/^/    /'
        WARNINGS=$((WARNINGS + 1))
      fi
    fi
  done
fi

# Summary
echo ""
echo "=== Results ==="
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"

if [ "$ERRORS" -gt 0 ]; then
  echo "❌ Commit validation failed — fix errors above."
  exit 1
fi

if [ "$WARNINGS" -gt 0 ]; then
  echo "⚠️  Commit has warnings — review before proceeding."
fi

echo "✅ Validation passed."
exit 0
