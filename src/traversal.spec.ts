import { parseDOM } from "htmlparser2";
import type { Element } from "domhandler";
import { hasAttrib, nextElementSibling } from "./traversal";

describe("traversal", () => {
    describe("hasAttrib", () => {
        it("doesn't throw on text nodes", () => {
            const [firstNode] = parseDOM("textnode");

            expect(() =>
                hasAttrib(firstNode as never, "some-attrib")
            ).not.toThrow();
        });
    });

    describe("nextElementSibling", () => {
        it("return Element if found", () => {
            const dom = parseDOM(
                "<div><h1></h1>test<p></p></div>"
            )[0] as Element;
            const firstNode = dom.children[0];

            const next = nextElementSibling(firstNode) as Element;
            expect(next.tagName).toBe("p");
        });
        it("return null if not found", () => {
            const dom = parseDOM("<div><p></p>test</div>")[0] as Element;
            const firstNode = dom.children[0];

            expect(nextElementSibling(firstNode)).toBeNull();
        });
    });
});
