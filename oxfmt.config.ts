import { defineConfig } from "oxfmt";

export default defineConfig({
    printWidth: 80,
    tabWidth: 4,
    singleQuote: false,
    trailingComma: "all",
    sortImports: false,
    sortPackageJson: false,
    ignorePatterns: [".*"],
});
