import type { Node, Element } from "domhandler";
import { isTag, hasChildren } from "./tagtypes";

/**
 * Search a node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
export function filter(
    test: (elem: Node) => boolean,
    node: Node | Node[],
    recurse = true,
    limit = Infinity
): Node[] {
    if (!Array.isArray(node)) node = [node];
    return find(test, node, recurse, limit);
}

/**
 * Search an array of node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
export function find(
    test: (elem: Node) => boolean,
    nodes: Node[],
    recurse: boolean,
    limit: number
): Node[] {
    const result: Node[] = [];

    for (const elem of nodes) {
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0) break;
        }

        if (recurse && hasChildren(elem) && elem.children.length > 0) {
            const children = find(test, elem.children, recurse, limit);
            result.push(...children);
            limit -= children.length;
            if (limit <= 0) break;
        }
    }

    return result;
}

/**
 * Finds the first element inside of an array that matches a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 */
export function findOneChild(
    test: (elem: Node) => boolean,
    nodes: Node[]
): Node | undefined {
    return nodes.find(test);
}

/**
 * Finds one element in a tree that passes a test.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first child node that passes `test`.
 */
export function findOne(
    test: (elem: Element) => boolean,
    nodes: Node[],
    recurse = true
): Element | null {
    let elem = null;

    for (let i = 0; i < nodes.length && !elem; i++) {
        const checked = nodes[i];
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

/**
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing a test.
 */
export function existsOne(
    test: (elem: Element) => boolean,
    nodes: Node[]
): boolean {
    return nodes.some(
        (checked) =>
            isTag(checked) &&
            (test(checked) ||
                (checked.children.length > 0 &&
                    existsOne(test, checked.children)))
    );
}

/**
 * Search and array of nodes and its children for nodes passing a test function.
 *
 * Same as `find`, only with less options, leading to reduced complexity.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */
export function findAll(
    test: (elem: Element) => boolean,
    nodes: Node[]
): Element[] {
    const result: Element[] = [];
    const stack = nodes.filter(isTag);
    let elem;
    while ((elem = stack.shift())) {
        const children = elem.children?.filter(isTag);
        if (children && children.length > 0) {
            stack.unshift(...children);
        }
        if (test(elem)) result.push(elem);
    }
    return result;
}
