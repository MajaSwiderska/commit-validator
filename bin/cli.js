#!/usr/bin/env node

const { validateCommitMessage } = require('../src/spellcheck');
const { generateSuggestion } = require('../src/suggestions');
const fs = require('fs');
const path = require('path');

const command = process.argv[2];

async function installHook() {
    const hookPath = path.join(process.cwd(), '.git/hooks/commit-msg');
    const hookContent = '#!/bin/sh\n' +
    'COMMIT_MSG_FILE=$1\n' +
    'COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")\n' +
    '\n' +
    'if [ "$SKIP_TYPO_CHECK" = "1" ]; then \n' +
    '    exit 0\n' +
    'fi\n' +
    '\n' +
    'node "$(pwd)/src/spellcheck.js" "$COMMIT_MSG"\n' +
    'if [ $? -ne 0 ]; then\n' +
    '    echo ""\n' +
    '    echo " Tip: Run with SKIP_TYPO_CHECK=1 git commit ... to bypass"\n' +
    '    exit 1\n' +
    'fi\n' +
    'exit 0\n' ;

    if (!fs.existsSync('.git')) {
        console.error('[ERROR] Not a git repository. Run 'git init' first.');
        process.exit(1);
    }

    fs.mkdirSync(path.dirname(hookPath), { recursive: true });
    fs.writeFileSync(hookPath, hookContent);

    try {
    fs.chmod(hookPath, '755');
    } catch(e) {
    }
    console.log('[OK] commit validator hook installed successfully!');
}

async function checkMessage() {
    const message = process.argv[3];
    if(!message) {
        console.error('[ERROR] Please provide a commit message to check');
        console.error('Usage: commit validator check "your message"');
        process.exit(1);
    }
    
    const typos = await validateCommitMessage(message);

    if(typos.length === 0) {
        console.log('[OK] No typos found!');
        
        if(process.env.SUGGEST_MODE === '1') {
            const suggestion = generateSuggestion(message);
            console.log('\nTip: Try this: ' + suggestion);
        }
        process.exit(0);
    } else {
        console.log('\n Found ' + typos.length + ' potential typo(s):');
        typos.forEach((typo) => {
            console.log('  "' + typo.original + '" -> ' + typo.suggestions.join(', '));
        });
        process.exit(1);
    }
}

async function main() {
    switch(command) {
        case 'install':
            await installHook();
            break;
        case 'check':
            await checkMessage();
            break;
        case 'version':
            console.log('commit-validator v1.0.0');
            break;
        case 'help':
        default:
            console.log('\ncommit-validator - Catch typos in git commit messages\n');
            console.log('Commands:');
            console.log('  install              Install git hook in current repository');
            console.log('  check "message"      Check a commit message for typos');
            console.log('  version              Show version number');
            console.log('  help                 Show this help\n');
            console.log('Environment variables:');
            console.log('  SKIP_TYPO_CHECK=1    Bypass typo check');
            console.log('  SUGGEST_MODE=1       Show suggestions\n');
            console.log('Examples:');
            console.log('  commit-validator install');
            console.log('  commit-validator check "fix teh bug"');
            console.log('  SKIP_TYPO_CHECK=1 git commit -m "emergency fix"');
            console.log('  SUGGEST_MODE=1 commit-validator check "update docs"\n');
    }
}

main().catch(console.error);
