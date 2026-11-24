import { Element } from "domhandler";
import { describe, expect, it, vi } from "vitest";
import {
    getElementById,
    getElements,
    getElementsByClassName,
} from "./legacy.js";
import { getAttributeValue } from "./traversal.js";

describe("own attributes", () => {
    it("does not expose Object.prototype as attribute values", () => {
        const element = new Element("div", {});
        for (const name of ["constructor", "toString", "__proto__"]) {
            expect(getAttributeValue(element, name)).toBeUndefined();
        }
    });

    it("does not match inherited attributes in legacy queries", () => {
        const element = new Element(
            "div",
            Object.create({ id: "inherited", class: "inherited" }),
        );
        expect(getAttributeValue(element, "id")).toBeUndefined();
        expect(getElementById("inherited", [element])).toBeNull();
        expect(getElementsByClassName("inherited", [element])).toEqual([]);
        expect(getElements({ id: "inherited" }, [element], true)).toEqual([]);
    });

    it("passes undefined for missing attributes to predicates", () => {
        const element = new Element("div", {});
        const predicate = vi.fn(() => false);
        getElements({ toString: predicate }, [element], true);
        expect(predicate).toHaveBeenCalledExactlyOnceWith(undefined);
        expect(getElements({ toString: undefined }, [element], true)).toEqual([
            element,
        ]);
    });

    it("retains own prototype-named and empty attributes", () => {
        const element = new Element("div", {
            constructor: "constructor-value",
            toString: "",
            ["__proto__"]: "prototype-value",
        });
        expect(getAttributeValue(element, "constructor")).toBe(
            "constructor-value",
        );
        expect(getAttributeValue(element, "toString")).toBe("");
        expect(getAttributeValue(element, "__proto__")).toBe("prototype-value");
        expect(getElements({ toString: "" }, [element], true)).toEqual([
            element,
        ]);
    });
});
