import {
    type AnyNode,
    type ChildNode,
    type Element,
    hasChildren,
    isTag,
    type ParentNode,
} from "domhandler";

/**
 * Get a node's children.
 *
 * @category Traversal
 * @param elem Node to get the children of.
 * @param element
 * @returns `elem`'s children, or an empty array.
 */
export function getChildren(element: AnyNode): ChildNode[] {
    return hasChildren(element) ? element.children : [];
}

export function getParent(element: AnyNode): ParentNode | null;
/**
 * Get a node's parent.
 *
 * @category Traversal
 * @param elem Node to get the parent of.
 * @param element
 * @returns `elem`'s parent node, or `null` if `elem` is a root node.
 */
export function getParent(element: AnyNode): ParentNode | null {
    return element.parent || null;
}

/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first. If we don't
 * have a parent (the element is a root node), we walk the element's `prev` &
 * `next` to get all remaining nodes.
 *
 * @category Traversal
 * @param elem Element to get the siblings of.
 * @param element
 * @returns `elem`'s siblings, including `elem`.
 */
export function getSiblings(element: AnyNode): AnyNode[] {
    const parent = getParent(element);
    if (parent != null) return getChildren(parent);

    const siblings = [element];
    let { prev, next } = element;
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
 * @category Traversal
 * @param elem Element to check.
 * @param element
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */
export function getAttributeValue(
    element: Element,
    name: string,
): string | undefined {
    const { attribs } = element as {
        attribs?: Record<string, string | undefined>;
    };
    return attribs?.[name];
}

/**
 * Checks whether an element has an attribute.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param element
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */
export function hasAttrib(element: Element, name: string): boolean {
    const { attribs } = element as { attribs?: Record<string, string | null> };
    return (
        attribs != null && Object.hasOwn(attribs, name) && attribs[name] != null
    );
}

/**
 * Get the tag name of an element.
 *
 * @category Traversal
 * @param elem The element to get the name for.
 * @param element
 * @returns The tag name of `elem`.
 */
export function getName(element: Element): string {
    return element.name;
}

/**
 * Returns the next element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the next sibling of.
 * @param element
 * @returns `elem`'s next sibling that is a tag, or `null` if there is no next
 * sibling.
 */
export function nextElementSibling(element: AnyNode): Element | null {
    let { next } = element;
    while (next !== null && !isTag(next)) ({ next } = next);
    return next;
}

/**
 * Returns the previous element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the previous sibling of.
 * @param element
 * @returns `elem`'s previous sibling that is a tag, or `null` if there is no
 * previous sibling.
 */
export function prevElementSibling(element: AnyNode): Element | null {
    let { prev } = element;
    while (prev !== null && !isTag(prev)) ({ prev } = prev);
    return prev;
}
