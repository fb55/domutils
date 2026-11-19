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

describe("getFeed media content", () => {
    test("preserves fractional rates and durations", () => {
        const xml = `<rss><channel><item><media:content bitrate="128.5" framerate="29.97" samplingrate="44.1" duration="185.25" fileSize="12345" channels="2" height="720" width="1280"/></item></channel></rss>`;

        expect(
            getFeed(parseDocument(xml, { xmlMode: true }).children)?.items[0]
                .media[0],
        ).toEqual({
            medium: undefined,
            isDefault: false,
            bitrate: 128.5,
            framerate: 29.97,
            samplingrate: 44.1,
            duration: 185.25,
            fileSize: 12_345,
            channels: 2,
            height: 720,
            width: 1280,
        });
    });
});
