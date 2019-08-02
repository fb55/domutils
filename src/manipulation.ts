import { Node, Element } from "domhandler";

/***
 * Remove an element from the dom
 *
 * @argument elem The element to be removed
 */
export function removeElement(elem: Node) {
    if (elem.prev) elem.prev.next = elem.next;
    if (elem.next) elem.next.prev = elem.prev;

    if (elem.parent) {
        const childs = elem.parent.children;
        childs.splice(childs.lastIndexOf(elem), 1);
    }
}

/***
 * Replace an element in the dom
 *
 * @argument elem The element to be replaced
 * @argument replacement The element to be added
 */
export function replaceElement(elem: Node, replacement: Node) {
    const prev = (replacement.prev = elem.prev);
    if (prev) {
        prev.next = replacement;
    }

    const next = (replacement.next = elem.next);
    if (next) {
        next.prev = replacement;
    }

    const parent = (replacement.parent = elem.parent);
    if (parent) {
        const childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
    }
}

/***
 * Append a child to an element
 *
 * @argument elem The element to append to
 * @argument child The element to be added as a child
 */
export function appendChild(elem: Element, child: Node) {
    child.parent = elem;

    if (elem.children.push(child) !== 1) {
        const sibling = elem.children[elem.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
        child.next = null;
    }
}

/***
 * Append an element after another
 *
 * @argument elem The element to append to
 * @argument next The element be added
 */
export function append(elem: Node, next: Node) {
    const parent = elem.parent,
        currNext = elem.next;

    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;

    if (currNext) {
        currNext.prev = next;
        if (parent) {
            const childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
    } else if (parent) {
        parent.children.push(next);
    }
}

/***
 * Prepend an element before another
 *
 * @argument elem The element to append to
 * @argument prev The element be added
 */
export function prepend(elem: Node, prev: Node) {
    const parent = elem.parent;
    if (parent) {
        const childs = parent.children;
        childs.splice(childs.lastIndexOf(elem), 0, prev);
    }

    if (elem.prev) {
        elem.prev.next = prev;
    }

    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
}
