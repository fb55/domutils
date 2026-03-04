import type { Element } from "domhandler";
import { parseDOM } from "htmlparser2";
import {
    getAttributeValue,
    getName,
    getSiblings,
    hasAttrib,
    nextElementSibling,
    prevElementSibling as previousElementSibling,
} from "./traversal";

describe("traversal", () => {
    describe("getSiblings", () => {
        it("returns an element's siblings", () => {
            const dom = parseDOM("<div><h1></h1><p><p><p></div>")[0] as Element;

            expect(getSiblings(dom.children[1])).toHaveLength(4);
        });

        it("returns a root element's siblings", () => {
            const dom = parseDOM("<h1></h1><p><p><p>") as Element[];

            for (const node of dom) {
                node.parent = null;
            }

            expect(getSiblings(dom[2])).toHaveLength(4);
        });
    });

    describe("hasAttrib", () => {
        it("doesn't throw on text nodes", () =>
            expect(() =>
                hasAttrib(parseDOM("textnode")[0] as never, "some-attrib"),
            ).not.toThrow());

        it("returns `false` for Object prototype properties", () =>
            expect(
                hasAttrib(
                    parseDOM("<div><h1></h1>test<p></p></div>")[0] as Element,
                    "constructor",
                ),
            ).toBeFalsy());

        it('should return `false` for "null" values', () => {
            const div = parseDOM("<div class=test>")[0] as Element;

            expect(hasAttrib(div, "class")).toBeTruthy();

            div.attribs.class = null as never;

            expect(hasAttrib(div, "class")).toBeFalsy();
        });
    });

    describe("nextElementSibling", () => {
        it("return Element if found", () => {
            const dom = parseDOM(
                "<div><h1></h1>test<p></p></div>",
            )[0] as Element;
            const firstNode = dom.children[0];

            const next = nextElementSibling(firstNode);
            expect(next).toHaveProperty("tagName", "p");
        });
        it("return null if not found", () => {
            const dom = parseDOM("<div><p></p>test</div>")[0] as Element;
            const firstNode = dom.children[0];

            expect(nextElementSibling(firstNode)).toBeNull();
        });
        it("does not ignore script tags", () => {
            const dom = parseDOM(
                "<div><p></p><script></script><p></div>",
            )[0] as Element;
            const firstNode = dom.children[0];

            const next = nextElementSibling(firstNode);
            expect(next).toHaveProperty("tagName", "script");
        });
    });

    describe("prevElementSibling", () => {
        it("return Element if found", () => {
            const dom = parseDOM(
                "<div><h1></h1>test<p></p></div>",
            )[0] as Element;
            const lastNode = dom.children[2];

            const previous = previousElementSibling(lastNode);
            expect(previous).toHaveProperty("tagName", "h1");
        });
        it("return null if not found", () => {
            const dom = parseDOM("<div>test<p></p></div>")[0] as Element;
            const lastNode = dom.children[1];

            expect(previousElementSibling(lastNode)).toBeNull();
        });
        it("does not ignore script tags", () => {
            const dom = parseDOM(
                "<div><p></p><script></script><p></p></div>",
            )[0] as Element;
            const lastNode = dom.children[2];

            const previous = previousElementSibling(lastNode);
            expect(previous).toHaveProperty("tagName", "script");
        });
    });

    describe("getAttributeValue", () => {
        it("returns the attribute value", () =>
            expect(
                getAttributeValue(
                    parseDOM("<div class='test'>")[0] as Element,
                    "class",
                ),
            ).toBe("test"));
        it("returns undefined if attribute does not exist", () =>
            expect(
                getAttributeValue(parseDOM("<div>")[0] as Element, "id"),
            ).toBeUndefined());
        it("should return undefined if a random node is passed", () =>
            expect(
                getAttributeValue(parseDOM("TEXT")[0] as never, "id"),
            ).toBeUndefined());
    });

    describe("getName", () => {
        it("returns the name of the element", () =>
            expect(getName(parseDOM("<div>")[0] as Element)).toBe("div"));
        it("should return undefined if a random node is passed", () =>
            expect(getName(parseDOM("TEXT")[0] as never)).toBeUndefined());
    });
});
