import { type AnyNode, CDATA, Comment, Element, Text } from "domhandler";
import { describe, expect, it } from "vitest";
import { getText, innerText, textContent } from "./stringify.js";

describe("deep text extraction", () => {
    for (const extract of [getText, textContent, innerText]) {
        it(`${extract.name} reads a deeply nested tree in document order`, () => {
            let tree = new Element("span", {}, [new Text("deep")]);
            for (let depth = 0; depth < 20_000; depth++) {
                const parent = new Element("div", {}, [tree]);
                tree.parent = parent;
                tree = parent;
            }
            const nodes = [new Text("before"), tree, new Text("after")];

            expect(extract(tree)).toBe("deep");
            expect(extract(nodes)).toBe("beforedeepafter");
        });

        it(`${extract.name} skips holes and preserves input arrays`, () => {
            const nodes: AnyNode[] = [];
            nodes[0] = new Text("before");
            nodes[2] = new Text("after");
            Object.freeze(nodes);

            expect(extract(nodes)).toBe("beforeafter");
            expect(nodes).toHaveLength(3);
            expect(1 in nodes).toBe(false);
        });

        it(`${extract.name} ignores nodes appended during traversal`, () => {
            for (const isNested of [false, true]) {
                const nodes: AnyNode[] = [];
                Object.defineProperty(nodes, 0, {
                    get() {
                        nodes.push(new Text("late"));
                        return new Text("early");
                    },
                });

                const input = isNested ? new Element("span", {}, nodes) : nodes;
                expect(extract(input)).toBe("early");
                expect(nodes).toHaveLength(2);
            }
        });
    }

    it("preserves each helper's handling of breaks, comments and raw text", () => {
        const nodes = [
            new Text("before"),
            new Element("br", {}, []),
            new Comment("hidden"),
            new Element("script", {}, [new Text("script")]),
            new Element("style", {}, [new Text("style")]),
            new CDATA([new Text("cdata")]),
            new Text("after"),
        ];

        expect(getText(nodes)).toBe("before\nscriptstylecdataafter");
        expect(textContent(nodes)).toBe("beforescriptstylecdataafter");
        expect(innerText(nodes)).toBe("beforecdataafter");
    });
});
