import { parseDocument } from "htmlparser2";
import { expect, test } from "vitest";
import { getFeed } from "./feeds.js";

test("Atom entries inside extension content are not feed entries", () => {
    const xml = `<feed><entry><id>outer</id><content type="application/xml"><entry xmlns="urn:example:data"><id>embedded</id></entry></content></entry><entry><id>second</id></entry></feed>`;
    const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
    expect(feed?.items.map((item) => item.id)).toEqual(["outer", "second"]);
});

test("RSS items inside extensions are not channel items", () => {
    const xml = `<rss><channel><item><guid>outer</guid><extension xmlns="urn:example:data"><item><guid>embedded</guid></item></extension></item><item><guid>second</guid></item></channel></rss>`;
    const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
    expect(feed?.items.map((item) => item.id)).toEqual(["outer", "second"]);
});

test("RDF items are direct children of the document element", () => {
    const xml =
        "<rdf:RDF><channel><title>Feed</title></channel><item><title>outer</title><extension><item><title>embedded</title></item></extension></item></rdf:RDF>";
    const feed = getFeed(parseDocument(xml, { xmlMode: true }).children);
    expect(feed?.items.map((item) => item.title)).toEqual(["outer"]);
    expect(feed?.title).toBe("Feed");
});
