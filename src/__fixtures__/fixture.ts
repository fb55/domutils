import { parseDocument } from "htmlparser2";

const markup = (
    "<?xml><tag1 id='asdf' class='class1'> <script>text</script> <!-- comment --> <tag2> text </tag1>"
).repeat(20);

export default parseDocument(markup).children;
