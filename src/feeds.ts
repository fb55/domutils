import { type AnyNode, type Element, isTag } from "domhandler";
import { getElementsByTagName } from "./legacy.js";
import { find, findAll } from "./querying.js";
import { textContent } from "./stringify.js";

/**
 * The medium of a media item.
 *
 * @category Feeds
 */
export type FeedItemMediaMedium =
    | "image"
    | "audio"
    | "video"
    | "document"
    | "executable";

/**
 * The type of a media item.
 *
 * @category Feeds
 */
export type FeedItemMediaExpression = "sample" | "full" | "nonstop";

/**
 * A media item of a feed entry.
 *
 * @category Feeds
 */
export interface FeedItemMedia {
    medium: FeedItemMediaMedium | undefined;
    isDefault: boolean;
    url?: string;
    fileSize?: number;
    type?: string;
    expression?: FeedItemMediaExpression;
    bitrate?: number;
    framerate?: number;
    samplingrate?: number;
    channels?: number;
    duration?: number;
    height?: number;
    width?: number;
    lang?: string;
}

/**
 * An entry of a feed.
 *
 * @category Feeds
 */
export interface FeedItem {
    id?: string;
    title?: string;
    link?: string;
    description?: string;
    pubDate?: Date;
    media: FeedItemMedia[];
}

/**
 * The root of a feed.
 *
 * @category Feeds
 */
export interface Feed {
    type: string;
    id?: string;
    title?: string;
    link?: string;
    description?: string;
    updated?: Date;
    author?: string;
    items: FeedItem[];
}

/**
 * Get the feed object from the root of a DOM tree.
 *
 * @category Feeds
 * @param document The DOM to extract the feed from.
 * @returns The feed.
 */
export function getFeed(document: AnyNode[]): Feed | null {
    const getNamespace = createNamespaceResolver();
    const feedRoot = getOneElement(
        (element) => isValidFeed(element, getNamespace),
        document,
    );

    if (!feedRoot) return null;
    if (isAtomFeed(feedRoot, getNamespace)) {
        return getAtomFeed(feedRoot, getNamespace);
    }
    return getRssFeed(feedRoot);
}

/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @param getNamespace Resolve an element's namespace within this extraction.
 * @returns The parsed feed.
 */
function getAtomFeed(feedRoot: Element, getNamespace: NamespaceResolver) {
    const childs = feedRoot.children;
    const isNamespaceAware = isAtomElement(feedRoot, "feed", getNamespace);
    const atomTag = (name: string) => (element: Element) =>
        isAtomElement(element, name, getNamespace) ||
        (!isNamespaceAware && element.name === name && !getNamespace(element));
    const mediaTag = (element: Element) => {
        const colon = element.name.indexOf(":");
        if (element.name.slice(colon + 1) !== "content") return false;
        const namespace = getNamespace(element);
        return (
            namespace === MEDIA_NAMESPACE ||
            (!isNamespaceAware &&
                element.name === "media:content" &&
                !namespace)
        );
    };

    const feed: Feed = {
        type: "atom",
        items: findAll(atomTag("entry"), childs).map((item) => {
            const { children } = item;
            const entry: FeedItem = {
                media: getMediaElements(children, mediaTag),
            };

            addConditionally(entry, "id", atomTag("id"), children);
            addConditionally(entry, "title", atomTag("title"), children);

            const href = getAtomLink(children, atomTag("link"));
            if (href) {
                entry.link = href;
            }

            const description =
                fetch(atomTag("summary"), children) ||
                fetch(atomTag("content"), children);
            if (description) {
                entry.description = description;
            }

            const pubDate = fetch(atomTag("updated"), children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }

            return entry;
        }),
    };

    addConditionally(feed, "id", atomTag("id"), childs);
    addConditionally(feed, "title", atomTag("title"), childs);
    const href = getAtomLink(childs, atomTag("link"));
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", atomTag("subtitle"), childs);

    const updated = fetch(atomTag("updated"), childs);
    if (updated) {
        feed.updated = new Date(updated);
    }

    addConditionally(feed, "author", atomTag("email"), childs, true);

    return feed;
}

