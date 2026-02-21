import { ElementType } from "domelementtype";
import { type Element, isTag } from "domhandler";
import { parseDocument } from "htmlparser2";
import {
    existsOne,
    filter,
    find,
    findAll,
    findOne,
    findOneChild,
} from "./querying";

describe("querying", () => {
    const manyNodesWide = parseDocument(
        `<body>${"<div></div>".repeat(200_000)}Text</body>`,
    );
    const someDeepNodes = parseDocument(
        `<body><div><div></div></div><div><p></p></div></body>`,
    );

    describe("find", () => {
        it("should accept many children without RangeError", () =>
            expect(
                find(
                    (element) => element.type === ElementType.Tag,
                    manyNodesWide,
                    true,
                    Infinity,
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
                    Infinity,
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

    describe("findOneChild", () => {
        it("should find elements", () =>
            expect(
                findOneChild(
                    (element) => isTag(element) && element.name === "body",
                    manyNodesWide.children,
                ),
            ).toBe(manyNodesWide.children[0]));

        it("should only query direct children", () =>
            expect(
                findOneChild(
                    (element) => isTag(element) && element.name === "div",
                    manyNodesWide.children,
                ),
            ).toBeUndefined());
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
