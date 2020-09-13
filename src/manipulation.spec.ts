import { parseDOM } from "htmlparser2";
import { append, appendChild } from "./manipulation";
import type { Element } from "domhandler";

describe("manipulation", () => {
    describe("append", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><img/></p></div>"
            )[0] as Element;
            const child = parseDOM("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            append(parents[0].children[0], child);
            append(parents[1].children[0], child);
            expect(parents[0].children).toHaveLength(1);
            expect(parents[1].children).toHaveLength(2);
        });
    });
    describe("appendChild", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM("<div><p></p><p></p></div>")[0] as Element;
            const child = parseDOM("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            appendChild(parents[0], child);
            appendChild(parents[1], child);
            expect(parents[0].children).toHaveLength(0);
            expect(parents[1].children).toHaveLength(1);
        });
    });
});
