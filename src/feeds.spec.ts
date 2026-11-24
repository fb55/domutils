// Runs tests for feeds

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "htmlparser2";
import { describe, expect, test } from "vitest";
import { getFeed } from "./feeds.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const documents = path.join(__dirname, "__fixtures__", "Documents");

function parseAtom(contents: string) {
    const xml = `<feed xmlns="http://www.w3.org/2005/Atom"><id>urn:example:feed</id><title>Feed</title><updated>2026-01-01T00:00:00Z</updated>${contents}</feed>`;
    return getFeed(parseDocument(xml, { xmlMode: true }).children);
}

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

describe("getFeed Atom author", () => {
    const contributor =
        "<contributor><name>Contributor</name><email>contributor@example.com</email></contributor>";
    const entry =
        "<entry><id>urn:example:entry</id><title>Entry</title><updated>2026-01-01T00:00:00Z</updated><author><name>Entry author</name><email>entry@example.com</email></author></entry>";

    test.each([
        ["contributor", contributor],
        ["entry author", entry],
    ])("does not use an earlier %s as the feed author", (_name, contents) => {
        const feed = parseAtom(
            `${contents}<author><name>Feed author</name><email> feed@example.com </email></author>`,
        );
        expect(feed?.author).toBe("feed@example.com");
    });

    test.each([
        ["contributor", contributor],
        ["entry author", entry],
    ])(
        "does not borrow %s email when the feed author has none",
        (_name, contents) => {
            const feed = parseAtom(
                `${contents}<author><name>Feed author</name></author>`,
            );
            expect(feed).not.toHaveProperty("author");
        },
    );

    test("does not promote an entry author when the feed has no author", () => {
        expect(parseAtom(entry)).not.toHaveProperty("author");
    });

    test("takes the first email among direct feed authors", () => {
        const feed = parseAtom(
            "<author><name>No email</name></author><author><name>First</name><email>first@example.com</email></author><author><name>Second</name><email>second@example.com</email></author>",
        );
        expect(feed?.author).toBe("first@example.com");
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
