module.exports = {
	/* 'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'quotes': [
			'error',
			'single'
		]
	},
	'parser': 'babel-eslint' */
	env: {
		es6: true,
		node: true,
		commonjs: true,
	},
	'parser': 'babel-eslint',
	extends: ['eslint:recommended'],
	parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
	ignorePatterns: ['./node_modules/', './.vscode/*', './logs/', './.git/*'],
	rules: {
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-mixed-spaces-and-tabs': 'error',
		'no-unused-vars': ['error', { 'vars': 'all', 'args': 'none'}]
	},
};
