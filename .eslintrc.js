module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        "react",
        "react-hooks",
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    rules: {
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
    }
};