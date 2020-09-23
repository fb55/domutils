**domutils**

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

_Defined in [querying.ts:102](https://github.com/fb55/domutils/blob/69eb044/src/querying.ts#L102)_

Returns whether a tree of nodes contains at least one node passing a test.

#### Parameters:

| Name    | Type                       | Description                |
| ------- | -------------------------- | -------------------------- |
| `test`  | (elem: Element) => boolean | Function to test nodes on. |
| `nodes` | Node[]                     | Array of nodes to search.  |

**Returns:** boolean

---

### filter

▸ **filter**(`test`: (elem: Node) => boolean, `node`: Node \| Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [querying.ts:12](https://github.com/fb55/domutils/blob/69eb044/src/querying.ts#L12)_

Search a node and its children for nodes passing a test function.

#### Parameters:

| Name      | Type                    | Default value | Description                        |
| --------- | ----------------------- | ------------- | ---------------------------------- |
| `test`    | (elem: Node) => boolean | -             | Function to test nodes on.         |
| `node`    | Node \| Node[]          | -             | -                                  |
| `recurse` | boolean                 | true          | Also consider child nodes.         |
| `limit`   | number                  | Infinity      | Maximum number of nodes to return. |

**Returns:** Node[]

---

### find

▸ **find**(`test`: (elem: Node) => boolean, `nodes`: Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [querying.ts:30](https://github.com/fb55/domutils/blob/69eb044/src/querying.ts#L30)_

Like `filter`, but only works on an array of nodes.

#### Parameters:

| Name      | Type                    | Description                        |
| --------- | ----------------------- | ---------------------------------- |
| `test`    | (elem: Node) => boolean | Function to test nodes on.         |
| `nodes`   | Node[]                  | Array of nodes to search.          |
| `recurse` | boolean                 | Also consider child nodes.         |
| `limit`   | number                  | Maximum number of nodes to return. |

**Returns:** Node[]

---

### findAll

▸ **findAll**(`test`: (elem: Element) => boolean, `nodes`: Node[]): Element[]

_Defined in [querying.ts:123](https://github.com/fb55/domutils/blob/69eb044/src/querying.ts#L123)_

Search and array of nodes and its children for nodes passing a test function.

Same as `find`, only with less options, leading to reduced complexity.

#### Parameters:

| Name    | Type                       | Description                |
| ------- | -------------------------- | -------------------------- |
| `test`  | (elem: Element) => boolean | Function to test nodes on. |
| `nodes` | Node[]                     | Array of nodes to search.  |

**Returns:** Element[]

---

### findOne

▸ **findOne**(`test`: (elem: Element) => boolean, `nodes`: Node[], `recurse`: boolean): Element \| null

_Defined in [querying.ts:75](https://github.com/fb55/domutils/blob/69eb044/src/querying.ts#L75)_

Finds one element in a tree that passes a test.

#### Parameters:

| Name      | Type                       | Default value | Description                |
| --------- | -------------------------- | ------------- | -------------------------- |
| `test`    | (elem: Element) => boolean | -             | Function to test nodes on. |
| `nodes`   | Node[]                     | -             | Array of nodes to search.  |
| `recurse` | boolean                    | true          | Also consider child nodes. |

**Returns:** Element \| null

---

### findOneChild

▸ **findOneChild**(`test`: (elem: Node) => boolean, `nodes`: Node[]): Node \| undefined

_Defined in [querying.ts:61](https://github.com/fb55/domutils/blob/69eb044/src/querying.ts#L61)_

Finds the first element inside of an array that matches a test function.

#### Parameters:

| Name    | Type                    | Description                |
| ------- | ----------------------- | -------------------------- |
| `test`  | (elem: Node) => boolean | Function to test nodes on. |
| `nodes` | Node[]                  | Array of nodes to search.  |

**Returns:** Node \| undefined
