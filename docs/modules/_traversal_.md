**[domutils](../README.md)**

> [Globals](../README.md) / "traversal"

# Module: "traversal"

## Index

### Functions

-   [getAttributeValue](_traversal_.md#getattributevalue)
-   [getChildren](_traversal_.md#getchildren)
-   [getName](_traversal_.md#getname)
-   [getParent](_traversal_.md#getparent)
-   [getSiblings](_traversal_.md#getsiblings)
-   [hasAttrib](_traversal_.md#hasattrib)
-   [nextElementSibling](_traversal_.md#nextelementsibling)

## Functions

### getAttributeValue

▸ **getAttributeValue**(`elem`: Element, `name`: string): string \| undefined

_Defined in [traversal.ts:61](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L61)_

Gets an attribute from an element.

#### Parameters:

| Name   | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `elem` | Element | Element to check.           |
| `name` | string  | Attribute name to retrieve. |

**Returns:** string \| undefined

The element's attribute value, or `undefined`.

---

### getChildren

▸ **getChildren**(`elem`: Node): Node[]

_Defined in [traversal.ts:11](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L11)_

Get a node's children.

#### Parameters:

| Name   | Type | Description                  |
| ------ | ---- | ---------------------------- |
| `elem` | Node | Node to get the children of. |

**Returns:** Node[]

`elem`'s children, or an empty array.

---

### getName

▸ **getName**(`elem`: Element): string

_Defined in [traversal.ts:89](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L89)_

Get the tag name of an element.

#### Parameters:

| Name   | Type    | Description                      |
| ------ | ------- | -------------------------------- |
| `elem` | Element | The element to get the name for. |

**Returns:** string

The tag name of `elem`.

---

### getParent

▸ **getParent**(`elem`: Element): Element \| null

_Defined in [traversal.ts:15](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L15)_

Get a node's parent.

#### Parameters:

| Name   | Type    | Description                |
| ------ | ------- | -------------------------- |
| `elem` | Element | Node to get the parent of. |

**Returns:** Element \| null

`elem`'s parent node.

▸ **getParent**(`elem`: Node): NodeWithChildren \| null

_Defined in [traversal.ts:16](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L16)_

Get a node's parent.

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `elem` | Node |

**Returns:** NodeWithChildren \| null

`elem`'s parent node.

---

### getSiblings

▸ **getSiblings**(`elem`: Node): Node[]

_Defined in [traversal.ts:37](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L37)_

Gets an elements siblings, including the element itself.

Attempts to get the children through the element's parent first.
If we don't have a parent (the element is a root node),
we walk the element's `prev` & `next` to get all remaining nodes.

#### Parameters:

| Name   | Type | Description                     |
| ------ | ---- | ------------------------------- |
| `elem` | Node | Element to get the siblings of. |

**Returns:** Node[]

`elem`'s siblings.

---

### hasAttrib

▸ **hasAttrib**(`elem`: Element, `name`: string): boolean

_Defined in [traversal.ts:75](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L75)_

Checks whether an element has an attribute.

#### Parameters:

| Name   | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `elem` | Element | Element to check.           |
| `name` | string  | Attribute name to look for. |

**Returns:** boolean

Returns whether `elem` has the attribute `name`.

---

### nextElementSibling

▸ **nextElementSibling**(`elem`: Node): Node \| null

_Defined in [traversal.ts:99](https://github.com/fb55/domutils/blob/3813e44/src/traversal.ts#L99)_

Returns the next element sibling of a node.

#### Parameters:

| Name   | Type | Description                             |
| ------ | ---- | --------------------------------------- |
| `elem` | Node | The element to get the next sibling of. |

**Returns:** Node \| null

`elem`'s next sibling that is a tag.
