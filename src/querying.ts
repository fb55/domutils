import { isTag, hasChildren, Element, AnyNode } from "domhandler";

/**
 * Search a node and its children for nodes passing a test function. If `node` is not an array, it will be wrapped in one.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
export function filter(
    test: (elem: AnyNode) => boolean,
    node: AnyNode | AnyNode[],
    recurse = true,
    limit = Infinity
): AnyNode[] {
    if (!Array.isArray(node)) node = [node];
    return find(test, node, recurse, limit);
}

/**
 * Search an array of nodes and their children for nodes passing a test function.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
export function find(
    test: (elem: AnyNode) => boolean,
    nodes: AnyNode[],
    recurse: boolean,
    limit: number
): AnyNode[] {
    const result: AnyNode[] = [];

    for (const elem of nodes) {
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0) break;
        }

        if (recurse && hasChildren(elem) && elem.children.length > 0) {
            const children = find(test, elem.children, recurse, limit);
            const chunksize = 1024;
            for (let i = 0; i < children.length; i += chunksize) {
                result.push(...children.slice(i, i + chunksize));
            }
            limit -= children.length;
            if (limit <= 0) break;
        }
    }

    return result;
}

/**
 * Finds the first element inside of an array that matches a test function. This is an alias for `Array.prototype.find`.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 * @deprecated Use `Array.prototype.find` directly.
 */
export function findOneChild<T>(
    test: (elem: T) => boolean,
    nodes: T[]
): T | undefined {
    return nodes.find(test);
}

/**
 * Finds one element in a tree that passes a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Node or array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first node that passes `test`.
 */
export function findOne(
    test: (elem: Element) => boolean,
    nodes: AnyNode[],
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
            elem = findOne(test, checked.children, true);
        }
    }

    return elem;
}

/**
 * Checks if a tree of nodes contains at least one node passing a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing the test.
 */
export function existsOne(
    test: (elem: Element) => boolean,
    nodes: AnyNode[]
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
 * Search an array of nodes and their children for elements passing a test function.
 *
 * Same as `find`, but limited to elements and with less options, leading to reduced complexity.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */
export function findAll(
    test: (elem: Element) => boolean,
    nodes: AnyNode[]
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
