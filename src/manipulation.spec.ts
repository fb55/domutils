import { parseDOM } from "htmlparser2";
import { append, appendChild, prepend, prependChild } from "./manipulation";
import type { Element } from "domhandler";

describe("manipulation", () => {
    describe("append", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><object/></p></div>"
            )[0] as Element;
            const child = parseDOM("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            append(parents[0].children[0], child);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <img />
                    <span />
                  </p>
                  <p>
                    <object />
                  </p>
                </div>
            `);

            append(parents[1].children[0], child);
            expect(parents[0].children).toHaveLength(1);
            expect(parents[1].children).toHaveLength(2);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <img />
                  </p>
                  <p>
                    <object />
                    <span />
                  </p>
                </div>
            `);
        });
    });
    describe("appendChild", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><object/></p></div>"
            )[0] as Element;
            const child = parseDOM("<span></span>")[0] as Element;
            const parents = dom.children as Element[];

            appendChild(parents[0], child);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <img />
                    <span />
                  </p>
                  <p>
                    <object />
                  </p>
                </div>
            `);

            appendChild(parents[1], child);

            expect(parents[0].children).toHaveLength(1);
            expect(parents[1].children).toHaveLength(2);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <img />
                  </p>
                  <p>
                    <object />
                    <span />
                  </p>
                </div>
            `);
        });
    });
    describe("prepend", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><object/></p></div>"
            )[0] as Element;
            const child = parseDOM("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            prepend(parents[0].children[0], child);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <span />
                    <img />
                  </p>
                  <p>
                    <object />
                  </p>
                </div>
            `);

            prepend(parents[1].children[0], child);
            expect(parents[0].children).toHaveLength(1);
            expect(parents[1].children).toHaveLength(2);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <img />
                  </p>
                  <p>
                    <span />
                    <object />
                  </p>
                </div>
            `);
        });
    });
    describe("prependChild", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><object/></p></div>"
            )[0] as Element;
            const child = parseDOM("<span></span>")[0] as Element;
            const parents = dom.children as Element[];
            prependChild(parents[0], child);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <span />
                    <img />
                  </p>
                  <p>
                    <object />
                  </p>
                </div>
            `);

            prependChild(parents[1], child);
            expect(parents[0].children).toHaveLength(1);
            expect(parents[1].children).toHaveLength(2);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <img />
                  </p>
                  <p>
                    <span />
                    <object />
                  </p>
                </div>
            `);
        });
    });
});
