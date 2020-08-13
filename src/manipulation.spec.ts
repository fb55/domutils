import { makeDom } from "./__fixtures__/utils";
import * as manipulation from "./manipulation";
import * as assert from "assert";
import { Element } from "domhandler";

describe("manipulation", () => {
    describe("append", () => {
        const { append } = manipulation;
        test("should not be duplicated when called twice", () => {
            const dom = makeDom(
                "<div><p><img/></p><p><img/></p></div>"
            )[0] as Element;
            const child = makeDom("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            append(parents[0].children[0], child);
            append(parents[1].children[0], child);
            assert.equal(parents[0].children.length, 1);
            assert.equal(parents[1].children.length, 2);
        });
    });
    describe("appendChild", () => {
        const { appendChild } = manipulation;
        test("should not be duplicated when called twice", () => {
            const dom = makeDom("<div><p></p><p></p></div>")[0] as Element;
            const child = makeDom("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            appendChild(parents[0], child);
            appendChild(parents[1], child);
            assert.equal(parents[0].children.length, 0);
            assert.equal(parents[1].children.length, 1);
        });
    });
});

//
