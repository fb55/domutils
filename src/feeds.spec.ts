// Runs tests for feeds

import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "htmlparser2";
import { describe, expect, test } from "vitest";
import { getFeed } from "./feeds.js";

const documents = path.join(import.meta.dirname, "__fixtures__", "Documents");

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
        // RFC 4287 spells this relation with HTTP.
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

describe("getFeed media content", () => {
    test("preserves fractional rates and durations", () => {
        const xml = `<rss><channel><item><media:content bitrate="128.5" framerate="29.97" samplingrate="44.1" duration="185.25" fileSize="12345" channels="2" height="720" width="1280"/></item></channel></rss>`;

        const media = getFeed(parseDocument(xml, { xmlMode: true }).children)
            ?.items[0].media[0];

        // Entries, so that the property order is checked too.
        expect(Object.entries(media ?? {})).toEqual(
            Object.entries({
                medium: undefined,
                isDefault: false,
                fileSize: 12_345,
                bitrate: 128.5,
                framerate: 29.97,
                samplingrate: 44.1,
                channels: 2,
                duration: 185.25,
                height: 720,
                width: 1280,
            }),
        );
    });
});
