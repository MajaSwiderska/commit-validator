#!/bin/bash

if [ -f ".git/hooks/commit-msg" ]; then
    rm .git/hooks/commit-msg
    echo "commit-validator uninstalled"
else
    echo "commit-validator not found in this repository"
fi