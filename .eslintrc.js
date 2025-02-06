module.exports = {
	env: {
		browser: true,

		commonjs: true,

		es2021: true,

		node: true,
	},

	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

	overrides: [],

	parser: '@typescript-eslint/parser',

	parserOptions: {
		ecmaVersion: 'latest',
	},

	plugins: ['@typescript-eslint'],

	rules: {
		indent: ['error', 'tab'],

		quotes: ['error', 'single'],

		semi: ['error', 'never'],

		'@typescript-eslint/no-var-requires': [0],

		'no-unused-vars': [1, { args: 'after-used', argsIgnorePattern: '^_' }],
	},
}
