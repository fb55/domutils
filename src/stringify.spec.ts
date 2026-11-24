import { parseDocument } from "htmlparser2";
import { describe, expect, it } from "vitest";
import fixture from "./__fixtures__/fixture.js";
import {
    getInnerHTML,
    getOuterHTML,
    getText,
    innerText,
    textContent,
} from "./index.js";

describe("stringify", () => {
    describe("getOuterHTML", () => {
        it("Correctly renders the outer HTML", () => {
            expect(getOuterHTML(fixture[1])).toBe(
                '<tag1 id="asdf" class="class1"> <script>text</script> <!-- comment --> <tag2> text </tag2></tag1>',
            );
        });
    });

    describe("getInnerHTML", () => {
        it("Correctly renders the inner HTML", () => {
            expect(getInnerHTML(fixture[1])).toBe(
                " <script>text</script> <!-- comment --> <tag2> text </tag2>",
            );
        });
    });

    describe("getText", () => {
        it("Correctly renders the text content", () => {
            expect(getText(fixture[1])).toBe(" text   text ");
        });

        it("extracts text and line breaks from a document node", () => {
            const document = parseDocument(
                "before<br>after<!--ignored--><script>script</script><style>style</style>",
            );

            expect(getText(document)).toBe("before\nafterscriptstyle");
            expect(getText([document])).toBe(getText(document.children));
            expect(getText(parseDocument(""))).toBe("");
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

        it("extracts document text while ignoring scripts, styles, and comments", () => {
            const document = parseDocument(
                "before<br>after<!--ignored--><script>script</script><style>style</style>",
            );

            expect(innerText(document)).toBe("beforeafter");
            expect(innerText([document])).toBe(innerText(document.children));
            expect(innerText(parseDocument(""))).toBe("");
        });
    });
});
