import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config({
	files: [
		'server.js',
		'eslint.config.js'
	],
	extends: [
		stylistic.configs['recommended-flat'],
		...tseslint.configs.strict,
		...tseslint.configs.stylistic,
		eslint.configs.recommended
	],
	plugins: {
		'@stylistic': stylistic,
		tseslint
	},
	...tseslint.configs.disableTypeChecked,
	rules: {
		'@typescript-eslint/no-require-imports': 'off',
		'@stylistic/arrow-parens': ['error', 'as-needed'],
		'@stylistic/block-spacing': 'error',
		'@stylistic/comma-dangle': ['error', 'never'],
		'@stylistic/eol-last': ['error', 'never'],
		'@stylistic/indent': ['error', 'tab'],
		'@stylistic/max-statements-per-line': 'error',
		'@stylistic/member-delimiter-style': ['error', { multiline: { delimiter: 'semi' } }],
		'@stylistic/no-tabs': 'off',
		'@stylistic/quotes': ['error', 'single'],
		'@stylistic/semi': ['error', 'always']
	}
},
{
	languageOptions: {
		globals: {
			...globals.node,
			...globals.browser
		}
	}
});