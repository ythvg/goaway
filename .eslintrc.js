module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "srcipt"
    },
    "rules": {
        "no-console": ["error", {
            "allow": ["warn", "error", "info"]
        }],
        "indent": [
            "error",
            2
        ],
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};