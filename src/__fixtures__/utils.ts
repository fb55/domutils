import DomHandler, { Node } from "domhandler";
import { Parser } from "htmlparser2";

export function makeDom(markup: string): Node[] {
    const handler = new DomHandler();
    const parser = new Parser(handler);
    parser.write(markup);
    parser.done();
    return handler.dom;
}
