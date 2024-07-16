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
    limit: number = Infinity,
): AnyNode[] {
    return find(test, Array.isArray(node) ? node : [node], recurse, limit);
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
    limit: number,
): AnyNode[] {
    const result: AnyNode[] = [];
    /** Stack of the arrays we are looking at. */
    const nodeStack = [nodes];
    /** Stack of the indices within the arrays. */
    const indexStack = [0];

    for (;;) {
        // First, check if the current array has any more elements to look at.
        if (indexStack[0] >= nodeStack[0].length) {
            // If we have no more arrays to look at, we are done.
            if (indexStack.length === 1) {
                return result;
            }

            // Otherwise, remove the current array from the stack.
            nodeStack.shift();
            indexStack.shift();

            // Loop back to the start to continue with the next array.
            continue;
        }

        const elem = nodeStack[0][indexStack[0]++];

        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0) return result;
        }

        if (recurse && hasChildren(elem) && elem.children.length > 0) {
            /*
             * Add the children to the stack. We are depth-first, so this is
             * the next array we look at.
             */
            indexStack.unshift(0);
            nodeStack.unshift(elem.children);
        }
    }
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
    nodes: T[],
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
    recurse = true,
): Element | null {
    let elem = null;

    for (let i = 0; i < nodes.length && !elem; i++) {
        const node = nodes[i];
        if (!isTag(node)) {
            continue;
        } else if (test(node)) {
            elem = node;
        } else if (recurse && node.children.length > 0) {
            elem = findOne(test, node.children, true);
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
    nodes: AnyNode[],
): boolean {
    return nodes.some(
        (checked) =>
            isTag(checked) &&
            (test(checked) || existsOne(test, checked.children)),
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
    nodes: AnyNode[],
): Element[] {
    const result = [];
    const nodeStack = [nodes];
    const indexStack = [0];

    for (;;) {
        if (indexStack[0] >= nodeStack[0].length) {
            if (nodeStack.length === 1) {
                return result;
            }

            // Otherwise, remove the current array from the stack.
            nodeStack.shift();
            indexStack.shift();

            // Loop back to the start to continue with the next array.
            continue;
        }

        const elem = nodeStack[0][indexStack[0]++];

        if (!isTag(elem)) continue;
        if (test(elem)) result.push(elem);

        if (elem.children.length > 0) {
            indexStack.unshift(0);
            nodeStack.unshift(elem.children);
        }
    }
}
