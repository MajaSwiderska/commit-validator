const { validateCommitMessage } = require('../src/spellcheck');
const { generateSuggestion } = require('../src/suggestions');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { threadName } = require('worker_threads');

const command = process.argv[2];

async function installHook() {
    const hookPath = path.join(process.cwd(), '.git/hooks/commit-msg');
    const hookContent = '#!/bin/sh
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

if [ "$SKIP_TYPO_CHECK" = "1" ]; then 
    exit 0
fi

node "$(pwd)/src/spellcheck.js" "$COMMIT_MSG"
if [ $? -ne 0 ]; then
    echo ""
    echo " Tip: Run with SKIP_TYPO_CHECK=1 git commit ... to bypass"
    exit 1
fi
exit 0
`;
    if (!fs.existsSync('.git')) {
        console.error('Not a git repository. Run 'git init' first.');
        process.exit(1);
    }

    fs.mkdirSync(path.dirname(hookPath), { recursive: true });
    fs.writeFileSync(hookPath, hookContent);
    fs.chmod(hookPath, '755');
    console.log('commit validator hook installed successfully!');
}

async function checkMessage() {
    const message = process.argv[3];
    if(!message) {
        console.error('Please provide a commit message to check');
        console.error('Usage: commit validator check "your message"');
        process.exit(1);
    }
    
    const typos = await validateCommitMessage(message);

    if(typos.length === 0) {
        console.log('No typos found!');
        
        if(process.env.GENERATE_EMOJI === '1') {
            const suggestion = generateSuggestion(message);
            console.log('\n Try this: ${suggestion}');
        }
        process.exit(0);
    } else {
        console.log('\n Found ${typos.length} potential typo(s):');
        typos.forEach((typo, index) => {
            console.log('  "${typo.original}" -> ${typo.suggestions.join(', ')}');
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
            console.log(`
commit-validator - Catch typos in git commit messages

Commands:
  install              Install git hook in current repository
  check "message"      Check a commit message for typos
  version              Show version number
  help                 Show this help

Environment variables:
  SKIP_TYPO_CHECK=1    Bypass typo check
  GENERATE_EMOJI=1     Show emoji suggestions

Examples:
  commit-validator install
  commit-validator check "fix teh bug"
  SKIP_TYPO_CHECK=1 git commit -m "emergency fix"
  GENERATE_EMOJI=1 commit-validator check "update docs"
`);
    }
}

main().catch(console.error);
