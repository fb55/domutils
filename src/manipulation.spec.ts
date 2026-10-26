import type { Element } from "domhandler";
import { parseDocument } from "htmlparser2";
import { describe, expect, it } from "vitest";
import {
    append,
    appendChild,
    prepend,
    prependChild,
    removeElement,
    replaceElement,
} from "./manipulation.js";

function parseDOM(markup: string) {
    return parseDocument(markup).children;
}

describe("manipulation", () => {
    describe("append", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><object/></p></div>",
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
                "<div><p><img/></p><p><object/></p></div>",
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
    describe("removeElement", () => {
        it("should correctly remove element", () => {
            const dom = parseDOM(
                "<div><p><img/><object/></p><p></p></div>",
            )[0] as Element;
            const parents = dom.children as Element[];

            const image = parents[0].children[0];

            removeElement(image);

            expect(image.next).toBeNull();
            expect(image.prev).toBeNull();
            expect(image.parent).toBeNull();

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <object />
                  </p>
                  <p />
                </div>
            `);

            appendChild(parents[1], image);

            expect(parents[0].children).toHaveLength(1);
            expect(parents[1].children).toHaveLength(1);

            expect(dom).toMatchInlineSnapshot(`
                <div>
                  <p>
                    <object />
                  </p>
                  <p>
                    <img />
                  </p>
                </div>
            `);
        });
    });
    describe("prepend", () => {
        it("should not be duplicated when called twice", () => {
            const dom = parseDOM(
                "<div><p><img/></p><p><object/></p></div>",
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
                "<div><p><img/></p><p><object/></p></div>",
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
    describe("replaceElement", () => {
        it("moves an attached replacement out of its previous parent", () => {
            const [destination, source] = parseDOM(
                "<div><p></p></div><section><span></span></section>",
            ) as Element[];
            const old = destination.children[0];
            const replacement = source.children[0];
            replaceElement(old, replacement);
            expect(source.children).toEqual([]);
            expect(destination.children).toEqual([replacement]);
            expect(replacement.parent).toBe(destination);
        });

        it.each([0, 2])(
            "moves an adjacent sibling at index %i without duplicating it",
            (index) => {
                const parent = parseDOM(
                    "<div><a></a><b></b><c></c></div>",
                )[0] as Element;
                const old = parent.children[1];
                const replacement = parent.children[index];
                const expected =
                    index === 0
                        ? [replacement, parent.children[2]]
                        : [parent.children[0], replacement];
                replaceElement(old, replacement);
                expect(parent.children).toHaveLength(2);
                expect(parent.children[0]).toBe(expected[0]);
                expect(parent.children[1]).toBe(expected[1]);
                expect(replacement.parent).toBe(parent);
                expect(old.parent).toBeNull();
                expect(parent.children[0].next).toBe(parent.children[1]);
                expect(parent.children[1].prev).toBe(parent.children[0]);
                expect(parent.children[0].prev).toBeNull();
                expect(parent.children[1].next).toBeNull();
            },
        );

        it("leaves self-replacement unchanged", () => {
            const parent = parseDOM("<div><p></p></div>")[0] as Element;
            const child = parent.children[0];
            replaceElement(child, child);
            expect(child.parent).toBe(parent);
            expect(parent.children).toEqual([child]);
        });

        it("detaches the replaced node's sibling links", () => {
            const parent = parseDOM(
                "<div><a></a><b></b><c></c></div>",
            )[0] as Element;
            const old = parent.children[1];
            const replacement = parseDOM("<span></span>")[0];
            replaceElement(old, replacement);
            removeElement(old);
            expect(parent.children[0].next).toBe(replacement);
            expect(parent.children[2].prev).toBe(replacement);
        });

        it("should allow replaced elements to be appended later (#966)", () => {
            const div = parseDOM("<div><p>")[0] as Element;
            const template = parseDOM("<template></template>")[0] as Element;
            const p = div.children[0];

            // We want to wrap the inner <p> in a <template>
            replaceElement(p, template);
            appendChild(template, p);

            expect(div).toMatchInlineSnapshot(`
                <div>
                  <template>
                    <p />
                  </template>
                </div>
            `);
        });
    });
});
