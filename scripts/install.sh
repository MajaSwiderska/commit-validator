#!/bin/bash

echo "Installing commit-validator..."

chmod +x bin/cli.js

if [ "$1" == "--global" ]; then
    npm link
    echo"Installed globally! Run 'commit-validator install' in any repo"
else
    if [ -d ".git" ]; then
        node bin/cli.js install
    else
        echo "No git repository found. Run 'git init' first, then 'npm run install-hook'"
        fi
    fi