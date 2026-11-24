import { parseDocument } from "htmlparser2";
import { expect, test } from "vitest";
import { getFeed } from "./feeds.js";

test("RSS 1.0 retains the RDF identifier independently of the link", () => {
    const xml = `<rdf:RDF><channel/><item rdf:about="urn:entry:1"><title>First</title><link>https://example.com/first</link></item><item rdf:about="urn:entry:2"><title>Second</title></item></rdf:RDF>`;
    const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
    expect(feed?.items[0].id).toBe("urn:entry:1");
    expect(feed?.items[0].link).toBe("https://example.com/first");
    expect(feed?.items[1].id).toBe("urn:entry:2");
});

test("RSS GUIDs still take precedence when provided", () => {
    const xml = `<rdf:RDF><channel/><item rdf:about="urn:rdf:1"><guid>explicit-guid</guid></item><item><title>No identifier</title></item></rdf:RDF>`;
    const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
    expect(feed?.items[0].id).toBe("explicit-guid");
    expect(feed?.items[1].id).toBeUndefined();
});

test("RSS 2.0 does not treat arbitrary RDF attributes as GUIDs", () => {
    const xml = `<rss><channel><item rdf:about="urn:extra:1"><title>No GUID</title></item></channel></rss>`;
    const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
    expect(feed?.items[0].id).toBeUndefined();
});
