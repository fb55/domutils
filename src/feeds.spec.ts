// Runs tests for feeds

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "htmlparser2";
import { describe, expect, test } from "vitest";
import { getFeed } from "./index.js";

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

    test.each([
        {
            value: "false",
            isSecondDefault: true,
            expected: [false, true, false],
        },
        {
            value: "FALSE",
            isSecondDefault: true,
            expected: [false, true, false],
        },
        {
            value: "FaLsE",
            isSecondDefault: true,
            expected: [false, true, false],
        },
        {
            value: "true",
            isSecondDefault: false,
            expected: [true, false, false],
        },
        {
            value: "TRUE",
            isSecondDefault: false,
            expected: [true, false, false],
        },
        {
            value: "TrUe",
            isSecondDefault: false,
            expected: [true, false, false],
        },
        {
            value: undefined,
            isSecondDefault: true,
            expected: [false, true, false],
        },
    ])(
        "reads media default flags for $value",
        ({ value, isSecondDefault, expected }) => {
            const attribute =
                value === undefined ? "" : ` isDefault="${value}"`;
            const secondAttribute = isSecondDefault ? ' isDefault="true"' : "";
            const document = parseDocument(
                `<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
                <channel>
                    <title>Audio feed</title>
                    <link>https://example.com/</link>
                    <description>Three encodings of the same recording.</description>
                    <item>
                        <title>Recording</title>
                        <media:group>
                            <media:content url="https://example.com/recording-64.mp3" type="audio/mpeg" bitrate="64"${attribute} />
                            <media:content url="https://example.com/recording-128.mp3" type="audio/mpeg" bitrate="128"${secondAttribute} />
                            <media:content url="https://example.com/recording.wav" type="audio/x-wav" />
                        </media:group>
                    </item>
                </channel>
            </rss>`,
                { xmlMode: true },
            );
            const media = getFeed(document.children)?.items[0].media;

            expect(media?.map(({ url }) => url)).toEqual([
                "https://example.com/recording-64.mp3",
                "https://example.com/recording-128.mp3",
                "https://example.com/recording.wav",
            ]);
            expect(media?.map(({ type }) => type)).toEqual([
                "audio/mpeg",
                "audio/mpeg",
                "audio/x-wav",
            ]);
            expect(media?.map(({ bitrate }) => bitrate)).toEqual([
                64,
                128,
                undefined,
            ]);
            expect(media?.map(({ isDefault }) => isDefault)).toEqual(expected);
        },
    );
});
