import { parseDocument } from "./__fixtures__/fixture";
import { find } from "./querying";
import { ElementType } from "domelementtype";

describe("querying", () => {
    describe("find", () => {
        it("should accept too many children without RangeError", () => {
            let html = "<body>";
            for (let i = 0; i < 200000; i++) {
                html += "<div></div>";
            }
            html += "</body>";
            const nodes = [parseDocument(html)];
            const resultNodes = find(
                (elem) => elem.type === ElementType.Tag,
                nodes,
                true,
                Infinity
            );
            expect(resultNodes).toHaveLength(200001);
        });
    });
});