/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getRssFeed(feedRoot: Element) {
    const childs = getOneElement("channel", feedRoot.children)?.children ?? [];

    const feed: Feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: getElementsByTagName("item", feedRoot.children).map(
            (item: Element) => {
                const { children } = item;
                const entry: FeedItem = { media: getMediaElements(children) };
                addConditionally(entry, "id", "guid", children);
                addConditionally(entry, "title", "title", children);
                addConditionally(entry, "link", "link", children);
                addConditionally(entry, "description", "description", children);
                const pubDate =
                    fetch("pubDate", children) || fetch("dc:date", children);
                if (pubDate) entry.pubDate = new Date(pubDate);

                return entry;
            },
        ),
    };

    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);

    const updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }

    addConditionally(feed, "author", "managingEditor", childs, true);

    return feed;
}

const MEDIA_KEYS_STRING = ["url", "type", "lang"] as const;
const MEDIA_NUMBERS = [
    ["fileSize", Number.parseInt],
    ["bitrate", Number.parseFloat],
    ["framerate", Number.parseFloat],
    ["samplingrate", Number.parseFloat],
    ["channels", Number.parseInt],
    ["duration", Number.parseFloat],
    ["height", Number.parseInt],
    ["width", Number.parseInt],
] as const;

/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @param isMedia Optional namespace-aware predicate for Atom media elements.
 * @returns Media elements.
 */
function getMediaElements(
    where: AnyNode[],
    isMedia?: (element: Element) => boolean,
): FeedItemMedia[] {
    const elements = isMedia
        ? findAll(isMedia, where)
        : getElementsByTagName("media:content", where);
    return elements.map((element) => {
        const { attribs } = element;

        const media: FeedItemMedia = {
            medium: attribs["medium"] as unknown as
                | FeedItemMediaMedium
                | undefined,
            isDefault: !!attribs["isDefault"],
        };

        for (const attrib of MEDIA_KEYS_STRING) {
            const value = attribs[attrib];
            if (value) media[attrib] = value;
        }

        for (const [attrib, parse] of MEDIA_NUMBERS) {
            const value = attribs[attrib];
            if (value) media[attrib] = parse(value, 10);
        }

        if (attribs["expression"]) {
            media.expression = attribs[
                "expression"
            ] as unknown as FeedItemMediaExpression;
        }

        return media;
    });
}

/**
 * Get one element by tag name.
 *
 * @param tagName Tag name or element predicate to look for.
 * @param node Node to search in
 * @param shouldRecurse Whether to recurse into child nodes.
 * @returns The element or null
 */
function getOneElement(
    tagName: string | ((element: Element) => boolean),
    node: AnyNode[],
    shouldRecurse = true,
): Element | null {
    if (typeof tagName === "string") {
        return getElementsByTagName(tagName, node, shouldRecurse, 1)[0];
    }
    return find(
        (element): element is Element => isTag(element) && tagName(element),
        node,
        shouldRecurse,
        1,
    )[0];
}

// eslint-disable-next-line unicorn/prefer-https -- RFC 4287 spells this relation with HTTP.
const ATOM_ALTERNATE = "http://www.iana.org/assignments/relation/alternate";

/**
 * Get the page an Atom feed or entry points to: the first `alternate` link
 * (a link without `rel` is `alternate`, and RFC 4287 also writes it as an
 * IANA URI), else the first link.
 *
 * @param nodes Children of the feed or entry.
 * @param isLink Whether an element is an Atom link.
 * @returns The link's `href`, if any.
 */
function getAtomLink(
    nodes: AnyNode[],
    isLink: (element: Element) => boolean,
): string | undefined {
    let first: Element | undefined;
    for (const node of nodes) {
        if (!(isTag(node) && isLink(node))) continue;
        const { rel: relation } = node.attribs;
        if (
            !relation ||
            relation === "alternate" ||
            relation === ATOM_ALTERNATE
        ) {
            return node.attribs["href"];
        }
        first ??= node;
    }
    return first?.attribs["href"];
}

