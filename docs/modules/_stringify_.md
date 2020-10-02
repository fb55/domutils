**[domutils](../README.md)**

> [Globals](../README.md) / "stringify"

# Module: "stringify"

## Index

### Functions

-   [getInnerHTML](_stringify_.md#getinnerhtml)
-   [getOuterHTML](_stringify_.md#getouterhtml)
-   [getText](_stringify_.md#gettext)

## Functions

### getInnerHTML

▸ **getInnerHTML**(`node`: Node, `options?`: DomSerializerOptions): string

_Defined in [stringify.ts:24](https://github.com/fb55/domutils/blob/3813e44/src/stringify.ts#L24)_

**`deprecated`** Use the `dom-serializer` module directly.

#### Parameters:

| Name       | Type                 | Description                    |
| ---------- | -------------------- | ------------------------------ |
| `node`     | Node                 | Node to get the inner HTML of. |
| `options?` | DomSerializerOptions | Options for serialization.     |

**Returns:** string

`node`'s inner HTML.

---

### getOuterHTML

▸ **getOuterHTML**(`node`: Node \| Node[], `options?`: DomSerializerOptions): string

_Defined in [stringify.ts:11](https://github.com/fb55/domutils/blob/3813e44/src/stringify.ts#L11)_

**`deprecated`** Use the `dom-serializer` module directly.

#### Parameters:

| Name       | Type                 | Description                    |
| ---------- | -------------------- | ------------------------------ |
| `node`     | Node \| Node[]       | Node to get the outer HTML of. |
| `options?` | DomSerializerOptions | Options for serialization.     |

**Returns:** string

`node`'s outer HTML.

---

### getText

▸ **getText**(`node`: Node \| Node[]): string

_Defined in [stringify.ts:39](https://github.com/fb55/domutils/blob/3813e44/src/stringify.ts#L39)_

Get a node's inner text.

#### Parameters:

| Name   | Type           | Description                    |
| ------ | -------------- | ------------------------------ |
| `node` | Node \| Node[] | Node to get the inner text of. |

**Returns:** string

`node`'s inner text.
