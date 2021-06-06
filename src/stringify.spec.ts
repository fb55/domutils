import {
    getInnerHTML,
    getOuterHTML,
    getText,
    textContent,
    innerText,
} from "./";
import fixture from "./__fixtures__/fixture";

describe("stringify", () => {
    describe("getOuterHTML", () => {
        it("Correctly renders the outer HTML", () => {
            expect(getOuterHTML(fixture[1])).toBe(
                '<tag1 id="asdf"> <script>text</script> <!-- comment --> <tag2> text </tag2></tag1>'
            );
        });
    });

    describe("getInnerHTML", () => {
        it("Correctly renders the inner HTML", () => {
            expect(getInnerHTML(fixture[1])).toBe(
                " <script>text</script> <!-- comment --> <tag2> text </tag2>"
            );
        });
    });

    describe("getText", () => {
        it("Correctly renders the text content", () => {
            expect(getText(fixture[1])).toBe(" text   text ");
        });
    });

    describe("textContent", () => {
        it("Correctly renders the text content", () => {
            expect(textContent(fixture[1])).toBe(" text   text ");
        });
    });

    describe("innerText", () => {
        it("Correctly renders the text content", () => {
            expect(innerText(fixture[1])).toBe("    text ");
        });
    });
});
