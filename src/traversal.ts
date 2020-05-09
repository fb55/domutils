import { Node, Element } from "domhandler";

export function getChildren(elem: Node | Element): Node[] | null {
    return (elem as { children?: Node[] }).children || null;
}

export function getParent(elem: Node): Node | null {
    return elem.parent || null;
}

export function getSiblings(elem: Node): Node[] | null {
    const parent = getParent(elem);
    return parent ? getChildren(parent) : [elem];
}

export function getAttributeValue(elem: Element, name: string): string {
    return elem.attribs && elem.attribs[name];
}

export function hasAttrib(elem: Element, name: string): boolean {
    return !!getAttributeValue(elem, name);
}

/***
 * Returns the name property of an element
 *
 * @param elem The element to get the name for
 */
export function getName(elem: Element): string {
    return elem.name;
}
