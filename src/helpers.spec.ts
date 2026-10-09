import { type Document, Element } from "domhandler";
import { parseDocument } from "htmlparser2";
import { beforeEach, describe, expect, it } from "vitest";
import {
    compareDocumentPosition,
    removeSubsets,
    uniqueSort,
} from "./helpers.js";

/**
 * Counts array reads to detect repeated membership scans.
 *
 * @param nodes Nodes to instrument.
 * @returns The instrumented array and its read count.
 */
function countReads(nodes: Element[]): [Element[], () => number] {
    let reads = 0;
    const proxy = new Proxy(nodes, {
        get(target, property, receiver) {
            reads++;
            return Reflect.get(target, property, receiver);
        },
    });
    return [proxy, () => reads];
}

describe("helpers", () => {
    describe("removeSubsets", () => {
        it("does not repeatedly walk shared ancestors", () => {
            let parent = new Element("div", {});
            let reads = 0;
            for (let depth = 0; depth < 1000; depth++) {
                const ancestor = parent;
                parent = new Element("div", {});
                Object.defineProperty(parent, "parent", {
                    get() {
                        reads++;
                        return ancestor;
                    },
                });
            }
            const leaves = Array.from({ length: 1000 }, () => {
                const leaf = new Element("p", {});
                leaf.parent = parent;
                return leaf;
            });
            expect(removeSubsets([...leaves])).toStrictEqual(leaves);
            expect(reads).toBeLessThan(3000);
        });

        const dom = parseDocument("<div><p><span></span></p><p></p></div>")
            .children[0] as Element;

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
                removeSubsets([dom.children[0], dom.children[1]]),
            ).toHaveLength(2));

        it("Handles large arrays in linear time", () => {
            const divs = parseDocument("<div><p></p></div>".repeat(500))
                .children as Element[];
            const ps = divs.map((div) => div.children[0] as Element);
            const [nodes, reads] = countReads([...ps, ...divs, ...divs]);

            expect(removeSubsets(nodes)).toStrictEqual(divs);
            expect(reads()).toBeLessThan(10 * nodes.length);
        });
    });

    describe("compareDocumentPosition", () => {
        const markup = "<div><p><span></span></p><a></a></div>";
        const dom = parseDocument(markup).children[0] as Element;
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
            const otherDom = parseDocument(markup).children[0] as Element;
            const other = (otherDom.children[0] as Element).children[0];

            expect(compareDocumentPosition(span, other)).toBe(1);
        });

        it("reports when the nodes are identical", () =>
            expect(compareDocumentPosition(span, span)).toBe(0));

        it("does not end up in infinite loop (#109)", () => {
            const dom = parseDocument("<div><span>1</span><span>2</span></div>")
                .children[0] as Element;

            expect(
                compareDocumentPosition(
                    dom.children[0],
                    (dom.children[0] as Element).children[0],
                ),
            ).toBe(10);
        });

        it("reports the correct order when a sibling is a comment", () => {
            const dom = parseDocument("<div><p></p><!--c--><a></a></div>")
                .children[0] as Element;
            const [p, comment, a] = dom.children;

            expect(compareDocumentPosition(p, comment)).toBe(2);
            expect(compareDocumentPosition(comment, p)).toBe(4);
            expect(compareDocumentPosition(comment, a)).toBe(2);
            expect(compareDocumentPosition(a, comment)).toBe(4);
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

        it("sorts a comment sibling into document order", () => {
            const withComment = parseDocument(
                "<div><p></p><!--c--><a></a></div>",
            ).children[0] as Element;
            const [firstP, comment, lastA] = withComment.children;

            expect(uniqueSort([lastA, comment, firstP])).toStrictEqual([
                firstP,
                comment,
                lastA,
            ]);
        });

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

        it("removes duplicates from large arrays in linear time", () => {
            const detached = Array.from(
                { length: 1000 },
                () => new Element("p", {}),
            );
            const [nodes, reads] = countReads([...detached, ...detached]);

            expect(uniqueSort(nodes)).toHaveLength(detached.length);
            expect(reads()).toBeLessThan(10 * nodes.length);
        });
    });
});
