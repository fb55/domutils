**domutils**

> [Globals](../README.md) / "helpers"

# Module: "helpers"

## Index

### Enumerations

-   [DocumentPosition](../enums/_helpers_.documentposition.md)

### Functions

-   [compareDocumentPosition](_helpers_.md#comparedocumentposition)
-   [removeSubsets](_helpers_.md#removesubsets)
-   [uniqueSort](_helpers_.md#uniquesort)

## Functions

### compareDocumentPosition

▸ **compareDocumentPosition**(`nodeA`: Node, `nodeB`: Node): number

_Defined in [helpers.ts:74](https://github.com/fb55/domutils/blob/69eb044/src/helpers.ts#L74)_

Compare the position of one node against another node in any other document.
The return value is a bitmask with the following values:

document order:

> There is an ordering, document order, defined on all the nodes in the
> document corresponding to the order in which the first character of the
> XML representation of each node occurs in the XML representation of the
> document after expansion of general entities. Thus, the document element
> node will be the first node. Element nodes occur before their children.
> Thus, document order orders element nodes in order of the occurrence of
> their start-tag in the XML (after expansion of entities). The attribute
> nodes of an element occur after the element and before its children. The
> relative order of attribute nodes is implementation-dependent./

Source:
http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order

#### Parameters:

| Name    | Type | Description                              |
| ------- | ---- | ---------------------------------------- |
| `nodeA` | Node | -                                        |
| `nodeB` | Node | The second node to use in the comparison |

**Returns:** number

---

### removeSubsets

▸ **removeSubsets**(`nodes`: Node[]): Node[]

_Defined in [helpers.ts:9](https://github.com/fb55/domutils/blob/69eb044/src/helpers.ts#L9)_

Given an array of nodes, remove any member that is contained by another.

#### Parameters:

| Name    | Type   | Description      |
| ------- | ------ | ---------------- |
| `nodes` | Node[] | Nodes to filter. |

**Returns:** Node[]

---

### uniqueSort

▸ **uniqueSort**(`nodes`: Node[]): Node[]

_Defined in [helpers.ts:128](https://github.com/fb55/domutils/blob/69eb044/src/helpers.ts#L128)_

Sort an array of nodes based on their relative position in the document and
remove any duplicate nodes. If the array contains nodes that do not belong
to the same document, sort order is unspecified.

#### Parameters:

| Name    | Type   | Description        |
| ------- | ------ | ------------------ |
| `nodes` | Node[] | Array of DOM nodes |

**Returns:** Node[]
