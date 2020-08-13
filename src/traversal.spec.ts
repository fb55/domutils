import { makeDom } from "./__fixtures__/utils";
import assert from "assert";
import { Element } from "domhandler";
import * as DomUtils from ".";

describe("traversal", () => {
    describe("hasAttrib", () => {
        test("doesn't throw on text nodes", () => {
            const [firstNode] = makeDom("textnode");

            assert.doesNotThrow(() =>
                DomUtils.hasAttrib(firstNode as never, "some-attrib")
            );
        });
    });

    describe("nextElementSibling", () => {
        test("return Element if found", () => {
            const dom = makeDom(
                "<div><h1></h1>test<p></p></div>"
            )[0] as Element;
            const firstNode = dom.children[0];

            const next = DomUtils.nextElementSibling(firstNode) as Element;
            assert.equal(next.tagName, "p");
        });
        test("return null if not found", () => {
            const dom = makeDom("<div><p></p>test</div>")[0] as Element;
            const firstNode = dom.children[0];

            assert.equal(DomUtils.nextElementSibling(firstNode), null);
        });
    });
});
