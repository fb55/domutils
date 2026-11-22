import { readFileSync } from "node:fs";
import { visit } from "jsonc-parser";

for (const path of [
    "package.json",
    "tsconfig.json",
    "tsconfig.build.json",
    "typedoc.json",
]) {
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
