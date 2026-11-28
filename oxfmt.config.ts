import { defineConfig } from "oxfmt";

export default defineConfig({
    printWidth: 80,
    tabWidth: 4,
    singleQuote: false,
    trailingComma: "all",
    sortImports: true,
    sortPackageJson: true,
    // Preserve the existing hidden-path exclusions, including .github.
    ignorePatterns: [".*"],
});
