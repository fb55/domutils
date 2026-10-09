import { includeIgnoreFile } from '@eslint/compat';
import feedicFlatConfig from '@feedic/eslint-config';
import { commonTypeScriptRules } from '@feedic/eslint-config/typescript';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import eslintConfigBiome from 'eslint-config-biome';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    ignores: ['eslint.config.{js,cjs,mjs}'],
  },
  ...feedicFlatConfig,
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
      "n/no-unsupported-features/es-builtins": 0,
      "unicorn/no-array-callback-reference": 0,
      "unicorn/no-array-reduce": 0,
      "unicorn/prefer-includes": 0
    },
  },
  eslintConfigBiome,
// These nodes implement domhandler APIs, not the browser DOM.
{
    "files": [
        "**/*.ts"
    ],
    "rules": {
        "unicorn/better-dom-traversing": "off"
    }
},
// Keep the conventional fixture directory name while checking other paths.
{
    "files": [
        "**/*.ts"
    ],
    "rules": {
        "unicorn/filename-case": [
            "error",
            {
                "ignore": [
                    "^__fixtures__$"
                ]
            }
        ]
    }
},
// Preserve established public predicate names and selector vocabulary.
{
    "files": [
        "src/feeds.ts",
        "src/legacy.ts",
        "src/querying.ts"
    ],
    "rules": {
        "unicorn/consistent-boolean-name": "off"
    }
},
// Feed attributes have dynamic names and numeric fields permit parseInt prefix parsing.
{
    "files": [
        "src/feeds.ts"
    ],
    "rules": {
        "unicorn/no-computed-property-existence-check": "off",
        "unicorn/prefer-number-coercion": "off"
    }
},
// Keep the ancestor scan inline with the node-removal loop.
{
    "files": [
        "src/helpers.ts"
    ],
    "rules": {
        "unicorn/no-break-in-nested-loop": "off"
    }
},
// Preserve tree traversal behavior in the established stringification helpers.
{
    "files": [
        "src/stringify.ts"
    ],
    "rules": {
        "unicorn/no-useless-recursion": "off"
    }
},

// Biome enforces the Number namespace for these constants.
{
    "files": [
        "**/*.ts"
    ],
    "rules": {
        "unicorn/prefer-global-number-constants": "off"
    }
},
// Preserve the existing exported type and function names.
{
    "files": [
        "src/legacy.ts",
        "src/traversal.ts"
    ],
    "rules": {
        "unicorn/name-replacements": [
            "error",
            {
                "allowList": {
                    "TestElementOpts": true,
                    "prevElementSibling": true
                }
            }
        ]
    }
},
]);