/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name or element predicate to look for.
 * @param where Node to search in.
 * @param shouldRecurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */
function fetch(
    tagName: string | ((element: Element) => boolean),
    where: AnyNode | AnyNode[],
    shouldRecurse = false,
): string {
    const element = getOneElement(
        tagName,
        Array.isArray(where) ? where : [where],
        shouldRecurse,
    );
    return textContent(element ?? []).trim();
}

/**
 * Adds a property to an object if it has a value.
 *
 * @param object Object to be extended.
 * @param property Property name.
 * @param tagName Tag name or predicate for the conditionally added property.
 * @param where Element to search for the property.
 * @param shouldRecurse Whether to recurse into child nodes.
 */
function addConditionally<T>(
    object: T,
    property: keyof T,
    tagName: string | ((element: Element) => boolean),
    where: AnyNode[],
    shouldRecurse = false,
) {
    const value = fetch(tagName, where, shouldRecurse);
    if (value) object[property] = value as unknown as T[keyof T];
}

/**
 * Checks if an element is a feed root node.
 *
 * @param element The element to check.
 * @param getNamespace Resolve an element's namespace within this extraction.
 * @returns Whether an element is a feed root node.
 */
function isValidFeed(element: Element, getNamespace: NamespaceResolver) {
    return (
        ["rss", "rdf:RDF"].includes(element.name) ||
        isAtomFeed(element, getNamespace)
    );
}

// RFC 4287 defines this exact namespace URI.
const ATOM_NAMESPACE = "http://www.w3.org/2005/Atom";
// eslint-disable-next-line unicorn/prefer-https -- Media RSS defines this exact namespace URI.
const MEDIA_NAMESPACE = "http://search.yahoo.com/mrss/";

type NamespaceResolver = (element: Element) => string | undefined;

/**
 * Accept an Atom root, retaining support for truly unnamespaced legacy feeds.
 *
 * @param element The element to check.
 * @param getNamespace Resolve an element's namespace within this extraction.
 * @returns Whether the element is an Atom or legacy feed root.
 */
function isAtomFeed(
    element: Element,
    getNamespace: NamespaceResolver,
): boolean {
    return (
        isAtomElement(element, "feed", getNamespace) ||
        (element.name === "feed" && !getNamespace(element))
    );
}

/**
 * Match an Atom local name using the element's in-scope namespace declaration.
 *
 * @param element The element to check.
 * @param name The local name to match.
 * @param getNamespace Resolve an element's namespace within this extraction.
 * @returns Whether the element belongs to the Atom namespace.
 */
function isAtomElement(
    element: Element,
    name: string,
    getNamespace: NamespaceResolver,
): boolean {
    const colon = element.name.indexOf(":");
    return (
        element.name.slice(colon + 1) === name &&
        getNamespace(element) === ATOM_NAMESPACE
    );
}

/**
 * Cache inherited bindings for one extraction, including empty namespace resets.
 *
 * @returns A resolver that visits each ancestor once per namespace prefix.
 */
function createNamespaceResolver(): NamespaceResolver {
    const namespaces = new Map<string, WeakMap<AnyNode, string | undefined>>();
    return (element) => {
        const colon = element.name.indexOf(":");
        const declaration =
            colon === -1 ? "xmlns" : `xmlns:${element.name.slice(0, colon)}`;
        let bindings = namespaces.get(declaration);
        if (!bindings) {
            bindings = new WeakMap();
            namespaces.set(declaration, bindings);
        }

        const ancestors: AnyNode[] = [];
        let namespace: string | undefined;
        for (let node: AnyNode | null = element; node; node = node.parent) {
            if (bindings.has(node)) {
                namespace = bindings.get(node);
                break;
            }
            ancestors.push(node);
            if (isTag(node) && Object.hasOwn(node.attribs, declaration)) {
                namespace = node.attribs[declaration];
                break;
            }
        }
        for (const node of ancestors) bindings.set(node, namespace);
        return namespace;
    };
}
