import { type AnyNode, hasChildren, type ParentNode } from "domhandler";

/**
 * Given an array of nodes, remove any member that is contained by another
 * member.
 *
 * @category Helpers
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't contained by other nodes.
 */
export function removeSubsets(nodes: AnyNode[]): AnyNode[] {
    const { length } = nodes;

    /*
     * A lone node is the most common input by far, and the only member it can
     * be contained by is itself, so walk its ancestors directly rather than
     * building a set for one entry.
     */
    if (length < 2) {
        if (length === 1) {
            const node = nodes[0];
            for (
                let ancestor = node.parent;
                ancestor;
                ancestor = ancestor.parent
            ) {
                if (ancestor === node) {
                    nodes.length = 0;
                    break;
                }
            }
        }
        return nodes;
    }

    /*
     * Membership is only ever tested against the nodes that were passed in, so
     * collect them up front. That replaces the `includes` scan run for every
     * ancestor of every node, which made this O(n^2 * depth), with an O(1)
     * lookup per ancestor. Each slot is read once and kept, since a getter on
     * the array would otherwise be invoked twice.
     */
    const members = new Set<AnyNode>();
    const slots: AnyNode[] = [];
    for (let index = 0; index < length; index++) {
        const node = nodes[index];
        slots.push(node);
        members.add(node);
    }

    /*
     * A second set is only needed to drop repeats. If every node was distinct
     * there are none, so the common case allocates just the one set.
     */
    const seen = members.size === length ? null : new Set<AnyNode>();
    let kept = 0;

    for (let index = 0; index < length; index++) {
        const node = slots[index];

        /* Keep the first occurrence of each node, as `lastIndexOf` did. */
        if (seen !== null) {
            if (seen.has(node)) continue;
            seen.add(node);
        }

        let contained = false;
        for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
            if (members.has(ancestor)) {
                contained = true;
                break;
            }
        }

        if (contained) continue;

        /*
         * Compact the survivors in place, as the splices did. Only write when
         * the value actually moves, so that an array needing no changes is
         * never written to -- a frozen array survived the original untouched.
         */
        if (kept !== index) nodes[kept] = node;
        kept++;
    }

    if (kept !== length) nodes.length = kept;
    return nodes;
}
/**
 * @category Helpers
 * @see {@link http://dom.spec.whatwg.org/#dom-node-comparedocumentposition}
 */
export const enum DocumentPosition {
    DISCONNECTED = 1,
    PRECEDING = 2,
    FOLLOWING = 4,
    CONTAINS = 8,
    CONTAINED_BY = 16,
}

/**
 * Compare the position of one node against another node in any other document,
 * returning a bitmask with the values from {@link DocumentPosition}.
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent.
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @category Helpers
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */
export function compareDocumentPosition(
    nodeA: AnyNode,
    nodeB: AnyNode,
): number {
    const aParents: ParentNode[] = [];
    const bParents: ParentNode[] = [];

    if (nodeA === nodeB) {
        return 0;
    }

    let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
    while (current) {
        aParents.unshift(current);
        current = current.parent;
    }
    current = hasChildren(nodeB) ? nodeB : nodeB.parent;
    while (current) {
        bParents.unshift(current);
        current = current.parent;
    }

    const maxIndex = Math.min(aParents.length, bParents.length);
    let index = 0;
    while (index < maxIndex && aParents[index] === bParents[index]) {
        index++;
    }

    if (index === 0) {
        return DocumentPosition.DISCONNECTED;
    }

    const sharedParent = aParents[index - 1];
    const siblings: AnyNode[] = sharedParent.children;
    const aSibling = aParents[index];
    const bSibling = bParents[index];

    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
            return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
        }
        return DocumentPosition.FOLLOWING;
    }
    if (sharedParent === nodeA) {
        return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
    }
    return DocumentPosition.PRECEDING;
}

/**
 * Sort an array of nodes based on their relative position in the document,
 * removing any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @category Helpers
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */
export function uniqueSort<T extends AnyNode>(nodes: T[]): T[] {
    /* Nothing to dedupe or sort, and no reason to allocate a Set. */
    if (nodes.length < 2) {
        return nodes;
    }

    /*
     * Keep the LAST occurrence of each node, as `array.includes(node, index + 1)`
     * did. That matters for nodes in different documents: they compare equal, and
     * the sort below is stable, so which duplicate survives decides the output
     * order. Walking backwards and reversing preserves that, while making the
     * dedupe O(n) instead of O(n^2).
     */
    const seen = new Set<T>();
    const unique: T[] = [];
    for (let index = nodes.length - 1; index >= 0; index--) {
        /*
         * `filter` skipped holes in a sparse array, so an absent slot must not
         * become an `undefined` entry in the result.
         */
        if (!(index in nodes)) {
            continue;
        }
        const node = nodes[index];
        if (!seen.has(node)) {
            seen.add(node);
            unique.push(node);
        }
    }
    unique.reverse();
    nodes = unique;

    nodes.sort((a, b) => {
        const relative = compareDocumentPosition(a, b);
        if (relative & DocumentPosition.PRECEDING) {
            return -1;
        }
        if (relative & DocumentPosition.FOLLOWING) {
            return 1;
        }
        return 0;
    });

    return nodes;
}
