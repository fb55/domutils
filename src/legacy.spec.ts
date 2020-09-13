import fixture from "./__fixtures__/fixture";
import { ElementType } from "domelementtype";
import {
    getElements,
    getElementById,
    getElementsByTagName,
    getElementsByTagType,
} from "./legacy";
import type { Node, Element } from "domhandler";

describe("legacy", () => {
    // Set up expected structures
    const expected = {
        idAsdf: fixture[1] as Element,
        tag2: [] as Node[],
        typeScript: [] as Node[],
    };

    beforeAll(() => {
        for (let idx = 0; idx < 20; ++idx) {
            const node = fixture[idx * 2 + 1] as Element;
            expected.tag2.push(node.children[5]);
            expected.typeScript.push(node.children[1]);
        }
    });
    describe("getElements", () => {
        it("returns the node with the specified ID", () =>
            expect(getElements({ id: "asdf" }, fixture, true, 1)).toEqual([
                expected.idAsdf,
            ]));
        it("returns empty array for unknown IDs", () =>
            expect(getElements({ id: "asdfs" }, fixture, true)).toHaveLength(
                0
            ));
        it("returns the nodes with the specified tag name", () =>
            expect(getElements({ tag_name: "tag2" }, fixture, true)).toEqual(
                expected.tag2
            ));
        it("returns empty array for unknown tag names", () =>
            expect(
                getElements({ tag_name: "asdfs" }, fixture, true)
            ).toHaveLength(0));
        it("returns the nodes with the specified tag type", () =>
            expect(getElements({ tag_type: "script" }, fixture, true)).toEqual(
                expected.typeScript
            ));
        it("returns empty array for unknown tag types", () =>
            expect(
                getElements({ tag_type: "video" }, fixture, true)
            ).toHaveLength(0));
    });

    describe("getElementById", () => {
        it("returns the specified node", () =>
            expect(getElementById("asdf", fixture, true)).toBe(
                expected.idAsdf
            ));
        it("returns `null` for unknown IDs", () =>
            expect(getElementById("asdfs", fixture, true)).toBeNull());
    });

    describe("getElementsByTagName", () => {
        it("returns the specified nodes", () =>
            expect(getElementsByTagName("tag2", fixture, true)).toEqual(
                expected.tag2
            ));
        it("returns empty array for unknown tag names", () =>
            expect(getElementsByTagName("tag23", fixture, true)).toHaveLength(
                0
            ));
    });

    describe("getElementsByTagType", () => {
        it("returns the specified nodes", () =>
            expect(
                getElementsByTagType(ElementType.Script, fixture, true)
            ).toEqual(expected.typeScript));
        it("returns empty array for unknown tag types", () =>
            expect(
                getElementsByTagType("video" as never, fixture, true)
            ).toHaveLength(0));
    });
});
