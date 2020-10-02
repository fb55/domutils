**[domutils](../README.md)**

> [Globals](../README.md) / "querying"

# Module: "querying"

## Index

### Functions

-   [existsOne](_querying_.md#existsone)
-   [filter](_querying_.md#filter)
-   [find](_querying_.md#find)
-   [findAll](_querying_.md#findall)
-   [findOne](_querying_.md#findone)
-   [findOneChild](_querying_.md#findonechild)

## Functions

### existsOne

▸ **existsOne**(`test`: (elem: Element) => boolean, `nodes`: Node[]): boolean

_Defined in [querying.ts:105](https://github.com/fb55/domutils/blob/3813e44/src/querying.ts#L105)_

#### Parameters:

| Name    | Type                       | Description                |
| ------- | -------------------------- | -------------------------- |
| `test`  | (elem: Element) => boolean | Function to test nodes on. |
| `nodes` | Node[]                     | Array of nodes to search.  |

**Returns:** boolean

Whether a tree of nodes contains at least one node passing a test.

---

### filter

▸ **filter**(`test`: (elem: Node) => boolean, `node`: Node \| Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [querying.ts:13](https://github.com/fb55/domutils/blob/3813e44/src/querying.ts#L13)_

Search a node and its children for nodes passing a test function.

#### Parameters:

| Name      | Type                    | Default value | Description                                                       |
| --------- | ----------------------- | ------------- | ----------------------------------------------------------------- |
| `test`    | (elem: Node) => boolean | -             | Function to test nodes on.                                        |
| `node`    | Node \| Node[]          | -             | Node to search. Will be included in the result set if it matches. |
| `recurse` | boolean                 | true          | Also consider child nodes.                                        |
| `limit`   | number                  | Infinity      | Maximum number of nodes to return.                                |

**Returns:** Node[]

All nodes passing `test`.

---

### find

▸ **find**(`test`: (elem: Node) => boolean, `nodes`: Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [querying.ts:32](https://github.com/fb55/domutils/blob/3813e44/src/querying.ts#L32)_

Search an array of node and its children for nodes passing a test function.

#### Parameters:

| Name      | Type                    | Description                        |
| --------- | ----------------------- | ---------------------------------- |
| `test`    | (elem: Node) => boolean | Function to test nodes on.         |
| `nodes`   | Node[]                  | Array of nodes to search.          |
| `recurse` | boolean                 | Also consider child nodes.         |
| `limit`   | number                  | Maximum number of nodes to return. |

**Returns:** Node[]

All nodes passing `test`.

---

### findAll

▸ **findAll**(`test`: (elem: Element) => boolean, `nodes`: Node[]): Element[]

_Defined in [querying.ts:127](https://github.com/fb55/domutils/blob/3813e44/src/querying.ts#L127)_

Search and array of nodes and its children for nodes passing a test function.

Same as `find`, only with less options, leading to reduced complexity.

#### Parameters:

| Name    | Type                       | Description                |
| ------- | -------------------------- | -------------------------- |
| `test`  | (elem: Element) => boolean | Function to test nodes on. |
| `nodes` | Node[]                     | Array of nodes to search.  |

**Returns:** Element[]

All nodes passing `test`.

---

### findOne

▸ **findOne**(`test`: (elem: Element) => boolean, `nodes`: Node[], `recurse`: boolean): Element \| null

_Defined in [querying.ts:79](https://github.com/fb55/domutils/blob/3813e44/src/querying.ts#L79)_

Finds one element in a tree that passes a test.

#### Parameters:

| Name      | Type                       | Default value | Description                |
| --------- | -------------------------- | ------------- | -------------------------- |
| `test`    | (elem: Element) => boolean | -             | Function to test nodes on. |
| `nodes`   | Node[]                     | -             | Array of nodes to search.  |
| `recurse` | boolean                    | true          | Also consider child nodes. |

**Returns:** Element \| null

The first child node that passes `test`.

---

### findOneChild

▸ **findOneChild**(`test`: (elem: Node) => boolean, `nodes`: Node[]): Node \| undefined

_Defined in [querying.ts:64](https://github.com/fb55/domutils/blob/3813e44/src/querying.ts#L64)_

Finds the first element inside of an array that matches a test function.

#### Parameters:

| Name    | Type                    | Description                |
| ------- | ----------------------- | -------------------------- |
| `test`  | (elem: Node) => boolean | Function to test nodes on. |
| `nodes` | Node[]                  | Array of nodes to search.  |

**Returns:** Node \| undefined

The first node in the array that passes `test`.
