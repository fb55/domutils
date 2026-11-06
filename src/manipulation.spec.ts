import { Document, Element, type ParentNode, Text } from "domhandler";
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
import { getOuterHTML } from "./stringify.js";

function parseDOM(markup: string) {
    return parseDocument(markup).children;
}

function chain(nodes: Element[]): void {
    let parent: ParentNode = new Document([]);
    for (const node of nodes) {
        appendChild(parent, node);
        parent = node;
    }
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
    describe("cyclic insertion", () => {
        it.each([
            {
                name: "appendChild",
                move: (div: Element) => appendChild(div, div),
            },
            {
                name: "append",
                move: (div: Element, p: Element) => append(p, div),
            },
            {
                name: "replaceElement",
                move: (div: Element, p: Element) => replaceElement(p, div),
            },
        ])("$name should skip moving a node into itself", ({ move }) => {
            const html =
                "<h1></h1><div><section><b></b><p>x</p><em></em></section></div><h2></h2>";
            const document_ = parseDocument(html);
            const [h1, div, h2] = document_.children as Element[];
            const section = div.children[0] as Element;
            const [b, p, em] = section.children as Element[];

            move(div, p);

            expect(div.parent).toBe(document_);
            expect(section.parent).toBe(div);
            expect(p.parent).toBe(section);
            for (const [previous, node, next] of [
                [h1, div, h2],
                [b, p, em],
            ]) {
                expect(node.prev).toBe(previous);
                expect(node.next).toBe(next);
                expect(previous.next).toBe(node);
                expect(next.prev).toBe(node);
            }
            expect(getOuterHTML(document_)).toBe(html);
        });

        it.each([
            { name: "appending to the deepest node", build: chain },
            {
                name: "wrapping every node",
                build(nodes: Element[]) {
                    chain(nodes);
                    for (const node of nodes) {
                        const wrapper = new Element("span", {});
                        prepend(node, wrapper);
                        appendChild(wrapper, node);
                    }
                },
            },
        ])("should stay linear when $name of a deep chain", ({ build }) => {
            const length = 1000;
            let reads = 0;
            const nodes = Array.from({ length }, () => {
                const node = new Element("div", {});
                appendChild(node, new Text("x"));
                let parent: ParentNode | null = null;
                Object.defineProperty(node, "parent", {
                    get() {
                        reads++;
                        return parent;
                    },
                    set(value: ParentNode | null) {
                        parent = value;
                    },
                });
                return node;
            });

            build(nodes);

            expect(reads).toBeLessThan(20 * length);
        });
    });
});
