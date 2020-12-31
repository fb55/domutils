import type { Node, Element, NodeWithChildren, DataNode } from "domhandler";
import { ElementType, isTag as isTagRaw } from "domelementtype";

/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */
export function isTag(node: Node): node is Element {
    return isTagRaw(node);
}

/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */
export function isCDATA(node: Node): node is NodeWithChildren {
    return node.type === ElementType.CDATA;
}

/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */
export function isText(node: Node): node is DataNode {
    return node.type === ElementType.Text;
}

/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */
export function isComment(node: Node): node is DataNode {
    return node.type === ElementType.Comment;
}

/**
 * @param node Node to check.
 * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
 */
export function hasChildren(node: Node): node is NodeWithChildren {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
