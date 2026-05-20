#!/bin/sh
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

if [ "$SKIP_TYPO_CHECK" = "1" ]; then
    exit 0
fi

node "{{PWD}}/src/spellcheck.js" "COMMIT_MSG"
if [ $? -ne 0 ]; then
    echo ""
    echo "Tip: Run with SKIP_TYPO_CHECK=1 git commit ... to bypass"
    exit 1
fi
exit 0