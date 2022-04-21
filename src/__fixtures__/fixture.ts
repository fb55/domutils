import { Parser, ParserOptions } from "htmlparser2";
import DomHandler, { Document } from "domhandler";

/**
 * Re-implementation of htmlparser2's `parseDocument` function.
 *
 * @param str String to parse.
 * @param options Optional parser options to use.
 * @returns The parsed document.
 */
export function parseDocument(str: string, options?: ParserOptions): Document {
    const handler = new DomHandler();
    new Parser(handler, options).end(str);
    return handler.root;
}

const markup = Array(21).join(
    "<?xml><tag1 id='asdf'> <script>text</script> <!-- comment --> <tag2> text </tag1>"
);

export default parseDocument(markup).children;
