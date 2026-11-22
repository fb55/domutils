import { builtinModules } from "node:module";
import { defineConfig } from "oxlint";
import manifest from "./package.json" with { type: "json" };

const dependencyGroups: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
} = manifest;
const publishedImports = [
    "**",
    "!./**",
    "!../**",
    ...[
        manifest.name,
        ...Object.keys({
            ...dependencyGroups.dependencies,
            ...dependencyGroups.optionalDependencies,
            ...dependencyGroups.peerDependencies,
        }),
    ].map((name) => `!${name}{,/**}`),
];
const toolingImports = [
    ...publishedImports,
    "!node:*{,/**}",
    ...[
        ...builtinModules,
        ...Object.keys(dependencyGroups.devDependencies ?? {}),
    ].map((name) => `!${name}{,/**}`),
];

/**
 * Rules turned off (each group says why they do not fit this code).
 *
 * @param rules The names of the rules.
 * @returns The rules, each turned off.
 */
const off = (...rules: string[]): Record<string, "off"> =>
    Object.fromEntries(rules.map((rule) => [rule, "off"]));

export default defineConfig({
    plugins: [
        "eslint",
        "typescript",
        "unicorn",
        "oxc",
        "import",
        "jsdoc",
        "node",
        "promise",
        "vitest",
    ],
    // Oxlint has no built-in check for function-local regex allocation.
    // Enable all stable rule categories.
    categories: {
        correctness: "error",
        suspicious: "error",
        pedantic: "error",
        perf: "error",
        style: "error",
        restriction: "error",
    },
    options: { typeAware: true, reportUnusedDisableDirectives: "error" },
    rules: {
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: toolingImports,
                        message:
                            "Declare tooling dependencies in package.json before importing them.",
                    },
                ],
            },
        ],
        "jsdoc/check-tag-names": ["error", { definedTags: ["category"] }],
        eqeqeq: ["error", "smart"],
        "one-var": ["error", "never"],
        "func-style": ["error", "declaration", { allowArrowFunctions: true }],
        "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
        "prefer-destructuring": ["error", { object: true, array: false }],
        "capitalized-comments": [
            "error",
            "always",
            // (Lines continuing a comment continue its sentence.)
            { ignorePattern: "oxfmt-ignore", ignoreConsecutiveComments: true },
        ],
        yoda: ["error", "never"],
        curly: ["error", "multi-line"],
        "no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "unicorn/numeric-separators-style": [
            "error",
            { hexadecimal: { onlyIfContainsSeparator: true } },
        ],
        "typescript/explicit-member-accessibility": [
            "error",
            { accessibility: "no-public" },
        ],
        "typescript/explicit-function-return-type": [
            "error",
            { allowExpressions: true },
        ],
        "typescript/no-confusing-void-expression": [
            "error",
            { ignoreArrowShorthand: true },
        ],
        "typescript/no-unnecessary-condition": [
            "error",
            { allowConstantLoopConditions: "only-allowed-literals" },
        ],
        "typescript/switch-exhaustiveness-check": [
            "error",
            { considerDefaultExhaustiveForUnions: true },
        ],
        "vitest/consistent-test-filename": [
            "error",
            { pattern: String.raw`\.spec\.ts$` },
        ],
        "vitest/consistent-test-it": ["error", { fn: "it" }],
        // Array offsets, traversal limits, and position flags are intentional literals.
        ...off("no-magic-numbers", "id-length"),
        // Passing these callbacks directly avoids wrapper functions.
        ...off("unicorn/no-array-callback-reference"),
        // Null and undefined are part of the public traversal and query APIs.
        ...off("unicorn/no-null", "no-undefined"),
        // Modern syntax and the runtime's features are fine.
        ...off(
            "oxc/no-async-await",
            "oxc/no-optional-chaining",
            "oxc/no-rest-spread-properties",
            "no-plusplus",
            "no-continue",
            "no-ternary",
            "no-nested-ternary",
            "unicorn/no-nested-ternary",
            "unicorn/no-array-reduce",
            "no-await-in-loop",
            "promise/avoid-new",
            "promise/prefer-await-to-then",
            "node/no-top-level-await",
            "node/no-sync",
            "import/no-nodejs-modules",
            "unicorn/import-style",
        ),
        // Use the type-aware rule so returning an existing promise also counts.
        "require-await": "off",
        "typescript/require-await": "error",
        // Sizes, and orders that do not follow the code's structure.
        ...off(
            "max-params",
            "max-statements",
            "max-lines",
            "max-lines-per-function",
            "max-classes-per-file",
            "unicorn/max-nested-calls",
            "sort-keys",
            "no-use-before-define",
            "no-inline-comments",
            "init-declarations",
        ),
        // Title capitalization and test padding do not affect assertions.
        ...off(
            "vitest/prefer-lowercase-title",
            "vitest/padding-around-test-blocks",
        ),
        // Nullish equality is allowed by eqeqeq's smart mode.
        ...off("no-eq-null"),
        // Keep the existing import and export order and module structure.
        ...off(
            "sort-imports",
            "import/consistent-type-specifier-style",
            "import/no-named-export",
            "import/no-default-export",
            "import/prefer-default-export",
            "import/group-exports",
            "import/exports-last",
            "import/no-relative-parent-imports",
        ),
        // The formatter writes hex digits in lowercase.
        ...off("unicorn/number-literal-case"),
        // TypeScript has the types (and infers them for readonly values and assertions).
        ...off(
            "jsdoc/require-param-type",
            "jsdoc/require-returns-type",
            "jsdoc/require-returns",
            "jsdoc/require-yields-type",
            "jsdoc/require-throws-type",
            "typescript/prefer-readonly-parameter-types",
            "typescript/no-unsafe-type-assertion",
            "typescript/no-non-null-assertion",
            "typescript/promise-function-async",
        ),
        // Method signatures, mapped types, `{}` and type aliases are chosen for how they check and infer.
        ...off(
            "typescript/method-signature-style",
            "typescript/consistent-indexed-object-style",
            "typescript/consistent-type-definitions",
            "typescript/ban-types",
            "no-redeclare",
        ),
        // Functions converting values declare the types they convert.
        ...off("unicorn/prefer-native-coercion-functions"),
        // Keep Vitest's default timeouts, explicit imports, and direct assertions.
        ...off(
            "vitest/require-test-timeout",
            "vitest/prefer-expect-assertions",
            "vitest/no-importing-vitest-globals",
            "vitest/prefer-describe-function-title",
        ),
        // Existing suites share setup and use structural and truthiness assertions.
        ...off(
            "vitest/no-hooks",
            "vitest/prefer-strict-equal",
            "vitest/prefer-strict-boolean-matchers",
            "vitest/max-expects",
            "vitest/prefer-to-be-truthy",
            "vitest/prefer-to-be-falsy",
        ),
    },
    overrides: [
        {
            // The published DOM utilities also run in browsers.
            files: ["src/**/*.ts"],
            excludeFiles: ["**/*.spec.ts", "src/__fixtures__/**"],
            rules: {
                "import/no-nodejs-modules": "error",
                "no-restricted-imports": [
                    "error",
                    {
                        patterns: [
                            {
                                group: publishedImports,
                                message:
                                    "Published source may only import runtime dependencies.",
                            },
                        ],
                    },
                ],
            },
        },
        {
            // These functions reuse their local parameter bindings during traversal.
            files: ["src/helpers.ts", "src/legacy.ts", "src/querying.ts"],
            rules: off("no-param-reassign"),
        },
        {
            // Keep const enum position flags inlined.
            files: ["src/helpers.ts"],
            rules: off("oxc/no-const-enum", "no-bitwise"),
        },
        {
            // Preserve the existing indexed reads and empty-list fallback.
            files: ["src/manipulation.ts", "src/traversal.ts"],
            rules: off(
                "unicorn/prefer-at",
                "typescript/prefer-nullish-coalescing",
            ),
        },
        {
            // Feed parsing treats empty strings as absent and keeps its existing coercions.
            files: ["src/feeds.ts"],
            rules: {
                "no-implicit-coercion": ["error", { allow: ["!!"] }],
                "typescript/strict-boolean-expressions": [
                    "error",
                    { allowNullableString: true },
                ],
                "typescript/explicit-function-return-type": [
                    "error",
                    {
                        allowExpressions: true,
                        allowedNames: [
                            "getAtomFeed",
                            "getRssFeed",
                            "addConditionally",
                            "isValidFeed",
                        ],
                    },
                ],
                ...off("unicorn/prefer-string-slice"),
                "typescript/no-deprecated": [
                    "error",
                    { allow: [{ from: "lib", name: "substr" }] },
                ],
            },
        },
        {
            // Legacy serializers still call each other and have direct regression tests.
            files: ["src/stringify.ts", "src/stringify.spec.ts"],
            rules: {
                "no-shadow": ["error", { allow: ["node"] }],
                ...off("curly"),
                "typescript/no-deprecated": [
                    "error",
                    {
                        allow: [
                            {
                                from: "file",
                                name: [
                                    "getOuterHTML",
                                    "getInnerHTML",
                                    "getText",
                                ],
                            },
                        ],
                    },
                ],
            },
        },
        {
            // Test helpers use inferred return types, mock types, and local type guards.
            files: ["**/*.spec.ts"],
            rules: off(
                "typescript/explicit-function-return-type",
                "vitest/require-mock-type-parameters",
                "unicorn/consistent-function-scoping",
            ),
        },
        {
            // Names come from fixture files and identify existing snapshots.
            files: ["src/feeds.spec.ts"],
            rules: {
                ...off(
                    "vitest/prefer-each",
                    "vitest/valid-title",
                    "vitest/no-conditional-in-test",
                ),
                "vitest/consistent-test-it": ["error", { fn: "test" }],
            },
        },
    ],
});
