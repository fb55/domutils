import { isTag, isText, AnyNode, Element } from "domhandler";
import type { ElementType } from "domelementtype";
import { filter, findOne } from "./querying.js";

type TestType = (elem: AnyNode) => boolean;

/**
 * An object with keys to check elements against. If a key is `tag_name`,
 * `tag_type` or `tag_contains`, it will check the value against that specific
 * value. Otherwise, it will check an attribute with the key's name.
 *
 * @category Legacy Query Functions
 */
export interface TestElementOpts {
    tag_name?: string | ((name: string) => boolean);
    tag_type?: string | ((name: string) => boolean);
    tag_contains?: string | ((data?: string) => boolean);
    [attributeName: string]:
        | undefined
        | string
        | ((attributeValue: string) => boolean);
}

/**
 * A map of functions to check nodes against.
 */
const Checks: Record<
    string,
    (value: string | undefined | ((str: string) => boolean)) => TestType
> = {
    tag_name(name) {
        if (typeof name === "function") {
            return (elem: AnyNode) => isTag(elem) && name(elem.name);
        } else if (name === "*") {
            return isTag;
        }
        return (elem: AnyNode) => isTag(elem) && elem.name === name;
    },
    tag_type(type) {
        if (typeof type === "function") {
            return (elem: AnyNode) => type(elem.type);
        }
        return (elem: AnyNode) => elem.type === type;
    },
    tag_contains(data) {
        if (typeof data === "function") {
            return (elem: AnyNode) => isText(elem) && data(elem.data);
        }
        return (elem: AnyNode) => isText(elem) && elem.data === data;
    },
};

/**
 * Returns a function to check whether a node has an attribute with a particular
 * value.
 *
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a
 *   particular value.
 */
function getAttribCheck(
    attrib: string,
    value: undefined | string | ((value: string) => boolean)
): TestType {
    if (typeof value === "function") {
        return (elem: AnyNode) => isTag(elem) && value(elem.attribs[attrib]);
    }
    return (elem: AnyNode) => isTag(elem) && elem.attribs[attrib] === value;
}

/**
 * Returns a function that returns `true` if either of the input functions
 * returns `true` for a node.
 *
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either of the input
 *   functions returns `true` for the node.
 */
function combineFuncs(a: TestType, b: TestType): TestType {
    return (elem: AnyNode) => a(elem) || b(elem);
}

/**
 * Returns a function that executes all checks in `options` and returns `true`
 * if any of them match a node.
 *
 * @param options An object describing nodes to look for.
 * @returns A function that executes all checks in `options` and returns `true`
 *   if any of them match a node.
 */
function compileTest(options: TestElementOpts): TestType | null {
    const funcs = Object.keys(options).map((key) => {
        const value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key)
            ? Checks[key](value)
            : getAttribCheck(key, value);
    });

    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}

/**
 * Checks whether a node matches the description in `options`.
 *
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */
export function testElement(options: TestElementOpts, node: AnyNode): boolean {
    const test = compileTest(options);
    return test ? test(node) : true;
}

/**
 * Returns all nodes that match `options`.
 *
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */
export function getElements(
    options: TestElementOpts,
    nodes: AnyNode | AnyNode[],
    recurse: boolean,
    limit = Infinity
): AnyNode[] {
    const test = compileTest(options);
    return test ? filter(test, nodes, recurse, limit) : [];
}

/**
 * Returns the node with the supplied ID.
 *
 * @category Legacy Query Functions
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */
export function getElementById(
    id: string | ((id: string) => boolean),
    nodes: AnyNode | AnyNode[],
    recurse = true
): Element | null {
    if (!Array.isArray(nodes)) nodes = [nodes];
    return findOne(getAttribCheck("id", id), nodes, recurse);
}

/**
 * Returns all nodes with the supplied `tagName`.
 *
 * @category Legacy Query Functions
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */
export function getElementsByTagName(
    tagName: string | ((name: string) => boolean),
    nodes: AnyNode | AnyNode[],
    recurse = true,
    limit = Infinity
): Element[] {
    return filter(
        Checks["tag_name"](tagName),
        nodes,
        recurse,
        limit
    ) as Element[];
}

/**
 * Returns all nodes with the supplied `type`.
 *
 * @category Legacy Query Functions
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */
export function getElementsByTagType(
    type: ElementType | ((type: ElementType) => boolean),
    nodes: AnyNode | AnyNode[],
    recurse = true,
    limit = Infinity
): AnyNode[] {
    return filter(Checks["tag_type"](type as string), nodes, recurse, limit);
}
