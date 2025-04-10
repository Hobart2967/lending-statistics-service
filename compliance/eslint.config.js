import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

import formatting from './eslint.config.formatting.js';
import linting from './eslint.config.linting.js';

export default options => [
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
	},
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	...tseslint.configs.recommended,
	formatting(options),
	linting(options),
	{ ignores: ['dist/**/*.{js,mjs,cjs,ts}'], }
];
