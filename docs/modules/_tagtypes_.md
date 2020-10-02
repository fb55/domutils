**[domutils](../README.md)**

> [Globals](../README.md) / "tagtypes"

# Module: "tagtypes"

## Index

### Functions

-   [hasChildren](_tagtypes_.md#haschildren)
-   [isCDATA](_tagtypes_.md#iscdata)
-   [isComment](_tagtypes_.md#iscomment)
-   [isTag](_tagtypes_.md#istag)
-   [isText](_tagtypes_.md#istext)

## Functions

### hasChildren

▸ **hasChildren**(`node`: Node): node is NodeWithChildren

_Defined in [tagtypes.ts:40](https://github.com/fb55/domutils/blob/3813e44/src/tagtypes.ts#L40)_

#### Parameters:

| Name   | Type | Description    |
| ------ | ---- | -------------- |
| `node` | Node | Node to check. |

**Returns:** node is NodeWithChildren

`true` if the node is a `NodeWithChildren` (has children), `false` otherwise.

---

### isCDATA

▸ **isCDATA**(`node`: Node): node is NodeWithChildren

_Defined in [tagtypes.ts:16](https://github.com/fb55/domutils/blob/3813e44/src/tagtypes.ts#L16)_

#### Parameters:

| Name   | Type | Description    |
| ------ | ---- | -------------- |
| `node` | Node | Node to check. |

**Returns:** node is NodeWithChildren

`true` if the node is a `NodeWithChildren`, `false` otherwise.

---

### isComment

▸ **isComment**(`node`: Node): node is DataNode

_Defined in [tagtypes.ts:32](https://github.com/fb55/domutils/blob/3813e44/src/tagtypes.ts#L32)_

#### Parameters:

| Name   | Type | Description    |
| ------ | ---- | -------------- |
| `node` | Node | Node to check. |

**Returns:** node is DataNode

`true` if the node is a `DataNode`, `false` otherwise.

---

### isTag

▸ **isTag**(`node`: Node): node is Element

_Defined in [tagtypes.ts:8](https://github.com/fb55/domutils/blob/3813e44/src/tagtypes.ts#L8)_

#### Parameters:

| Name   | Type | Description    |
| ------ | ---- | -------------- |
| `node` | Node | Node to check. |

**Returns:** node is Element

`true` if the node is a `Element`, `false` otherwise.

---

### isText

▸ **isText**(`node`: Node): node is DataNode

_Defined in [tagtypes.ts:24](https://github.com/fb55/domutils/blob/3813e44/src/tagtypes.ts#L24)_

#### Parameters:

| Name   | Type | Description    |
| ------ | ---- | -------------- |
| `node` | Node | Node to check. |

**Returns:** node is DataNode

`true` if the node is a `DataNode`, `false` otherwise.
