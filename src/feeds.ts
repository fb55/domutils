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
    const feedRoot = getOneElement(isValidFeed, document);

    if (!feedRoot) return null;
    if (isAtomFeed(feedRoot)) {
        return getAtomFeed(feedRoot);
    }
    return getRssFeed(feedRoot);
}

/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getAtomFeed(feedRoot: Element) {
    const childs = feedRoot.children;
    const isNamespaceAware = isAtomElement(feedRoot, "feed");
    const atomTag = (name: string) => (element: Element) =>
        isNamespaceAware ? isAtomElement(element, name) : element.name === name;

    const feed: Feed = {
        type: "atom",
        items: findAll(atomTag("entry"), childs).map((item) => {
            const { children } = item;
            const entry: FeedItem = { media: getMediaElements(children) };

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
 * @returns Media elements.
 */
function getMediaElements(where: AnyNode[]): FeedItemMedia[] {
    return getElementsByTagName("media:content", where).map((element) => {
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
 * @returns Whether an element is a feed root node.
 */
function isValidFeed(element: Element) {
    return ["rss", "rdf:RDF"].includes(element.name) || isAtomFeed(element);
}

// RFC 4287 defines this exact namespace URI.
const ATOM_NAMESPACE = "http://www.w3.org/2005/Atom";

/**
 * Accept an Atom root, retaining support for truly unnamespaced legacy feeds.
 *
 * @param element The element to check.
 * @returns Whether the element is an Atom or legacy feed root.
 */
function isAtomFeed(element: Element): boolean {
    return (
        isAtomElement(element, "feed") ||
        (element.name === "feed" && !getNamespace(element))
    );
}

/**
 * Match an Atom local name using the element's in-scope namespace declaration.
 *
 * @param element The element to check.
 * @param name The local name to match.
 * @returns Whether the element belongs to the Atom namespace.
 */
function isAtomElement(element: Element, name: string): boolean {
    const colon = element.name.indexOf(":");
    return (
        element.name.slice(colon + 1) === name &&
        getNamespace(element) === ATOM_NAMESPACE
    );
}

/**
 * Read the nearest namespace binding, including an empty default reset.
 *
 * @param element The element whose namespace to resolve.
 * @returns The declared namespace URI, or undefined if none is in scope.
 */
function getNamespace(element: Element): string | undefined {
    const colon = element.name.indexOf(":");
    const declaration =
        colon === -1 ? "xmlns" : `xmlns:${element.name.slice(0, colon)}`;
    for (let node: AnyNode | null = element; node; node = node.parent) {
        if (isTag(node) && Object.hasOwn(node.attribs, declaration)) {
            return node.attribs[declaration];
        }
    }
    return undefined;
}
