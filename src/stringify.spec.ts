import * as DomUtils from "./";
import fixture from "./__fixtures__/fixture";

describe("stringify", () => {
    describe("getOuterHTML", () =>
        it("Correctly renders the outer HTML", () =>
            expect(DomUtils.getOuterHTML(fixture[1])).toBe(
                '<tag1 id="asdf"> <script>text</script> <!-- comment --> <tag2> text </tag2></tag1>'
            )));

    describe("getInnerHTML", () =>
        it("Correctly renders the inner HTML", () =>
            expect(DomUtils.getInnerHTML(fixture[1])).toBe(
                " <script>text</script> <!-- comment --> <tag2> text </tag2>"
            )));
});
