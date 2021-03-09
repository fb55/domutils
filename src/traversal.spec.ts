import { parseDOM } from "htmlparser2";
import type { Element } from "domhandler";
import {
    getSiblings,
    hasAttrib,
    nextElementSibling,
    prevElementSibling,
} from "./traversal";

describe("traversal", () => {
    describe("getSiblings", () => {
        it("returns an element's siblings", () => {
            const dom = parseDOM("<div><h1></h1><p><p><p></div>")[0] as Element;

            expect(getSiblings(dom.children[1])).toHaveLength(4);
        });

        it("returns a root element's siblings", () => {
            const dom = parseDOM("<h1></h1><p><p><p>") as Element[];

            expect(getSiblings(dom[2])).toHaveLength(4);
        });
    });

    describe("hasAttrib", () => {
        it("doesn't throw on text nodes", () => {
            const [firstNode] = parseDOM("textnode");

            expect(() =>
                hasAttrib(firstNode as never, "some-attrib")
            ).not.toThrow();
        });

        it("returns `false` for Object prototype properties", () => {
            const dom = parseDOM(
                "<div><h1></h1>test<p></p></div>"
            )[0] as Element;

            expect(hasAttrib(dom, "constructor")).toBeFalsy();
        });
    });

    describe("nextElementSibling", () => {
        it("return Element if found", () => {
            const dom = parseDOM(
                "<div><h1></h1>test<p></p></div>"
            )[0] as Element;
            const firstNode = dom.children[0];

            const next = nextElementSibling(firstNode);
            expect(next?.tagName).toBe("p");
        });
        it("return null if not found", () => {
            const dom = parseDOM("<div><p></p>test</div>")[0] as Element;
            const firstNode = dom.children[0];

            expect(nextElementSibling(firstNode)).toBeNull();
        });
        it("does not ignore script tags", () => {
            const dom = parseDOM(
                "<div><p></p><script></script><p></div>"
            )[0] as Element;
            const firstNode = dom.children[0];

            const next = nextElementSibling(firstNode);
            expect(next?.tagName).toBe("script");
        });
    });

    describe("prevElementSibling", () => {
        it("return Element if found", () => {
            const dom = parseDOM(
                "<div><h1></h1>test<p></p></div>"
            )[0] as Element;
            const lastNode = dom.children[2];

            const prev = prevElementSibling(lastNode);
            expect(prev?.tagName).toBe("h1");
        });
        it("return null if not found", () => {
            const dom = parseDOM("<div>test<p></p></div>")[0] as Element;
            const lastNode = dom.children[1];

            expect(nextElementSibling(lastNode)).toBeNull();
        });
        it("does not ignore script tags", () => {
            const dom = parseDOM(
                "<div><p></p><script></script><p></p></div>"
            )[0] as Element;
            const lastNode = dom.children[2];

            const prev = prevElementSibling(lastNode);
            expect(prev?.tagName).toBe("script");
        });
    });
});
