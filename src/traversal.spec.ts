import { makeDom } from "./__fixtures__/utils";
import assert from "assert";
import * as DomUtils from ".";

describe("traversal", () => {
    describe("hasAttrib", () => {
        test("doesn't throw on text nodes", () => {
            const dom = makeDom("textnode");
            const [firstNode] = dom;

            assert.doesNotThrow(() =>
                // @ts-ignore
                DomUtils.hasAttrib(firstNode, "some-attrib")
            );
        });
    });
});
