import { parseDocument } from "htmlparser2";
import { describe, expect, test } from "vitest";
import { getFeed } from "./feeds.js";

// RFC 4287 defines this exact namespace URI.
const ATOM_NAMESPACE = "http://www.w3.org/2005/Atom";

function readFeed(xml: string) {
    return getFeed(parseDocument(xml, { xmlMode: true }).children);
}

describe("Atom namespaces", () => {
    test.each(["", "atom", "other"])("reads the %j prefix", (prefix) => {
        const tag = prefix ? `${prefix}:` : "";
        const declaration = prefix ? `xmlns:${prefix}` : "xmlns";
        const xml = `<${tag}feed ${declaration}="${ATOM_NAMESPACE}">
            <${tag}id>urn:example:feed</${tag}id>
            <${tag}title>Example feed</${tag}title>
            <${tag}subtitle>Feed description</${tag}subtitle>
            <${tag}updated>2026-11-25T01:00:00Z</${tag}updated>
            <${tag}author><${tag}email>alice@example.test</${tag}email></${tag}author>
            <${tag}link rel="self" href="https://example.test/feed"/>
            <${tag}link href="https://example.test/"/>
            <${tag}entry>
                <${tag}id>urn:example:item</${tag}id>
                <${tag}title>First entry</${tag}title>
                <${tag}summary>Entry description</${tag}summary>
                <${tag}updated>2026-11-24T12:00:00Z</${tag}updated>
                <${tag}link rel="self" href="https://example.test/item.xml"/>
                <${tag}link rel="alternate" href="https://example.test/item"/>
            </${tag}entry>
        </${tag}feed>`;

        expect(readFeed(xml)).toEqual({
            type: "atom",
            id: "urn:example:feed",
            title: "Example feed",
            description: "Feed description",
            updated: new Date("2026-11-25T01:00:00Z"),
            author: "alice@example.test",
            link: "https://example.test/",
            items: [
                {
                    id: "urn:example:item",
                    title: "First entry",
                    description: "Entry description",
                    pubDate: new Date("2026-11-24T12:00:00Z"),
                    link: "https://example.test/item",
                    media: [],
                },
            ],
        });
    });

    test("uses a namespace declared on an ancestor of the feed", () => {
        const xml = `<wrapper xmlns:a="${ATOM_NAMESPACE}">
            <a:feed><a:title>Inherited</a:title></a:feed>
        </wrapper>`;
        expect(readFeed(xml)).toEqual({
            type: "atom",
            title: "Inherited",
            items: [],
        });
    });

    test("allows different prefixes and local default namespace declarations", () => {
        const xml = `<feed xmlns="${ATOM_NAMESPACE}" xmlns:a="${ATOM_NAMESPACE}">
            <a:title>Feed title</a:title>
            <a:entry>
                <b:title xmlns:b="${ATOM_NAMESPACE}">Entry title</b:title>
                <content xmlns="${ATOM_NAMESPACE}">Entry content</content>
                <a:link href="https://example.test/item"/>
            </a:entry>
        </feed>`;
        expect(readFeed(xml)).toEqual({
            type: "atom",
            title: "Feed title",
            items: [
                {
                    title: "Entry title",
                    description: "Entry content",
                    link: "https://example.test/item",
                    media: [],
                },
            ],
        });
    });

    test("respects namespace rebinding and excludes foreign metadata", () => {
        const xml = `<feed xmlns="${ATOM_NAMESPACE}" xmlns:a="${ATOM_NAMESPACE}">
            <title xmlns="urn:example:extension">Foreign title</title>
            <title xmlns="">Unqualified title</title>
            <a:title xmlns:a="urn:example:extension">Rebound title</a:title>
            <title>Atom title</title>
            <entry xmlns="urn:example:extension"><title>Foreign entry</title></entry>
            <a:entry xmlns:a="urn:example:extension"><a:title>Rebound entry</a:title></a:entry>
            <a:entry><a:title>Atom entry</a:title></a:entry>
        </feed>`;
        expect(readFeed(xml)).toEqual({
            type: "atom",
            title: "Atom title",
            items: [{ title: "Atom entry", media: [] }],
        });
    });

    test.each(["", 'xmlns:a="urn:example:extension"'])(
        "does not accept a prefixed feed without an Atom binding: %s",
        (declaration) => {
            expect(
                readFeed(
                    `<a:feed ${declaration}><a:title>Other</a:title></a:feed>`,
                ),
            ).toBeNull();
        },
    );

    test.each([
        '<feed xmlns="urn:example:extension"><title>Other</title></feed>',
        '<wrapper xmlns="urn:example:extension"><feed><title>Other</title></feed></wrapper>',
    ])("rejects a foreign default namespace: %s", (xml) => {
        expect(readFeed(xml)).toBeNull();
    });

    test.each([
        '<wrapper xmlns="urn:example:extension"><feed xmlns=""><title>Legacy</title></feed></wrapper>',
        `<wrapper xmlns="${ATOM_NAMESPACE}"><inner xmlns=""><feed><title>Legacy</title></feed></inner></wrapper>`,
    ])("honors the nearest default namespace reset: %s", (xml) => {
        expect(readFeed(xml)).toEqual({
            type: "atom",
            title: "Legacy",
            items: [],
        });
    });

    test("preserves legacy unnamespaced Atom and RSS input", () => {
        expect(readFeed("<feed><title>Legacy</title></feed>")).toEqual({
            type: "atom",
            title: "Legacy",
            items: [],
        });
        expect(
            readFeed("<rss><channel><title>RSS</title></channel></rss>"),
        ).toEqual({
            type: "rss",
            id: "",
            title: "RSS",
            items: [],
        });
    });

    test("preserves iterative feed discovery in a deeply nested document", () => {
        const xml =
            "<wrapper>".repeat(15_000) +
            "<feed><title>Deep</title></feed>" +
            "</wrapper>".repeat(15_000);
        expect(readFeed(xml)).toEqual({
            type: "atom",
            title: "Deep",
            items: [],
        });
    });
});
