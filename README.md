# commit-validator

A pre-commit hook that catches typos in your git commit messages.

# Features

- Detects 25+ common typos (teh, recieve, seperate, wierd, etc.)
- Fuzzy matching finds typos not in the dictionary
- Interactive prompt asks for confirmation
- Emergency bypass with SKIP_TYPO_CHECK=1
- Suggestion mode with SUGGEST_MODE=1
- Works on Windows, Mac, and Linux

# Installation

git clone https://github.com/yourusername/commit-validator.git
cd commit-validator
npm link
cd your-project
commit-validator install

# Usage

git commit -m "fix teh bug"

Output:
[WARNING] Potential typos found:
  "teh" -> did you mean: the?
Accept as-is? (y/n/edit)

# Commands
Command	                                Description
commit-validator install	              Install git hook
commit-validator check "message"	      Check message for typos
commit-validator version	              Show version
commit-validator help	                  Show help

# Environment Variables
Variable                   Description
SKIP_TYPO_CHECK=1	         Bypass typo check
SUGGEST_MODE=1	           Show suggestions

# Examples

Manual check:
commit-validator check "fix teh bug"

With suggestions:
SUGGEST_MODE=1 commit-validator check "fix the bug"

Bypass check:
SKIP_TYPO_CHECK=1 git commit -m "fix teh bug"

# Development

npm test
npm run demo

# Project Structure

commit-validator/
├── bin/cli.js
├── src/
│   ├── spellcheck.js
│   ├── suggestions.js
│   └── typos.json
├── templates/hook-template.sh
├── test/test.js
└── demo/demo.js

# Adding Custom Typos

{
  "teh": "the",
  "recieve": "receive"
}

# Uninstall

rm .git/hooks/commit-msg
npm unlink

# Future Plans
- Add support for multiple languages (Spanish, French, German)
- Integrate with GitHub Actions for PR title validation
- Create VS Code extension for real-time commit message checking
- Add machine learning for context-aware suggestions
- Support for custom typo dictionaries per project
- Add statistics dashboard for most common typos
- Integrate with Jira/Linear for ticket number validation
- Add team configuration sharing via .commit-validatorrc
