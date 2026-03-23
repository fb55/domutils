import type { ChildNode } from "domhandler";
import { parseDocument } from "htmlparser2";

const markup =
    "<?xml><tag1 id='asdf' class='class1'> <script>text</script> <!-- comment --> <tag2> text </tag1>".repeat(
        20,
    );

const children: ChildNode[] = parseDocument(markup).children;
export default children;
