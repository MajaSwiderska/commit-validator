function generateSuggestion(message) {
    const firstWord = message.split(' ')[0].toLowerCase();
    
    const alternatives = {
        'fix': [
            `fix: ${message.substring(4)}`,
            `Fix ${message.substring(4)}`,
            `fix: resolve issue with ${message.substring(4)}`
        ],
        'add': [
            `feat: ${message.substring(4)}`,
            `Add ${message.substring(4)}`,
            `feat: implement ${message.substring(4)}`
        ],
        'update': [
            `chore: ${message.substring(7)}`,
            `Update ${message.substring(7)}`,
            `docs: revise ${message.substring(7)}`
        ],
        'remove': [
            `refactor: ${message.substring(7)}`,
            `Remove ${message.substring(7)}`,
            `chore: delete ${message.substring(7)}`
        ],
        'test': [
            `test: ${message.substring(5)}`,
            `Test ${message.substring(5)}`,
            `test: verify ${message.substring(5)}`
        ],
        'docs': [
            `docs: ${message.substring(5)}`,
            `Document ${message.substring(5)}`,
            `docs: update ${message.substring(5)}`
        ]
    };
    
    const defaultAlternatives = [
        `${message}`,
        `${message}`,
        `chore: ${message}`,
        `fix: ${message}`
    ];
    
    const options = alternatives[firstWord] || defaultAlternatives;
    const randomIndex = Math.floor(Math.random() * options.length);
    
    return options[randomIndex];
}

function formatMessage(message) {
    if (message[0] && message[0] === message[0].toLowerCase()) {
        message = message.charAt(0).toUpperCase() + message.slice(1);
    }
    
    if (message.length > 20 && !message.endsWith('.')) {
        message += '.';
    }
    
    return message;
}

function isConventionalCommit(message) {
    const patterns = [
        /^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?: .+/,
        /^(build|ci|revert|merge)(\(.+\))?: .+/
    ];
    return patterns.some(pattern => pattern.test(message));
}

function getSuggestionByType(message, type = 'default') {
    const suggestions = {
        'professional': `chore: ${message.toLowerCase()}`,
        'descriptive': `Update: ${message}`,
        'conventional': `feat: ${message.toLowerCase()}`,
        'simple': message
    };
    
    return suggestions[type] || suggestions.simple;
}

module.exports = { 
    generateSuggestion, 
    formatMessage, 
    isConventionalCommit,
    getSuggestionByType 
};