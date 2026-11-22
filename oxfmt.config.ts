import { defineConfig } from "oxfmt";

export default defineConfig({
    printWidth: 80,
    tabWidth: 4,
    singleQuote: false,
    trailingComma: "all",
    // Keep source-map line numbers stable when sorting the existing imports.
    sortImports: { newlinesBetween: false },
    sortPackageJson: true,
    // Preserve the existing hidden-path exclusions, including .github.
    ignorePatterns: [".*"],
});
