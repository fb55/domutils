import { Document, Element, Text } from "domhandler";
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

        it("extracts document text while ignoring scripts, styles, comments, and nested documents", () => {
            const document = parseDocument(
                "before<br>after<!--ignored--><script>script</script><style>style</style>",
            );

            expect(innerText(document)).toBe("beforeafter");
            expect(innerText([document])).toBe(innerText(document.children));
            expect(innerText(parseDocument(""))).toBe("");

            // The parse5 htmlparser2 adapter stores `<template>` content in a child document.
            const template = new Element("template", {}, [
                new Document([new Text("secret")]),
            ]);
            const div = new Element("div", {}, [
                new Text("hello"),
                template,
                new Text("world"),
            ]);
            expect(innerText(new Document([div]))).toBe("helloworld");
            expect(innerText(div)).toBe("helloworld");
            expect(innerText(template)).toBe("");
        });
    });
});
