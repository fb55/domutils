import { ElementType } from "domelementtype";
import {
    type AnyNode,
    type Element,
    isTag,
    isText,
    type Text,
} from "domhandler";
import { parseDocument } from "htmlparser2";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { existsOne, filter, find, findAll, findOne } from "./querying.js";

describe("querying", () => {
    const manyNodesWide = parseDocument(
        `<body>${"<div></div>".repeat(200_000)}Text</body>`,
    );
    const someDeepNodes = parseDocument(
        "<body><div><div></div></div><div><p></p></div></body>",
    );

    describe("type guards", () => {
        const document = parseDocument("before<div>inside</div>after");

        it("should narrow filtered nodes using a type guard", () => {
            const elements = filter(isTag, document);
            const text = filter(isText, document);
            expectTypeOf(elements).toEqualTypeOf<Element[]>();
            expectTypeOf(text).toEqualTypeOf<Text[]>();
            expect(elements.map((element) => element.name)).toEqual(["div"]);
            expect(text.map((node) => node.data)).toEqual([
                "before",
                "inside",
                "after",
            ]);
        });

        it("should narrow find results and respect recursion and limits", () => {
            const text = find(isText, document, true, 1);
            const directText = find(
                isText,
                document.children,
                false,
                Number.POSITIVE_INFINITY,
            );
            expectTypeOf(text).toEqualTypeOf<Text[]>();
            expectTypeOf(directText).toEqualTypeOf<Text[]>();
            expect(text.map((node) => node.data)).toEqual(["before"]);
            expect(directText.map((node) => node.data)).toEqual([
                "before",
                "after",
            ]);
        });

        it("should preserve the general result for boolean predicates", () => {
            const isElement = (node: AnyNode): boolean => isTag(node);
            const filtered = filter(isElement, document);
            const found = find(isElement, document, true, 1);
            expectTypeOf(filtered).toEqualTypeOf<AnyNode[]>();
            expectTypeOf(found).toEqualTypeOf<AnyNode[]>();
            expect(filtered).toEqual(found);
        });
    });

    describe("find", () => {
        it("should return no nodes for a zero limit", () => {
            const test = vi.fn(() => true);
            expect(find(test, someDeepNodes, true, 0)).toEqual([]);
            expect(test).not.toHaveBeenCalled();
        });

        it("should accept many children without RangeError", () =>
            expect(
                find(
                    (element) => element.type === ElementType.Tag,
                    manyNodesWide,
                    true,
                    Number.POSITIVE_INFINITY,
                ),
            ).toHaveLength(200_001));

        it("should respect limit", () =>
            expect(
                find(
                    (element) => element.type === ElementType.Tag,
                    manyNodesWide,
                    true,
                    20,
                ),
            ).toHaveLength(20));

        it("should find text nodes", () =>
            expect(
                find(
                    (element) => element.type === ElementType.Text,
                    manyNodesWide,
                    true,
                    Number.POSITIVE_INFINITY,
                ),
            ).toHaveLength(1));
    });

    describe("findAll", () => {
        it("should accept many children without RangeError", () => {
            expect(
                findAll((element) => element.name === "div", manyNodesWide),
            ).toHaveLength(200_000);
        });
    });

    describe("filter", () => {
        it("should accept many children without RangeError", () =>
            expect(
                filter(
                    (element) => element.type === ElementType.Tag,
                    manyNodesWide,
                ),
            ).toHaveLength(200_001));

        it("should turn a single node into an array", () =>
            expect(
                filter(
                    (element) => element.type === ElementType.Tag,
                    manyNodesWide.children[0],
                ),
            ).toHaveLength(200_001));
    });

    describe("findOne", () => {
        it("should find elements", () =>
            expect(
                findOne(
                    (element) => element.name === "body",
                    manyNodesWide.children,
                    true,
                ),
            ).toBe(manyNodesWide.children[0]));

        it("should find elements in children", () =>
            expect(
                findOne(
                    (element) => element.name === "div",
                    manyNodesWide.children,
                    true,
                ),
            ).toBe((manyNodesWide.children[0] as Element).children[0]));

        it("should find elements in children in any branch", () =>
            expect(
                findOne(
                    (element) => element.name === "p",
                    someDeepNodes.children,
                    true,
                ),
            ).toBeTruthy());

        it("should not find elements in children if recurse is false", () =>
            expect(
                findOne(
                    (element) => element.name === "div",
                    manyNodesWide,
                    false,
                ),
            ).toBeNull());

        it("should return `null` if nothing is found", () =>
            expect(findOne(() => false, manyNodesWide)).toBeNull());
    });

    describe("existsOne", () => {
        it("should find elements", () =>
            expect(
                existsOne((element) => element.name === "body", manyNodesWide),
            ).toBeTruthy());

        it("should find elements in children", () =>
            expect(
                existsOne(
                    (element) => element.name === "div",
                    manyNodesWide.children,
                ),
            ).toBeTruthy());

        it("should return `false` if nothing is found", () =>
            expect(existsOne(() => false, manyNodesWide)).toBeFalsy());
    });
});
