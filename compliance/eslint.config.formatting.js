import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default options => ({
	languageOptions: { parser: tsParser },
	ignores: ['dist/**/*'],
	plugins: {
		tseslint,
		'@stylistic/ts': stylisticTs,
		'@stylistic/js': stylistic
	},
	rules: {
		'@typescript-eslint/member-ordering': [
			'error',
			{
				'default': [
					'signature',
					'field',
					'accessor',
					'constructor',

					'public-static-method',
					'public-abstract-method',
					'public-decorated-method',
					'public-instance-method',

					'protected-static-method',
					'protected-decorated-method',
					'protected-instance-method',
					'protected-abstract-method',

					'private-static-method',
					'#private-static-method',
					'private-decorated-method',
					'private-instance-method',
					'#private-instance-method'
				]
			}
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'default',
				format: ['camelCase'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: 'objectLiteralProperty',
				format: null,
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
					"selector": "enumMember",
					"format": ["PascalCase"]
			},
			{
				selector: 'import',
				format: [
					'camelCase',
					'PascalCase'
				]
			},

			{
				selector: 'variable',
				format: [
					'camelCase',
					'UPPER_CASE'
				],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},

			{
				selector: 'typeLike',
				format: ['PascalCase']
			},

			{
				selector: 'function',
				format: [
					'camelCase',
					'PascalCase'
				]
			},
			{
				selector: 'classProperty',
				modifiers: [
					'readonly',
					'static'
				],
				format: ['UPPER_CASE']
			}
		],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true
			}
		],
		'no-unreachable': 'error',
		'curly': [
			'error',
			'all'
		],
		'@stylistic/js/array-bracket-newline': [
			'error',
			{ minItems: 2 }
		],
		'@stylistic/js/array-bracket-spacing': [
			'error',
			'never'
		],
		'@stylistic/js/array-element-newline': [
			'error',
			'always'
		],
		'@stylistic/js/arrow-parens': [
			'error',
			'as-needed'
		],
		'@stylistic/js/arrow-spacing': [
			'error',
			{ before: true, after: true }
		],
		'@stylistic/js/block-spacing': 'error',
		'@stylistic/ts/brace-style': [
			'error',
			'1tbs'
		],
		'@stylistic/js/comma-dangle': [
			'error',
			'never'
		],
		'@stylistic/js/comma-spacing': [
			'error',
			{ before: false, after: true }
		],
		'@stylistic/js/comma-style': [
			'error',
			'last'
		],

		// 'computed-property-spacing'
		'@stylistic/js/eol-last': [
			'error',
			'always'
		],
		'@stylistic/js/function-call-argument-newline': [
			'error',
			'consistent'
		],
		'@stylistic/js/function-call-spacing': [
			'error',
			'never'
		],
		'@stylistic/js/function-paren-newline': [
			'error',
			'consistent'
		],
		'@stylistic/js/indent': [
			'error',
			'tab'
		],
		'@stylistic/js/jsx-quotes': [
			'error',
			'prefer-double'
		],
		'@stylistic/js/key-spacing': [
			'error',
			{
				beforeColon: false,
				afterColon: true,
				mode: 'strict'
			}
		],
		'@stylistic/js/keyword-spacing': [
			'error',
			{
				before: true,
				after: true
			}
		],
		'@stylistic/js/line-comment-position': [
			'error',
			{ position: 'above' }
		],
		'@stylistic/js/linebreak-style': [
			'error',
			'unix'
		],
		'@stylistic/js/lines-around-comment': [
			'error',
			{
				beforeBlockComment: true,
				allowBlockStart: true,
				allowBlockEnd: true,
				allowClassStart: true,
				allowClassEnd: true,
				allowObjectStart: true,
				allowObjectEnd: true,
				allowArrayStart: true,
				allowArrayEnd: true,
				afterHashbangComment: true
			}
		],
		'@stylistic/js/lines-between-class-members': [
			'error',
			{
				enforce: [
					{ blankLine: 'always', prev: '*', next: 'method' },
					{ blankLine: 'always', prev: 'method', next: '*' },
					{ blankLine: 'always', prev: 'method', next: 'method' },
					{ blankLine: 'never', prev: 'field', next: 'field' }
				]
			}
		],
		'@stylistic/js/max-len': [
			'error',
			{
				code: 120,
				comments: 120,
				ignoreRegExpLiterals: true,
				ignorePattern: '\\s*eslint-.*'
			}
		],
		'@stylistic/js/max-statements-per-line': [
			'error',
			{ max: 1 }
		],
		'@stylistic/js/multiline-comment-style': [
			'error',
			'starred-block'
		],
		'@stylistic/js/multiline-ternary': [
			'error',
			'always'
		],
		'@stylistic/js/new-parens': 'error',
		'@stylistic/js/newline-per-chained-call': [
			'error',
			{ ignoreChainWithDepth: 1 }
		],
		'@stylistic/js/no-confusing-arrow': 'off',
		'@stylistic/js/no-extra-parens': 'error',
		'@stylistic/js/no-extra-semi': 'error',
		'@stylistic/js/no-floating-decimal': 'error',
		'@stylistic/js/no-mixed-operators': 'error',
		'@stylistic/js/no-mixed-spaces-and-tabs': 'error',
		'@stylistic/js/no-multi-spaces': 'error',
		'@stylistic/js/no-multiple-empty-lines': [
			'error',
			{
				max: 1,
				maxEOF: 1,
				maxBOF: 0
			}
		],
		'@stylistic/js/no-tabs': [
			'error',
			{ allowIndentationTabs: true }
		],
		'@stylistic/js/no-trailing-spaces': 'error',
		'@stylistic/js/no-whitespace-before-property': 'error',
		'@stylistic/js/nonblock-statement-body-position': 'off',
		'@stylistic/ts/object-curly-newline': [
			'error',
			{ consistent: true }
		],
		'@stylistic/js/object-curly-spacing': [
			'error',
			'always'
		],
		'@stylistic/js/object-property-newline': [
			'error',
			{ allowAllPropertiesOnSameLine: true }
		],
		'@stylistic/js/one-var-declaration-per-line': [
			'error',
			'always'
		],
		'@stylistic/js/operator-linebreak': [
			'error',
			'before'
		],
		'@stylistic/js/padded-blocks': [
			'error',
			'never'
		],
		'@stylistic/js/padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: '*', next: 'return' },
			{ blankLine: 'always', prev: '*', next: 'for' },
			{ blankLine: 'always', prev: '*', next: 'do' },
			{ blankLine: 'always', prev: '*', next: 'while' },
			{ blankLine: 'any', prev: '*', next: 'if' },
			{ blankLine: 'always', prev: '*', next: 'switch' },
			{ blankLine: 'always', prev: '*', next: 'try' },
			{ blankLine: 'always', prev: '*', next: 'with' },
			{ blankLine: 'always', prev: '*', next: 'function' }
		],
		'@stylistic/js/quote-props': [
			'error',
			'consistent-as-needed',
			{ keywords: true }
		],
		'@stylistic/js/quotes': [
			'error',
			'single'
		],
		'@stylistic/js/rest-spread-spacing': [
			'error',
			'never'
		],
		'@stylistic/js/semi': [
			'error',
			'always'
		],
		'@stylistic/js/semi-spacing': [
			'error',
			{ before: false, after: true }
		],
		'@stylistic/js/semi-style': [
			'error',
			'last'
		],
		'@stylistic/js/space-before-blocks': [
			'error',
			'always'
		],
		'@stylistic/js/space-before-function-paren': [
			'error',
			{ anonymous: 'always', named: 'never', asyncArrow: 'always' }
		],
		'@stylistic/js/space-in-parens': [
			'error',
			'never'
		],
		'@stylistic/js/space-infix-ops': [
			'error',
			{ int32Hint: false }
		],
		'@stylistic/js/space-unary-ops': 'error',
		'@stylistic/js/spaced-comment': [
			'error',
			'always'
		],
		'@stylistic/js/switch-colon-spacing': [
			'error',
			{ after: true, before: false }
		],
		'@stylistic/js/template-curly-spacing': [
			'error',
			'never'
		],
		'@stylistic/js/template-tag-spacing': [
			'error',
			'never'
		],
		'@stylistic/js/wrap-iife': [
			'error',
			'inside',
			{ functionPrototypeMethods: true }
		],
		'@stylistic/js/wrap-regex': 'off',
		'@stylistic/js/yield-star-spacing': [
			'error',
			'after'
		]
	}
});
