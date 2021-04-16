import { isTag, isCDATA, isText, hasChildren, Node } from "domhandler";
import renderHTML, { DomSerializerOptions } from "dom-serializer";

/**
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s outer HTML.
 */
export function getOuterHTML(
    node: Node | Node[],
    options?: DomSerializerOptions
): string {
    return renderHTML(node, options);
}

/**
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s inner HTML.
 */
export function getInnerHTML(
    node: Node,
    options?: DomSerializerOptions
): string {
    return hasChildren(node)
        ? node.children.map((node) => getOuterHTML(node, options)).join("")
        : "";
}

/**
 * Get a node's inner text.
 *
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */
export function getText(node: Node | Node[]): string {
    if (Array.isArray(node)) return node.map(getText).join("");
    if (isTag(node)) return node.name === "br" ? "\n" : getText(node.children);
    if (isCDATA(node)) return getText(node.children);
    if (isText(node)) return node.data;
    return "";
}
