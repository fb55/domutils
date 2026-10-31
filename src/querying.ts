import {
    type AnyNode,
    type Element,
    hasChildren,
    isTag,
    type ParentNode,
} from "domhandler";

/**
 * Search a node and its children for nodes passing a test function. If `node` is not an array, it will be wrapped in one.
 *
 * @category Querying
 * @param isMatch Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param shouldRecurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `isMatch`.
 */
export function filter(
    isMatch: (element: AnyNode) => boolean,
    node: AnyNode | AnyNode[],
    shouldRecurse = true,
    limit: number = Number.POSITIVE_INFINITY,
): AnyNode[] {
    return find(
        isMatch,
        Array.isArray(node) ? node : [node],
        shouldRecurse,
        limit,
    );
}

/**
 * Search an array of nodes and their children for nodes passing a test function.
 *
 * @category Querying
 * @param isMatch Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param shouldRecurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `isMatch`.
 */
export function find(
    isMatch: (element: AnyNode) => boolean,
    nodes: AnyNode[] | ParentNode,
    shouldRecurse: boolean,
    limit: number,
): AnyNode[] {
    const result: AnyNode[] = [];
    if (limit <= 0) return result;

    /** Stack of the arrays we are looking at. */
    const nodeStack: AnyNode[][] = [Array.isArray(nodes) ? nodes : [nodes]];
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

        const element = nodeStack[0][indexStack[0]++];

        if (isMatch(element)) {
            result.push(element);
            if (--limit <= 0) return result;
        }

        if (
            shouldRecurse &&
            hasChildren(element) &&
            element.children.length > 0
        ) {
            /*
             * Add the children to the stack. We are depth-first, so this is
             * the next array we look at.
             */
            indexStack.unshift(0);
            nodeStack.unshift(element.children);
        }
    }
}

/**
 * Finds one element in a tree that passes a test.
 *
 * @category Querying
 * @param isMatch Function to test nodes on.
 * @param nodes Node or array of nodes to search.
 * @param shouldRecurse Also consider child nodes.
 * @returns The first node that passes `isMatch`.
 */
export function findOne(
    isMatch: (element: Element) => boolean,
    nodes: AnyNode[] | ParentNode,
    shouldRecurse = true,
): Element | null {
    const searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
    for (const node of searchedNodes) {
        if (isTag(node) && isMatch(node)) {
            return node;
        }
        if (shouldRecurse && hasChildren(node) && node.children.length > 0) {
            const found = findOne(isMatch, node.children, true);
            if (found) return found;
        }
    }

    return null;
}

/**
 * Checks if a tree of nodes contains at least one node passing a test.
 *
 * @category Querying
 * @param isMatch Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing the test.
 */
// eslint-disable-next-line unicorn/consistent-boolean-name -- Preserve the existing exported function name.
export function existsOne(
    isMatch: (element: Element) => boolean,
    nodes: AnyNode[] | ParentNode,
): boolean {
    return (Array.isArray(nodes) ? nodes : [nodes]).some(
        (node) =>
            (isTag(node) && isMatch(node)) ||
            (hasChildren(node) && existsOne(isMatch, node.children)),
    );
}

/**
 * Search an array of nodes and their children for elements passing a test function.
 *
 * Same as `find`, but limited to elements and with less options, leading to reduced complexity.
 *
 * @category Querying
 * @param isMatch Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `isMatch`.
 */
export function findAll(
    isMatch: (element: Element) => boolean,
    nodes: AnyNode[] | ParentNode,
): Element[] {
    const result = [];
    const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
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

        const element = nodeStack[0][indexStack[0]++];

        if (isTag(element) && isMatch(element)) result.push(element);

        if (hasChildren(element) && element.children.length > 0) {
            indexStack.unshift(0);
            nodeStack.unshift(element.children);
        }
    }
}
