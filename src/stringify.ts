import { Node } from "domhandler";
import { isTag, isCDATA, isText, hasChildren } from "./tagtypes";
import renderHTML, { DomSerializerOptions } from "dom-serializer";

export function getOuterHTML(
    node: Node | Node[],
    options?: DomSerializerOptions
): string {
    return renderHTML(node, options);
}

export function getInnerHTML(
    node: Node,
    options?: DomSerializerOptions
): string {
    return hasChildren(node)
        ? node.children.map((node) => getOuterHTML(node, options)).join("")
        : "";
}

export function getText(node: Node | Node[]): string {
    if (Array.isArray(node)) return node.map(getText).join("");
    if (isTag(node)) return node.name === "br" ? "\n" : getText(node.children);
    if (isCDATA(node)) return getText(node.children);
    if (isText(node)) return node.data;
    return "";
}
