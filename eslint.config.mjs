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
  // Retain the conventional fixture directory while checking other names.
  {
    files: ["src/__fixtures__/fixture.ts"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          ignore: ["^__fixtures__$"],
        },
      ],
    },
  },

  // Preserve the exported API name.
  {
    files: ["src/legacy.ts"],
    rules: {
      "unicorn/name-replacements": [
        "error",
        {
          allowList: {
            TestElementOpts: true,
          },
        },
      ],
    },
  },

  // Preserve the exported API name.
  {
    files: ["src/traversal.ts"],
    rules: {
      "unicorn/name-replacements": [
        "error",
        {
          allowList: {
            prevElementSibling: true,
          },
        },
      ],
    },
  },

  // These fixtures use domhandler nodes; browser querySelector and firstElementChild APIs do not apply.
  {
    files: [
      "src/helpers.spec.ts",
      "src/legacy.spec.ts",
      "src/manipulation.spec.ts",
      "src/querying.spec.ts",
      "src/traversal.spec.ts",
    ],
    rules: {
      "unicorn/better-dom-traversing": "off",
    },
  },

  // Use the Number namespace required by the existing Biome configuration.
  {
    files: ["src/legacy.ts", "src/querying.spec.ts", "src/querying.ts"],
    rules: {
      "unicorn/prefer-global-number-constants": "off",
    },
  },
]);
