**domutils**

> [Globals](../README.md) / "manipulation"

# Module: "manipulation"

## Index

### Functions

-   [append](_manipulation_.md#append)
-   [appendChild](_manipulation_.md#appendchild)
-   [prepend](_manipulation_.md#prepend)
-   [removeElement](_manipulation_.md#removeelement)
-   [replaceElement](_manipulation_.md#replaceelement)

## Functions

### append

▸ **append**(`elem`: Node, `next`: Node): void

_Defined in [manipulation.ts:67](https://github.com/fb55/domutils/blob/69eb044/src/manipulation.ts#L67)_

Append an element after another

#### Parameters:

| Name   | Type | Description              |
| ------ | ---- | ------------------------ |
| `elem` | Node | The element to append to |
| `next` | Node | The element be added     |

**Returns:** void

---

### appendChild

▸ **appendChild**(`elem`: Element, `child`: Node): void

_Defined in [manipulation.ts:48](https://github.com/fb55/domutils/blob/69eb044/src/manipulation.ts#L48)_

Append a child to an element

#### Parameters:

| Name    | Type    | Description                        |
| ------- | ------- | ---------------------------------- |
| `elem`  | Element | The element to append to           |
| `child` | Node    | The element to be added as a child |

**Returns:** void

---

### prepend

▸ **prepend**(`elem`: Node, `prev`: Node): void

_Defined in [manipulation.ts:95](https://github.com/fb55/domutils/blob/69eb044/src/manipulation.ts#L95)_

Prepend an element before another

#### Parameters:

| Name   | Type | Description              |
| ------ | ---- | ------------------------ |
| `elem` | Node | The element to append to |
| `prev` | Node | The element be added     |

**Returns:** void

---

### removeElement

▸ **removeElement**(`elem`: Node): void

_Defined in [manipulation.ts:8](https://github.com/fb55/domutils/blob/69eb044/src/manipulation.ts#L8)_

Remove an element from the dom

#### Parameters:

| Name   | Type | Description               |
| ------ | ---- | ------------------------- |
| `elem` | Node | The element to be removed |

**Returns:** void

---

### replaceElement

▸ **replaceElement**(`elem`: Node, `replacement`: Node): void

_Defined in [manipulation.ts:24](https://github.com/fb55/domutils/blob/69eb044/src/manipulation.ts#L24)_

Replace an element in the dom

#### Parameters:

| Name          | Type | Description                |
| ------------- | ---- | -------------------------- |
| `elem`        | Node | The element to be replaced |
| `replacement` | Node | The element to be added    |

**Returns:** void
