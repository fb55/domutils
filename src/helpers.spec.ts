import { parseDOM, parseDocument } from "htmlparser2";
import { removeSubsets, compareDocumentPosition, uniqueSort } from "./helpers";
import type { Element, Document } from "domhandler";

describe("helpers", () => {
    describe("removeSubsets", () => {
        const dom = parseDOM(
            "<div><p><span></span></p><p></p></div>"
        )[0] as Element;

        it("removes identical trees", () =>
            expect(removeSubsets([dom, dom])).toHaveLength(1));

        it("Removes subsets found first", () => {
            const firstChild = dom.children[0] as Element;
            const matches = removeSubsets([dom, firstChild.children[0]]);
            expect(matches).toHaveLength(1);
        });

        it("Removes subsets found last", () =>
            expect(removeSubsets([dom.children[0], dom])).toHaveLength(1));

        it("Does not remove unique trees", () =>
            expect(
                removeSubsets([dom.children[0], dom.children[1]])
            ).toHaveLength(2));
    });

    describe("compareDocumentPosition", () => {
        const markup = "<div><p><span></span></p><a></a></div>";
        const dom = parseDOM(markup)[0] as Element;
        const p = dom.children[0] as Element;
        const span = p.children[0];
        const a = dom.children[1];

        it("reports when the first node occurs before the second indirectly", () =>
            expect(compareDocumentPosition(span, a)).toBe(2));

        it("reports when the first node contains the second", () =>
            expect(compareDocumentPosition(p, span)).toBe(10));

        it("reports when the first node occurs after the second indirectly", () =>
            expect(compareDocumentPosition(a, span)).toBe(4));

        it("reports when the first node is contained by the second", () =>
            expect(compareDocumentPosition(span, p)).toBe(20));

        it("reports when the nodes belong to separate documents", () => {
            const otherDom = parseDOM(markup)[0] as Element;
            const other = (otherDom.children[0] as Element).children[0];

            expect(compareDocumentPosition(span, other)).toBe(1);
        });

        it("reports when the nodes are identical", () =>
            expect(compareDocumentPosition(span, span)).toBe(0));

        it("does not end up in infinite loop (#109)", () => {
            const dom = parseDOM(
                "<div><span>1</span><span>2</span></div>"
            )[0] as Element;

            expect(
                compareDocumentPosition(
                    dom.children[0],
                    (dom.children[0] as Element).children[0]
                )
            ).toBe(10);
        });
    });

    describe("uniqueSort", () => {
        let root: Document;
        let dom: Element;
        let p: Element;
        let span: Element;
        let a: Element;

        beforeEach(() => {
            root = parseDocument("<div><p><span></span></p><a></a></div>");
            [dom] = root.children as Element[];
            [p, a] = dom.children as Element[];
            [span] = p.children as Element[];
        });

        it("leaves unique elements untouched", () =>
            expect(uniqueSort([p, a])).toStrictEqual([p, a]));

        it("removes duplicate elements", () =>
            expect(uniqueSort([p, a, p])).toStrictEqual([p, a]));

        it("sorts nodes in document order", () =>
            expect(uniqueSort([a, dom, span, p])).toStrictEqual([
                dom,
                p,
                span,
                a,
            ]));
        it("puts the document node in the right spot", () =>
            expect(uniqueSort([a, dom, span, root, p])).toStrictEqual([
                root,
                dom,
                p,
                span,
                a,
            ]));
    });
});
