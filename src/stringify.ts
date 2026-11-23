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
        ? // oxlint-disable-next-line no-shadow, typescript/no-deprecated -- Keep the legacy serializer call and its child parameter.
          node.children.map((node) => getOuterHTML(node, options)).join("")
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
    // oxlint-disable-next-line typescript/no-deprecated -- Recurse through the legacy text serializer.
    if (Array.isArray(node)) return node.map(getText).join("");
    if (isTag(node))
        // oxlint-disable-next-line curly, typescript/no-deprecated -- Keep the single-statement branch and legacy recursion.
        return node.name === "br" ? "\n" : node.children.map(getText).join("");
    // oxlint-disable-next-line typescript/no-deprecated -- Recurse through the legacy text serializer.
    if (isCDATA(node)) return node.children.map(getText).join("");
    if (isText(node)) return node.data;
    return "";
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
    if (Array.isArray(node)) return node.map(textContent).join("");
    if (hasChildren(node) && !isComment(node)) {
        return node.children.map(textContent).join("");
    }
    if (isText(node)) return node.data;
    return "";
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
    if (Array.isArray(node)) return node.map(innerText).join("");
    if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) {
        return node.children.map(innerText).join("");
    }
    if (isText(node)) return node.data;
    return "";
}
