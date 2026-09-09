import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import noAutofix from "eslint-plugin-no-autofix";
import prettier from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig(
	{ ignores: ["out/**", "tests/**"] },
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
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
);
