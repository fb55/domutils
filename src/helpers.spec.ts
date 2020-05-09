import { makeDom } from "./__fixtures__/utils";
import * as helpers from "./helpers";
import * as assert from "assert";
import { Element } from "domhandler";

describe("helpers", () => {
    describe("removeSubsets", () => {
        const { removeSubsets } = helpers;
        const dom = makeDom(
            "<div><p><span></span></p><p></p></div>"
        )[0] as Element;

        test("removes identical trees", () => {
            const matches = removeSubsets([dom, dom]);
            assert.equal(matches.length, 1);
        });

        test("Removes subsets found first", () => {
            const firstChild = dom.children[0] as Element;
            const matches = removeSubsets([dom, firstChild.children[0]]);
            assert.equal(matches.length, 1);
        });

        test("Removes subsets found last", () => {
            const matches = removeSubsets([dom.children[0], dom]);
            assert.equal(matches.length, 1);
        });

        test("Does not remove unique trees", () => {
            const matches = removeSubsets([dom.children[0], dom.children[1]]);
            assert.equal(matches.length, 2);
        });
    });

    describe("compareDocumentPosition", () => {
        const { compareDocumentPosition } = helpers;
        const markup = "<div><p><span></span></p><a></a></div>";
        const dom = makeDom(markup)[0] as Element;
        const p = dom.children[0] as Element;
        const span = p.children[0];
        const a = dom.children[1];

        test("reports when the first node occurs before the second indirectly", () =>
            assert.equal(compareDocumentPosition(span, a), 2));

        test("reports when the first node contains the second", () =>
            assert.equal(compareDocumentPosition(p, span), 10));

        test("reports when the first node occurs after the second indirectly", () =>
            assert.equal(compareDocumentPosition(a, span), 4));

        test("reports when the first node is contained by the second", () =>
            assert.equal(compareDocumentPosition(span, p), 20));

        test("reports when the nodes belong to separate documents", () => {
            const otherDom = makeDom(markup)[0] as Element;
            const other = (otherDom.children[0] as Element).children[0];

            assert.equal(compareDocumentPosition(span, other), 1);
        });

        test("reports when the nodes are identical", () =>
            assert.equal(compareDocumentPosition(span, span), 0));
    });

    describe("uniqueSort", () => {
        const { uniqueSort } = helpers;
        let dom: Element;
        let p: Element;
        let span: Element;
        let a: Element;

        beforeEach(() => {
            [dom] = makeDom(
                "<div><p><span></span></p><a></a></div>"
            ) as Element[];
            [p, a] = dom.children as Element[];
            [span] = p.children as Element[];
        });

        test("leaves unique elements untouched", () =>
            assert.deepEqual(uniqueSort([p, a]), [p, a]));

        test("removes duplicate elements", () =>
            assert.deepEqual(uniqueSort([p, a, p]), [p, a]));

        test("sorts nodes in document order", () =>
            assert.deepEqual(uniqueSort([a, dom, span, p]), [dom, p, span, a]));
    });
});
