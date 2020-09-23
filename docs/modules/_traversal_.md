**domutils**

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

_Defined in [traversal.ts:46](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L46)_

Gets an attribute from an element.

#### Parameters:

| Name   | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `elem` | Element | Element to check.           |
| `name` | string  | Attribute name to retrieve. |

**Returns:** string \| undefined

---

### getChildren

▸ **getChildren**(`elem`: Node): Node[]

_Defined in [traversal.ts:4](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L4)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `elem` | Node |

**Returns:** Node[]

---

### getName

▸ **getName**(`elem`: Element): string

_Defined in [traversal.ts:71](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L71)_

Returns the name property of an element

#### Parameters:

| Name   | Type    | Description                     |
| ------ | ------- | ------------------------------- |
| `elem` | Element | The element to get the name for |

**Returns:** string

---

### getParent

▸ **getParent**(`elem`: Element): Element \| null

_Defined in [traversal.ts:8](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L8)_

#### Parameters:

| Name   | Type    |
| ------ | ------- |
| `elem` | Element |

**Returns:** Element \| null

▸ **getParent**(`elem`: Node): NodeWithChildren \| null

_Defined in [traversal.ts:9](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L9)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `elem` | Node |

**Returns:** NodeWithChildren \| null

---

### getSiblings

▸ **getSiblings**(`elem`: Node): Node[]

_Defined in [traversal.ts:23](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L23)_

Gets an elements siblings, including the element itself.

Attempts to get the children through the element's parent first.
If we don't have a parent (the element is a root node),
we walk the element's `prev` & `next` to get all remaining nodes.

#### Parameters:

| Name   | Type | Description                     |
| ------ | ---- | ------------------------------- |
| `elem` | Node | Element to get the siblings of. |

**Returns:** Node[]

---

### hasAttrib

▸ **hasAttrib**(`elem`: Element, `name`: string): boolean

_Defined in [traversal.ts:59](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L59)_

Checks whether an element has an attribute.

#### Parameters:

| Name   | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `elem` | Element | Element to check.           |
| `name` | string  | Attribute name to look for. |

**Returns:** boolean

---

### nextElementSibling

▸ **nextElementSibling**(`elem`: Node): Node \| null

_Defined in [traversal.ts:75](https://github.com/fb55/domutils/blob/69eb044/src/traversal.ts#L75)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `elem` | Node |

**Returns:** Node \| null
