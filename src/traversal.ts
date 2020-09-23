import type { Node, Element, NodeWithChildren } from "domhandler";
import { isTag } from "./tagtypes";

const emptyArray: Node[] = [];
export function getChildren(elem: Node): Node[] {
    return (elem as { children?: Node[] }).children ?? emptyArray;
}

export function getParent(elem: Element): Element | null;
export function getParent(elem: Node): NodeWithChildren | null;
export function getParent(elem: Node): NodeWithChildren | null {
    return elem.parent || null;
}

/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first.
 * If we don't have a parent (the element is a root node),
 * we walk the element's `prev` & `next` to get all remaining nodes.
 *
 * @param elem Element to get the siblings of.
 */
export function getSiblings(elem: Node): Node[] {
    const parent = getParent(elem);
    if (parent != null) return getChildren(parent);

    const siblings = [elem];
    let { prev, next } = elem;
    while (prev != null) {
        siblings.unshift(prev);
        ({ prev } = prev);
    }
    while (next != null) {
        siblings.push(next);
        ({ next } = next);
    }
    return siblings;
}

/**
 * Gets an attribute from an element.
 *
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 */
export function getAttributeValue(
    elem: Element,
    name: string
): string | undefined {
    return elem.attribs?.[name];
}

/**
 * Checks whether an element has an attribute.
 *
 * @param elem Element to check.
 * @param name Attribute name to look for.
 */
export function hasAttrib(elem: Element, name: string): boolean {
    return (
        elem.attribs != null &&
        Object.prototype.hasOwnProperty.call(elem.attribs, name) &&
        elem.attribs[name] != null
    );
}

/**
 * Returns the name property of an element
 *
 * @param elem The element to get the name for
 */
export function getName(elem: Element): string {
    return elem.name;
}

export function nextElementSibling(elem: Node): Node | null {
    let node = elem.next;
    while (node !== null && node.type !== "tag") node = node.next;
    return node;
}
