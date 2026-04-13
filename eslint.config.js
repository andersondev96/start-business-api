const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '.git/**',
            '.vscode/**',
            'coverage/**',
            'tmp/**',
            'prisma/migrations/**',
            'src/database/test-client/**',
            '**/*.generated.ts',
        ],
    },
    {
        files: ['src/**/*.{js,ts}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-unused-vars': 'off',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-arrow-callback': 'warn',
            'no-multiple-empty-lines': ['warn', { max: 1 }],
            'no-trailing-spaces': 'warn',
            'comma-dangle': ['warn', 'always-multiline'],
            'object-curly-spacing': ['warn', 'always'],
            'array-bracket-spacing': ['warn', 'never'],
        },
    },
    {
        files: ['src/**/*/__tests__/**/*.{js,ts}', 'src/**/fakes/**/*.{js,ts}', 'src/**/Fakes/**/*.{js,ts}'],
        rules: {
            '@typescript-eslint/no-floating-promises': 'off',
        },
    },
    eslintConfigPrettier,
);
