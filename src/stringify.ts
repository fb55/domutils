import renderHTML, { type DomSerializerOptions } from "dom-serializer";
import { ElementType } from "domelementtype";
import {
    type AnyNode,
    hasChildren,
    isCDATA,
    isComment,
    isTag,
    isText,
} from "domhandler";

/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @returns `node`'s outer HTML.
 */
export function getOuterHTML(
    node: AnyNode | ArrayLike<AnyNode>,
    options?: DomSerializerOptions,
): string {
    return renderHTML(node, options);
}

/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @returns `node`'s inner HTML.
 */
export function getInnerHTML(
    node: AnyNode,
    options?: DomSerializerOptions,
): string {
    return hasChildren(node)
        ? node.children.map((node) => getOuterHTML(node, options)).join("")
        : "";
}

/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags. Ignores comments.
 *
 * @category Stringify
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */
export function getText(node: AnyNode | AnyNode[]): string {
    return collectText(node, (node) => {
        if (isTag(node)) return node.name === "br" ? "\n" : node.children;
        if (isCDATA(node)) return node.children;
        return isText(node) ? node.data : "";
    });
}

/**
 * Get a node's text content. Ignores comments.
 *
 * @category Stringify
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */
export function textContent(node: AnyNode | AnyNode[]): string {
    return collectText(node, (node) => {
        if (hasChildren(node) && !isComment(node)) return node.children;
        return isText(node) ? node.data : "";
    });
}

/**
 * Get a node's inner text, ignoring `<script>` and `<style>` tags. Ignores comments.
 *
 * @category Stringify
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */
export function innerText(node: AnyNode | AnyNode[]): string {
    return collectText(node, (node) => {
        if (
            hasChildren(node) &&
            (node.type === ElementType.Tag || isCDATA(node))
        ) {
            return node.children;
        }
        return isText(node) ? node.data : "";
    });
}

/**
 * Collect text with traversal state on the heap instead of the call stack.
 *
 * @param node Node or nodes to visit.
 * @param content Text or children selected by the public helper.
 * @returns The selected text in document order.
 */
function collectText(
    node: AnyNode | AnyNode[],
    content: (node: AnyNode) => string | AnyNode[],
): string {
    const nodes = Array.isArray(node) ? node : [node];
    const stack = [{ nodes, index: 0, length: nodes.length }];
    const result: string[] = [];

    while (stack.length > 0) {
        const frame = stack[stack.length - 1];
        if (frame.index >= frame.length) {
            stack.pop();
            continue;
        }

        const index = frame.index++;
        // Array#map skips holes, while still visiting inherited indices.
        if (!Reflect.has(frame.nodes, index)) continue;
        const value = content(frame.nodes[index]);
        if (typeof value === "string") {
            if (value.length > 0) result.push(value);
        } else {
            const { length } = value;
            if (length > 0) stack.push({ nodes: value, index: 0, length });
        }
    }

    return result.join("");
}
