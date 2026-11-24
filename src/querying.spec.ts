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
    const manyNodesDeep = parseDocument(
        `${"<div>".repeat(20_000)}<target/>${"</div>".repeat(20_000)}`,
        { xmlMode: true },
    );

    describe.each([
        ["findOne", findOne],
        ["existsOne", existsOne],
    ] as const)("%s traversal", (_name, query) => {
        it("visits only elements in depth-first order and stops at the first match", () => {
            const document = parseDocument(
                "text<first><!--comment--><target/></first><last/>",
                { xmlMode: true },
            );
            const isMatch = vi.fn(
                (element: Element) => element.name === "target",
            );

            query(isMatch, document);

            expect(isMatch.mock.calls.map(([element]) => element.name)).toEqual(
                ["first", "target"],
            );
        });
    });

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

        it("should distinguish type guards and boolean predicates", () => {
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

            const isElement = (node: AnyNode): boolean => isTag(node);
            const filtered = filter(isElement, document);
            const found = find(isElement, document, true, 1);
            expectTypeOf(filtered).toEqualTypeOf<AnyNode[]>();
            expectTypeOf(found).toEqualTypeOf<AnyNode[]>();
            expect(filtered).toEqual(found);
        });

        it("should narrow element-only query results", () => {
            type Div = Element & { name: "div" };
            const isDiv = (element: Element): element is Div =>
                element.name === "div";
            const first = findOne(isDiv, document);
            const all = findAll(isDiv, document);
            expectTypeOf(first).toEqualTypeOf<Div | null>();
            expectTypeOf(all).toEqualTypeOf<Div[]>();
            expect(first?.name).toBe("div");
            expect(all).toEqual([first]);
            expect(findOne(isDiv, document, false)).toBeNull();
            expect(findAll(isDiv, [])).toEqual([]);
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
        it.each([false, true])(
            "searches a deeply nested tree without RangeError (array: %s)",
            (useArray) => {
                const nodes = useArray ? manyNodesDeep.children : manyNodesDeep;
                expect(
                    findOne((element) => element.name === "target", nodes)
                        ?.name,
                ).toBe("target");
                expect(findOne(() => false, nodes)).toBeNull();
            },
        );

        it("checks later siblings without descending when recursion is disabled", () => {
            const document = parseDocument(
                '<branch><target id="deep"/></branch><target id="top"/>',
                { xmlMode: true },
            );
            expect(
                findOne(
                    (element) => element.name === "target",
                    document.children,
                    false,
                )?.attribs["id"],
            ).toBe("top");
        });

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
        it.each([false, true])(
            "searches a deeply nested tree without RangeError (array: %s)",
            (useArray) => {
                const nodes = useArray ? manyNodesDeep.children : manyNodesDeep;
                expect(
                    existsOne((element) => element.name === "target", nodes),
                ).toBe(true);
                expect(existsOne(() => false, nodes)).toBe(false);
            },
        );

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
