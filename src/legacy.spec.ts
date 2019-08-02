import * as DomUtils from "./";
import fixture from "./__fixtures__/fixture";
import * as assert from "assert";
import { ElementType } from "domelementtype";
import { Node, Element } from "domhandler";

// Set up expected structures
const expected = {
    idAsdf: fixture[1] as Element,
    tag2: [] as Node[],
    typeScript: [] as Node[]
};
for (let idx = 0; idx < 20; ++idx) {
    const node = fixture[idx * 2 + 1] as Element;
    expected.tag2.push(node.children[5]);
    expected.typeScript.push(node.children[1]);
}

describe("legacy", () => {
    describe("getElements", () => {
        /* eslint-disable @typescript-eslint/camelcase */

        test("returns the node with the specified ID", () =>
            assert.deepEqual(
                DomUtils.getElements({ id: "asdf" }, fixture, true, 1),
                [expected.idAsdf]
            ));
        test("returns empty array for unknown IDs", () =>
            assert.deepEqual(
                DomUtils.getElements({ id: "asdfs" }, fixture, true),
                []
            ));
        test("returns the nodes with the specified tag name", () =>
            assert.deepEqual(
                DomUtils.getElements({ tag_name: "tag2" }, fixture, true),
                expected.tag2
            ));
        test("returns empty array for unknown tag names", () =>
            assert.deepEqual(
                DomUtils.getElements({ tag_name: "asdfs" }, fixture, true),
                []
            ));
        test("returns the nodes with the specified tag type", () =>
            assert.deepEqual(
                DomUtils.getElements({ tag_type: "script" }, fixture, true),
                expected.typeScript
            ));
        test("returns empty array for unknown tag types", () =>
            assert.deepEqual(
                DomUtils.getElements({ tag_type: "video" }, fixture, true),
                []
            ));

        /* eslint-enable @typescript-eslint/camelcase */
    });

    describe("getElementById", () => {
        test("returns the specified node", () =>
            assert.equal(
                expected.idAsdf,
                DomUtils.getElementById("asdf", fixture, true)
            ));
        test("returns `null` for unknown IDs", () =>
            assert.equal(
                null,
                DomUtils.getElementById("asdfs", fixture, true)
            ));
    });

    describe("getElementsByTagName", () => {
        test("returns the specified nodes", () =>
            assert.deepEqual(
                DomUtils.getElementsByTagName("tag2", fixture, true),
                expected.tag2
            ));
        test("returns empty array for unknown tag names", () =>
            assert.deepEqual(
                DomUtils.getElementsByTagName("tag23", fixture, true),
                []
            ));
    });

    describe("getElementsByTagType", () => {
        test("returns the specified nodes", () =>
            assert.deepEqual(
                DomUtils.getElementsByTagType(
                    ElementType.Script,
                    fixture,
                    true
                ),
                expected.typeScript
            ));
        test("returns empty array for unknown tag types", () =>
            assert.deepEqual(
                // @ts-ignore
                DomUtils.getElementsByTagType("video", fixture, true),
                []
            ));
    });

    /*
    describe("getOuterHTML", () => {
        test("Correctly renders the outer HTML", () =>
            assert.equal(
                DomUtils.getOuterHTML(fixture[1]),
                '<tag1 id="asdf"> <script>text</script> <!-- comment --> <tag2> text </tag2></tag1>'
            ));
    });

    describe("getInnerHTML", () => {
        test("Correctly renders the inner HTML", () =>
            assert.equal(
                DomUtils.getInnerHTML(fixture[1]),
                " <script>text</script> <!-- comment --> <tag2> text </tag2>"
            ));
    });
    */
});
