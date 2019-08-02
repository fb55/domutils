import { makeDom } from "./utils";
const markup = Array(21).join(
    "<?xml><tag1 id='asdf'> <script>text</script> <!-- comment --> <tag2> text </tag1>"
);

export default makeDom(markup);
