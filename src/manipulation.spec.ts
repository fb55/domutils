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
import { getOuterHTML } from "./stringify.js";

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
        it("moves an adjacent sibling without duplicating it", () => {
            const parent = parseDOM(
                "<div><a></a><b></b><c></c></div>",
            )[0] as Element;
            const [replacement, old, next] = parent.children;
            replaceElement(old, replacement);
            expect(parent.children).toHaveLength(2);
            expect(parent.children[0]).toBe(replacement);
            expect(parent.children[1]).toBe(next);
            expect(replacement.parent).toBe(parent);
            expect(old.parent).toBeNull();
            expect(replacement.next).toBe(next);
            expect(next.prev).toBe(replacement);
            expect(replacement.prev).toBeNull();
            expect(next.next).toBeNull();
        });

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
    describe("cyclic insertion", () => {
        it("appendChild should reject an element as its own child", () => {
            const document_ = parseDocument("<div><p>a</p></div>");
            const div = document_.children[0] as Element;

            expect(() => appendChild(div, div)).toThrow("inclusive ancestor");
            expect(div.parent).toBe(document_);
            expect(div.prev).toBeNull();
            expect(div.next).toBeNull();
            expect(div.children).toHaveLength(1);
            expect(getOuterHTML(document_)).toBe("<div><p>a</p></div>");
        });

        it("appendChild should reject an ancestor of the parent", () => {
            const document_ = parseDocument(
                "<div><section><p>x</p></section></div>",
            );
            const div = document_.children[0] as Element;
            const section = div.children[0] as Element;
            const p = section.children[0] as Element;

            expect(() => appendChild(p, div)).toThrow("inclusive ancestor");
            expect(div.children[0]).toBe(section);
            expect(section.parent).toBe(div);
            expect(section.prev).toBeNull();
            expect(section.next).toBeNull();
            expect(p.parent).toBe(section);
            expect(getOuterHTML(document_)).toBe(
                "<div><section><p>x</p></section></div>",
            );
        });

        it("prependChild should reject an element as its own child", () => {
            const document_ = parseDocument("<div><p>a</p></div>");
            const div = document_.children[0] as Element;

            expect(() => prependChild(div, div)).toThrow("inclusive ancestor");
            expect(div.parent).toBe(document_);
            expect(div.prev).toBeNull();
            expect(div.next).toBeNull();
            expect(div.children).toHaveLength(1);
            expect(getOuterHTML(document_)).toBe("<div><p>a</p></div>");
        });

        it("prependChild should reject an ancestor of the parent", () => {
            const document_ = parseDocument(
                "<div><section><p>x</p></section></div>",
            );
            const div = document_.children[0] as Element;
            const section = div.children[0] as Element;
            const p = section.children[0] as Element;

            expect(() => prependChild(p, div)).toThrow("inclusive ancestor");
            expect(div.children[0]).toBe(section);
            expect(section.parent).toBe(div);
            expect(section.prev).toBeNull();
            expect(section.next).toBeNull();
            expect(p.parent).toBe(section);
            expect(getOuterHTML(document_)).toBe(
                "<div><section><p>x</p></section></div>",
            );
        });

        it("append should ignore an element inserted after itself", () => {
            const document_ = parseDocument("<div><p>a</p><p>b</p></div>");
            const div = document_.children[0] as Element;
            const [a, b] = div.children as Element[];

            append(a, a);
            expect(a.parent).toBe(div);
            expect(a.prev).toBeNull();
            expect(a.next).toBe(b);
            expect(div.children).toHaveLength(2);
        });

        it("append should reject an ancestor of the element", () => {
            const document_ = parseDocument(
                "<div><section><p>x</p></section></div>",
            );
            const div = document_.children[0] as Element;
            const section = div.children[0] as Element;
            const p = section.children[0] as Element;

            expect(() => append(p, div)).toThrow("inclusive ancestor");
            expect(div.children[0]).toBe(section);
            expect(section.parent).toBe(div);
            expect(section.prev).toBeNull();
            expect(section.next).toBeNull();
            expect(p.parent).toBe(section);
            expect(getOuterHTML(document_)).toBe(
                "<div><section><p>x</p></section></div>",
            );
        });

        it("prepend should ignore an element inserted before itself", () => {
            const document_ = parseDocument("<div><p>a</p><p>b</p></div>");
            const div = document_.children[0] as Element;
            const [a, b] = div.children as Element[];

            prepend(b, b);
            expect(b.parent).toBe(div);
            expect(b.prev).toBe(a);
            expect(b.next).toBeNull();
            expect(div.children).toHaveLength(2);
        });

        it("prepend should reject an ancestor of the element", () => {
            const document_ = parseDocument(
                "<div><section><p>x</p></section></div>",
            );
            const div = document_.children[0] as Element;
            const section = div.children[0] as Element;
            const p = section.children[0] as Element;

            expect(() => prepend(p, div)).toThrow("inclusive ancestor");
            expect(div.children[0]).toBe(section);
            expect(section.parent).toBe(div);
            expect(section.prev).toBeNull();
            expect(section.next).toBeNull();
            expect(p.parent).toBe(section);
            expect(getOuterHTML(document_)).toBe(
                "<div><section><p>x</p></section></div>",
            );
        });

        it("should report a HierarchyRequestError", () => {
            const document_ = parseDocument("<div><p>a</p></div>");
            const div = document_.children[0] as Element;

            try {
                appendChild(div, div);
                expect.unreachable();
            } catch (error) {
                expect((error as Error).name).toBe("HierarchyRequestError");
            }
        });
    });
});
