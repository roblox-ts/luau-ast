const { fixupPluginRules } = require("@eslint/compat");
const eslint = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const parser = require("@typescript-eslint/parser");
const noAutofix = require("eslint-plugin-no-autofix");
const prettier = require("eslint-plugin-prettier/recommended");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

module.exports = [
	{ ignores: ["out/**", "tests/**"] },
	eslint.configs.recommended,
	...tseslint.configs["flat/recommended"],
	prettier,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser,
			parserOptions: { project: "./tsconfig.json", ecmaFeatures: { jsx: true } },
		},
		plugins: { "no-autofix": fixupPluginRules(noAutofix), "simple-import-sort": simpleImportSort },
		rules: {
			"prettier/prettier": [
				"warn",
				{
					semi: true,
					trailingComma: "all",
					singleQuote: false,
					printWidth: 120,
					tabWidth: 4,
					useTabs: true,
					arrowParens: "avoid",
				},
			],
			"@typescript-eslint/array-type": ["warn", { default: "generic", readonly: "generic" }],
			"@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: true }],
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-require-imports": "error",
			"@typescript-eslint/no-unused-expressions": "warn",
			"@typescript-eslint/no-empty-object-type": "off",
			curly: ["warn", "multi-line", "consistent"],
			"no-autofix/prefer-const": "warn",
			"no-constant-condition": ["error", { checkLoops: false }],
			"no-debugger": "off",
			"no-empty": ["error", { allowEmptyCatch: true }],
			"no-extra-boolean-cast": "off",
			"no-undef-init": "error",
			"prefer-const": "off",
			"simple-import-sort/exports": "warn",
			"simple-import-sort/imports": "warn",
		},
	},
];
