#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n commit-validator Demo\n');
console.log('=' .repeat(50));

const demoDir = path.join(process.cwd(), 'demo-repo');
if (fs.existsSync(demoDir)) {
    fs.rmSync(demoDir, {recursive: true });
}

fs.mkdirSync(demoDir);
process.chdir(demoDir);

console.log('\n Creating demo repositpry...');
execSync('git innit', { stdio: 'inherit'});

console.log('\n Testing good commit: ');
try {
    execSync('git commit -m "fix the button" --allow empty', {stdio: 'inherit' });
} catch(e) {}

console.log('\n Testing typo commit:');
try {
    execSync('git commit -m "fix teh button" --allow empty', {stdio: 'inherit' });
} catch(e) {
    console.log('\n[OK] (Blocked as expected)');
}

console.log('\n Testing bypass mode:');
try {
    execSync('SKIP_TYPO_CHECK=1 git commit -m "fix teh button" --allow-empty', { stdio: 'inherit' });
    console.log('[OK] Bypass worked');
} catch(e) {}

console.log('\n Testing emoji mode:');
try {
    execSync('GENERATE_EMOJI=1 node ../src/spellcheck.js "update documentation"', { stdio: 'inherit' });
} catch(e) {}

console.log('\n Cleaning up...');
process.chdir('../..');
fs.rmSync(demoDir, { recursive: true });

console.log('\n Demo complete!\n');
