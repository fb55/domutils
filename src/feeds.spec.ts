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

describe("getFeed Atom link", () => {
    test("takes the first alternate link in either spelling", () => {
        // eslint-disable-next-line unicorn/prefer-https -- RFC 4287 spells this relation with HTTP.
        const xml = `<feed><link rel="http://www.iana.org/assignments/relation/alternate" href="a"/><link rel="alternate" href="b"/></feed>`;
        const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
        expect(feed?.link).toBe("a");
    });

    test("falls back to the first direct link", () => {
        const xml = `<feed><entry><link rel="alternate" href="b"/></entry><link rel="self" href="a"/><link rel="edit" href="c"/></feed>`;
        const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
        expect(feed?.link).toBe("a");
    });
});
