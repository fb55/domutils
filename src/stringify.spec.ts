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
            // oxlint-disable-next-line typescript/no-deprecated -- Exercise the legacy outer HTML API directly.
            expect(getOuterHTML(fixture[1])).toBe(
                '<tag1 id="asdf" class="class1"> <script>text</script> <!-- comment --> <tag2> text </tag2></tag1>',
            );
        });
    });

    describe("getInnerHTML", () => {
        it("Correctly renders the inner HTML", () => {
            // oxlint-disable-next-line typescript/no-deprecated -- Exercise the legacy inner HTML API directly.
            expect(getInnerHTML(fixture[1])).toBe(
                " <script>text</script> <!-- comment --> <tag2> text </tag2>",
            );
        });
    });

    describe("getText", () => {
        it("Correctly renders the text content", () => {
            // oxlint-disable-next-line typescript/no-deprecated -- Exercise the legacy text API directly.
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
