// Runs tests for feeds

import { getFeed } from "./feeds";
import fs from "fs";
import path from "path";
import { parseDocument } from "htmlparser2";

const documents = path.join(__dirname, "__fixtures__", "Documents");

describe("getFeed", () => {
    for (const name of fs.readdirSync(documents)) {
        test(name, async () => {
            const file = await fs.promises.readFile(
                path.join(documents, name),
                "utf8"
            );
            const document = parseDocument(file, { xmlMode: true });
            const feed = getFeed(document.children);

            expect(feed).toMatchSnapshot();
        });
    }
});
