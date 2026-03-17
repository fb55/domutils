// Runs tests for feeds

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "htmlparser2";
import { describe, expect, test } from "vitest";
import { getFeed } from "./feeds.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const documents = path.join(__dirname, "__fixtures__", "Documents");

describe("getFeed", () => {
    for (const name of fs.readdirSync(documents)) {
        test(name, async () => {
            const file = await fs.promises.readFile(
                path.join(documents, name),
                "utf8",
            );
            const document = parseDocument(file, { xmlMode: true });
            const feed = getFeed(document.children);

            expect(feed).toMatchSnapshot();
        });
    }
});
