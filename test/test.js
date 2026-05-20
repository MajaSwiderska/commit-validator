const { validateCommitMessage, findSuggestions } = require('../src/spellcheck');
const { generateSuggestion } = require('../src/suggestions');

async function runTests() {
    console.log('Running tests...\n');

    const tests = [
        {msg: "fix teh bug", expectedTypos: 1, description: "Catches 'teh'"},
        { msg: "recieve data", expectedTypos: 1, description: "Catches 'recieve'" },
        { msg: "perfect commit", expectedTypos: 0, description: "Accepts good message" },
        { msg: "fix wierd bug", expectedTypos: 1, description: "Catches 'wierd'" },
        { msg: "", expectedTypos: 0, description: "Handles empty message" }
    ];

    let passed = 0;

    for (const test of tests) {
        const typos = await validateCommitMessage(test.msg);
        const passedTest = typos.length === test.expectedTypos;

        if (passedTest) {
            console.log('${test.description}');
            passed++;
        } else {
            console.log(`${test.description} - Expected ${test.expectedTypos} typos, got ${typos.length}`);
        }    
    }

    const suggestion = generateSuggestion("fix the bug");
    if (suggestion.includes("fix") && (suggestion.includes("🐛") || suggestion.includes("🔧"))) {
        console.log("Suggestion generator works");
        passed++;
    } else {
        console.log("Suggestion generator failed");
    }
    
    console.log(`\n Results: ${passed}/${tests.length + 1} tests passed`);
}

runTests();