import typescriptEslint from "@typescript-eslint/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.js", "**/*.cjs", "**/*.mjs"],
}, ...compat.extends("plugin:@typescript-eslint/strict"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "@stylistic": stylistic,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
            tsconfigRootDir: __dirname,
        },
    },

    rules: {
        eqeqeq: "error",
        "no-var": "error",
        "sort-imports": "error",
        "@stylistic/comma-dangle": ["error", "always-multiline"],
        "@stylistic/function-call-argument-newline": ["error", "consistent"],
        "@stylistic/function-paren-newline": ["error", "multiline"],
        "@stylistic/indent": ["error", 2],

        "@stylistic/max-len": ["error", {
            code: 120,
            tabWidth: 2,
        }],

        "@stylistic/no-multi-spaces": "error",

        "@stylistic/no-multiple-empty-lines": ["error", {
            max: 1,
        }],

        "@stylistic/no-tabs": "error",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/object-curly-spacing": ["error", "always"],
        "@stylistic/quotes": ["error", "single"],
        "@stylistic/semi": ["error", "never"],
        "@typescript-eslint/explicit-function-return-type": "error",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],
    },
}];
