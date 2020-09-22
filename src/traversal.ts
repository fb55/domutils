import type { Node, Element } from "domhandler";

export function getChildren(elem: Node | Element): Node[] | null {
    return (elem as { children?: Node[] }).children ?? null;
}

export function getParent(elem: Node): Node | null {
    return elem.parent || null;
}

export function getSiblings(elem: Node): Node[] | null {
    const parent = getParent(elem);
    return parent != null ? getChildren(parent) : [elem];
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
        elem.attribs?.[name] != null &&
        Object.prototype.hasOwnProperty.call(elem.attribs, name)
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
