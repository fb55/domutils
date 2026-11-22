import { readFileSync } from "node:fs";
import { globbySync } from "globby";
import { visit } from "jsonc-parser";

const paths = globbySync("**/*.json", {
    gitignore: true,
    ignore: ["**/node_modules/**", "**/package-lock.json"],
});

for (const path of paths) {
    const objects: Set<string>[] = [];

    visit(readFileSync(path, "utf8"), {
        onObjectBegin() {
            objects.push(new Set());
        },
        onObjectProperty(key, _offset, _length, line) {
            const keys = objects.at(-1)!;
            if (keys.has(key)) {
                throw new Error(`${path}:${line + 1}: Duplicate key ${key}`);
            }
            keys.add(key);
        },
        onObjectEnd() {
            objects.pop();
        },
    });
}
