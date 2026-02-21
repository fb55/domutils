import { parseDocument } from "htmlparser2";

const markup = Array.from({ length: 21 }).join(
    "<?xml><tag1 id='asdf' class='class1'> <script>text</script> <!-- comment --> <tag2> text </tag1>",
);

export default parseDocument(markup).children;
