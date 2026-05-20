const fs = require('fs');
const path = require('path');
const readline = require('readline');
const typos = require('./typos.json');

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <- b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j-1] === b[i-1] ? 0 : 1;
            matrix[i][j] = Math.min (
                matric[i-1][j] + 1,
                matrix[i][j-1] + 1,
                matrix[i-1][j-1] + cost
            );
        }
    }
    return matrix[b.length][a.length];
}

function findSuggestions(word) {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length < 3) return [];

    if (typos[cleanWord]) {
        return [typos[cleanWord]];
    }
    const suggestions = [];
    for (const [typo, correction] of Object.entries(typos)) {
        const distance = levenshteinDistance(cleanWord, typo);
        if (distance === 1 || (distance === 2 && cleanWord.length > 4)) {
            suggestions.push(correction);
        }
    }
    return [...new Set(suggestions)];
}

async function validateCommitMessage(commitMsg) {
    const words = commitMsg.split(/\s+/);
    const typosFound = [];

    for (const word of words) {
        const suggestions = findSuggestions(word);
        if (suggestions.length > 0) {
            typosFound.push({ original: word, suggestions });
        }
    }
    return typosFound;
}

async function main() {
    const commitMsg = process.argv[2];

    if(!commitMsg) {
        console.error('[ERROR] No commit message provided.');
        console.error('Usage: commit validator "your commit message"');
        process.exit(1);
    }

    if (process.env.SKIP_TYPO_CHECK === '1') {
        console.log('Typo check skipped');
        process.exit(0);
    }

    const typosFound = await validateCommitMessage(commitMsg);
    if (typosFound.length === 0) {
        console.log('[OK]Commit message looks good!');
        process.exit(0);
    }

    console.log('\n[WARNING] Potential typos found:\n');
    for (const typo of typosFound) {
        console.log('  "${typo.original}" -> did you mean: ${typo.suggestions.join(', ')}?');
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await new Promise(resolve => {
        rl.question('\n Accept as-is? (y/n/edit) ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() === 'y') {
        console.log('[WARNING] Okay, commiting with typos...');
        process.exit(0);
    } else if (answer.toLowerCase() === 'edit') {
        console.log('\n Edit your message and run git commit again');
        process.exit(1);
    } else {
        console.log('\n[ERROR] Commit aborted. Fix typos and try again.');
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(err => {
        console.error('Spellcheck error:', err);
        process.exit(1);
    });
}

module.exports = { validateCommitMessage, findSuggestions };