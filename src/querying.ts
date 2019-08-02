import { Node, Element } from "domhandler";
import { isTag, hasChildren } from "./tagtypes";

export function filter(
    test: (elem: Node) => boolean,
    element: Node | Node[],
    recurse: boolean = true,
    limit: number = Infinity
): Node[] {
    if (!Array.isArray(element)) element = [element];
    return find(test, element, recurse, limit);
}

export function find(
    test: (elem: Node) => boolean,
    elems: Node[],
    recurse: boolean,
    limit: number
): Node[] {
    let result: Node[] = [];

    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0) break;
        }

        if (recurse && hasChildren(elem) && elem.children.length > 0) {
            const children = find(test, elem.children, recurse, limit);
            result = result.concat(children);
            limit -= children.length;
            if (limit <= 0) break;
        }
    }

    return result;
}

export function findOneChild(
    test: (elem: Node) => boolean,
    elems: Node[]
): Node | null {
    for (let i = 0; i < elems.length; i++) {
        if (test(elems[i])) return elems[i];
    }

    return null;
}

export function findOne(
    test: (elem: Element) => boolean,
    elems: Node[],
    recurse: boolean = true
): Element | null {
    let elem = null;

    for (let i = 0; i < elems.length && !elem; i++) {
        const checked = elems[i];
        if (!isTag(checked)) {
            continue;
        } else if (test(checked)) {
            elem = checked;
        } else if (recurse && checked.children.length > 0) {
            elem = findOne(test, checked.children);
        }
    }

    return elem;
}

export function existsOne(
    test: (elem: Element) => boolean,
    elems: Node[]
): boolean {
    for (let i = 0; i < elems.length; i++) {
        const checked = elems[i];
        if (
            isTag(checked) &&
            (test(checked) ||
                (checked.children.length > 0 &&
                    existsOne(test, checked.children)))
        ) {
            return true;
        }
    }

    return false;
}

export function findAll(
    test: (elem: Element) => boolean,
    rootElems: Node[]
): Element[] {
    const result: Element[] = [];
    const stack = rootElems.slice();
    while (stack.length) {
        const elem = stack.shift();
        if (!elem || !isTag(elem)) continue;
        if (elem.children && elem.children.length > 0) {
            stack.unshift(...elem.children);
        }
        if (test(elem)) result.push(elem);
    }
    return result;
}
