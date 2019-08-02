import { Node, Element, NodeWithChildren, DataNode } from "domhandler";
import { ElementType, isTag as isTagRaw } from "domelementtype";

export function isTag(node: Node): node is Element {
    return isTagRaw(node);
}

export function isCDATA(node: Node): node is NodeWithChildren {
    return ElementType.CDATA === node.type;
}

export function isText(node: Node): node is DataNode {
    return node.type === ElementType.Text;
}

export function isComment(node: Node): node is DataNode {
    return node.type === ElementType.Comment;
}

export function hasChildren(node: Node): node is NodeWithChildren {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
