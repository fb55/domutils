import { parseDocument } from "htmlparser2";
import { describe, expect, test } from "vitest";
import { getFeed } from "./feeds.js";

describe("Atom entry publication dates", () => {
    test("prefers published to the later entry update", () => {
        const xml =
            "<feed><updated>2024-06-10T12:00:00Z</updated><entry><updated>2024-06-09T12:00:00Z</updated><published>2024-01-02T03:04:05Z</published></entry></feed>";
        const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
        expect(feed?.items[0].pubDate).toEqual(
            new Date("2024-01-02T03:04:05Z"),
        );
        expect(feed?.updated).toEqual(new Date("2024-06-10T12:00:00Z"));
    });

    test("reads published when the entry has no updated element", () => {
        const xml =
            "<feed><entry><published>2024-01-02T03:04:05Z</published></entry></feed>";
        const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
        expect(feed?.items[0].pubDate).toEqual(
            new Date("2024-01-02T03:04:05Z"),
        );
    });

    test.each(["", "<published> </published>"])(
        "keeps updated as a fallback for %s",
        (published) => {
            const xml = `<feed><entry>${published}<updated>2024-06-09T12:00:00Z</updated></entry></feed>`;
            const feed = getFeed(
                parseDocument(xml, { xmlMode: true }).children,
            );
            expect(feed?.items[0].pubDate).toEqual(
                new Date("2024-06-09T12:00:00Z"),
            );
        },
    );

    test("does not take a publication date from entry content", () => {
        const xml =
            "<feed><entry><content><published>2024-01-02T03:04:05Z</published></content></entry></feed>";
        const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
        expect(feed?.items[0]).not.toHaveProperty("pubDate");
    });
});
