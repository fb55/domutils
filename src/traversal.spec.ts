import { makeDom } from "./__fixtures__/utils";
import assert from "assert";
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
});
