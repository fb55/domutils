import type { ChildNode, ParentNode } from "domhandler";

/**
 * Remove an element from the dom
 *
 * @category Manipulation
 * @param element The element to be removed.
 */
export function removeElement(element: ChildNode): void {
    if (element.prev) element.prev.next = element.next;
    if (element.next) element.next.prev = element.prev;

    if (element.parent) {
        const childs = element.parent.children;
        const childsIndex = childs.lastIndexOf(element);
        if (childsIndex !== -1) {
            childs.splice(childsIndex, 1);
        }
    }
    element.next = null;
    element.prev = null;
    element.parent = null;
}

/**
 * Check whether `node` is `target` itself or one of its ancestors.
 *
 * The walk up from `target` stops at `node`'s parent, and after as many steps
 * as `node` has descendants, so it is bounded by the smaller of the two.
 *
 * @param node The potential ancestor.
 * @param target The node to start from.
 * @returns Whether `node` is `target` or one of its ancestors.
 */
function isInclusiveAncestor(node: ChildNode, target: ChildNode): boolean {
    if (!("children" in node)) return node === target;

    // Steps through `node`'s descendants in document order, once per step up.
    let descendant: ChildNode | null = node.children[0] ?? null;

    for (
        let current: ChildNode | null = target;
        current !== null && current !== node.parent;
        current = current.parent
    ) {
        if (current === node) return true;
        if (descendant === null) return false;

        if ("children" in descendant && descendant.children.length > 0) {
            descendant = descendant.children[0];
        } else {
            // Children passed to domhandler's constructors have no `parent`.
            while (
                descendant.next === null &&
                descendant.parent !== node &&
                descendant.parent !== null
            ) {
                descendant = descendant.parent;
            }
            descendant = descendant.next;
        }
    }

    return false;
}

/**
 * Replace an element in the dom
 *
 * @category Manipulation
 * @param element The element to be replaced.
 * @param replacement The element to be added
 */
export function replaceElement(
    element: ChildNode,
    replacement: ChildNode,
): void {
    if (isInclusiveAncestor(replacement, element)) return;
    removeElement(replacement);

    replacement.prev = element.prev;
    if (replacement.prev) {
        replacement.prev.next = replacement;
    }

    replacement.next = element.next;
    if (replacement.next) {
        replacement.next.prev = replacement;
    }

    replacement.parent = element.parent;
    if (replacement.parent) {
        const { children } = replacement.parent;
        const elementIndex = children.lastIndexOf(element);
        if (elementIndex === -1) {
            return;
        }

        children[elementIndex] = replacement;
        element.parent = null;
    }
    element.prev = null;
    element.next = null;
}

/**
 * Append a child to an element.
 *
 * @category Manipulation
 * @param parent The element to append to.
 * @param child The element to be added as a child.
 */
export function appendChild(parent: ParentNode, child: ChildNode): void {
    if (isInclusiveAncestor(child, parent)) return;
    removeElement(child);

    child.next = null;
    child.parent = parent;

    parent.children.push(child);
    if (parent.children.length > 1) {
        const sibling = parent.children[parent.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
    } else {
        child.prev = null;
    }
}

/**
 * Append an element after another.
 *
 * @category Manipulation
 * @param element The element to append after.
 * @param next The element be added.
 */
export function append(element: ChildNode, next: ChildNode): void {
    if (isInclusiveAncestor(next, element)) return;
    removeElement(next);

    const { parent } = element;
    const currentNext = element.next;

    next.next = currentNext;
    next.prev = element;
    element.next = next;
    next.parent = parent;

    if (currentNext) {
        currentNext.prev = next;
        if (parent) {
            const childs = parent.children;
            childs.splice(childs.lastIndexOf(currentNext), 0, next);
        }
    } else if (parent) {
        parent.children.push(next);
    }
}

/**
 * Prepend a child to an element.
 *
 * @category Manipulation
 * @param parent The element to prepend before.
 * @param child The element to be added as a child.
 */
export function prependChild(parent: ParentNode, child: ChildNode): void {
    if (isInclusiveAncestor(child, parent)) return;
    removeElement(child);

    child.parent = parent;
    child.prev = null;

    parent.children.unshift(child);
    if (parent.children.length === 1) {
        child.next = null;
    } else {
        const [, sibling] = parent.children;
        sibling.prev = child;
        child.next = sibling;
    }
}

/**
 * Prepend an element before another.
 *
 * @category Manipulation
 * @param element The element to prepend before.
 * @param previous The element to be added.
 */
export function prepend(element: ChildNode, previous: ChildNode): void {
    if (isInclusiveAncestor(previous, element)) return;
    removeElement(previous);

    const { parent } = element;
    if (parent) {
        const childs = parent.children;
        childs.splice(childs.indexOf(element), 0, previous);
    }

    if (element.prev) {
        element.prev.next = previous;
    }

    previous.parent = parent;
    previous.prev = element.prev;
    previous.next = element;
    element.prev = previous;
}
