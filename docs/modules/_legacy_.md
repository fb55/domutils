**[domutils](../README.md)**

> [Globals](../README.md) / "legacy"

# Module: "legacy"

## Index

### Functions

-   [getElementById](_legacy_.md#getelementbyid)
-   [getElements](_legacy_.md#getelements)
-   [getElementsByTagName](_legacy_.md#getelementsbytagname)
-   [getElementsByTagType](_legacy_.md#getelementsbytagtype)
-   [testElement](_legacy_.md#testelement)

## Functions

### getElementById

▸ **getElementById**(`id`: string \| (id: string) => boolean, `nodes`: Node \| Node[], `recurse`: boolean): Element \| null

_Defined in [legacy.ts:119](https://github.com/fb55/domutils/blob/3813e44/src/legacy.ts#L119)_

#### Parameters:

| Name      | Type                              | Default value | Description                                |
| --------- | --------------------------------- | ------------- | ------------------------------------------ |
| `id`      | string \| (id: string) => boolean | -             | The unique ID attribute value to look for. |
| `nodes`   | Node \| Node[]                    | -             | Nodes to search through.                   |
| `recurse` | boolean                           | true          | Also consider child nodes.                 |

**Returns:** Element \| null

The node with the supplied ID.

---

### getElements

▸ **getElements**(`options`: TestElementOpts, `nodes`: Node \| Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [legacy.ts:103](https://github.com/fb55/domutils/blob/3813e44/src/legacy.ts#L103)_

#### Parameters:

| Name      | Type            | Default value | Description                             |
| --------- | --------------- | ------------- | --------------------------------------- |
| `options` | TestElementOpts | -             | An object describing nodes to look for. |
| `nodes`   | Node \| Node[]  | -             | Nodes to search through.                |
| `recurse` | boolean         | -             | Also consider child nodes.              |
| `limit`   | number          | Infinity      | Maximum number of nodes to return.      |

**Returns:** Node[]

All nodes that match `options`.

---

### getElementsByTagName

▸ **getElementsByTagName**(`tagName`: string \| (name: string) => boolean, `nodes`: Node \| Node[], `recurse`: boolean, `limit`: number): Element[]

_Defined in [legacy.ts:135](https://github.com/fb55/domutils/blob/3813e44/src/legacy.ts#L135)_

#### Parameters:

| Name      | Type                                | Default value | Description                        |
| --------- | ----------------------------------- | ------------- | ---------------------------------- |
| `tagName` | string \| (name: string) => boolean | -             | Tag name to search for.            |
| `nodes`   | Node \| Node[]                      | -             | Nodes to search through.           |
| `recurse` | boolean                             | true          | Also consider child nodes.         |
| `limit`   | number                              | Infinity      | Maximum number of nodes to return. |

**Returns:** Element[]

All nodes with the supplied `tagName`.

---

### getElementsByTagType

▸ **getElementsByTagType**(`type`: ElementType \| (type: ElementType) => boolean, `nodes`: Node \| Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [legacy.ts:151](https://github.com/fb55/domutils/blob/3813e44/src/legacy.ts#L151)_

#### Parameters:

| Name      | Type                                          | Default value | Description                        |
| --------- | --------------------------------------------- | ------------- | ---------------------------------- |
| `type`    | ElementType \| (type: ElementType) => boolean | -             | Element type to look for.          |
| `nodes`   | Node \| Node[]                                | -             | Nodes to search through.           |
| `recurse` | boolean                                       | true          | Also consider child nodes.         |
| `limit`   | number                                        | Infinity      | Maximum number of nodes to return. |

**Returns:** Node[]

All nodes with the supplied `type`.

---

### testElement

▸ **testElement**(`options`: TestElementOpts, `node`: Node): boolean

_Defined in [legacy.ts:91](https://github.com/fb55/domutils/blob/3813e44/src/legacy.ts#L91)_

#### Parameters:

| Name      | Type            | Description                             |
| --------- | --------------- | --------------------------------------- |
| `options` | TestElementOpts | An object describing nodes to look for. |
| `node`    | Node            | The element to test.                    |

**Returns:** boolean

Whether the element matches the description in `options`.
