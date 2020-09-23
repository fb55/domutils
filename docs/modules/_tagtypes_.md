**domutils**

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

_Defined in [tagtypes.ts:20](https://github.com/fb55/domutils/blob/69eb044/src/tagtypes.ts#L20)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `node` | Node |

**Returns:** node is NodeWithChildren

---

### isCDATA

▸ **isCDATA**(`node`: Node): node is NodeWithChildren

_Defined in [tagtypes.ts:8](https://github.com/fb55/domutils/blob/69eb044/src/tagtypes.ts#L8)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `node` | Node |

**Returns:** node is NodeWithChildren

---

### isComment

▸ **isComment**(`node`: Node): node is DataNode

_Defined in [tagtypes.ts:16](https://github.com/fb55/domutils/blob/69eb044/src/tagtypes.ts#L16)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `node` | Node |

**Returns:** node is DataNode

---

### isTag

▸ **isTag**(`node`: Node): node is Element

_Defined in [tagtypes.ts:4](https://github.com/fb55/domutils/blob/69eb044/src/tagtypes.ts#L4)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `node` | Node |

**Returns:** node is Element

---

### isText

▸ **isText**(`node`: Node): node is DataNode

_Defined in [tagtypes.ts:12](https://github.com/fb55/domutils/blob/69eb044/src/tagtypes.ts#L12)_

#### Parameters:

| Name   | Type |
| ------ | ---- |
| `node` | Node |

**Returns:** node is DataNode
