import { includeIgnoreFile } from '@eslint/compat';
import feedicFlatConfig from '@feedic/eslint-config';
import { commonTypeScriptRules } from '@feedic/eslint-config/typescript';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import eslintConfigPrettier from 'eslint-config-prettier';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    ignores: ['eslint.config.{js,cjs,mjs}'],
  },
  ...feedicFlatConfig,
  eslintPluginJsdoc.configs['flat/recommended-typescript'],
  {
    rules: {
        "jsdoc/tag-lines": [
            2,
            "any",
            {
                "startLines": 1
            }
        ],
        "jsdoc/check-tag-names": [
            2,
            {
                "definedTags": [
                    "category"
                ]
            }
        ]
    },
  },
  {
    files: [
        "**/*.ts"
    ],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
          "sourceType": "module",
          "project": "./tsconfig.eslint.json"
      },
    },
    rules: {
      ...commonTypeScriptRules,
      "@typescript-eslint/prefer-nullish-coalescing": 0,
      "dot-notation": 0,
      "n/no-unsupported-features/es-builtins": 0,
      "unicorn/no-array-callback-reference": 0,
      "unicorn/no-array-reduce": 0,
      "unicorn/prefer-includes": 0,
      "unicorn/prevent-abbreviations": 0
    },
  },
  eslintConfigPrettier
]);
