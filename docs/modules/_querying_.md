[domutils](../README.md) › ["querying"](_querying_.md)

# Module: "querying"

## Index

### Functions

* [existsOne](_querying_.md#existsone)
* [filter](_querying_.md#filter)
* [find](_querying_.md#find)
* [findAll](_querying_.md#findall)
* [findOne](_querying_.md#findone)
* [findOneChild](_querying_.md#findonechild)

## Functions

###  existsOne

▸ **existsOne**(`test`: function, `nodes`: Node[]): *boolean*

*Defined in [querying.ts:102](https://github.com/fb55/domutils/blob/75e160c/src/querying.ts#L102)*

Returns whether a tree of nodes contains at least one node passing a test.

**Parameters:**

▪ **test**: *function*

Function to test nodes on.

▸ (`elem`: Element): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

▪ **nodes**: *Node[]*

Array of nodes to search.

**Returns:** *boolean*

___

###  filter

▸ **filter**(`test`: function, `node`: Node | Node[], `recurse`: boolean, `limit`: number): *Node[]*

*Defined in [querying.ts:12](https://github.com/fb55/domutils/blob/75e160c/src/querying.ts#L12)*

Search a node and its children for nodes passing a test function.

**Parameters:**

▪ **test**: *function*

Function to test nodes on.

▸ (`elem`: Node): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

▪ **node**: *Node | Node[]*

▪`Default value`  **recurse**: *boolean*= true

Also consider child nodes.

▪`Default value`  **limit**: *number*= Infinity

Maximum number of nodes to return.

**Returns:** *Node[]*

___

###  find

▸ **find**(`test`: function, `nodes`: Node[], `recurse`: boolean, `limit`: number): *Node[]*

*Defined in [querying.ts:30](https://github.com/fb55/domutils/blob/75e160c/src/querying.ts#L30)*

Like `filter`, but only works on an array of nodes.

**Parameters:**

▪ **test**: *function*

Function to test nodes on.

▸ (`elem`: Node): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

▪ **nodes**: *Node[]*

Array of nodes to search.

▪ **recurse**: *boolean*

Also consider child nodes.

▪ **limit**: *number*

Maximum number of nodes to return.

**Returns:** *Node[]*

___

###  findAll

▸ **findAll**(`test`: function, `nodes`: Node[]): *Element[]*

*Defined in [querying.ts:123](https://github.com/fb55/domutils/blob/75e160c/src/querying.ts#L123)*

Search and array of nodes and its children for nodes passing a test function.

Same as `find`, only with less options, leading to reduced complexity.

**Parameters:**

▪ **test**: *function*

Function to test nodes on.

▸ (`elem`: Element): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

▪ **nodes**: *Node[]*

Array of nodes to search.

**Returns:** *Element[]*

___

###  findOne

▸ **findOne**(`test`: function, `nodes`: Node[], `recurse`: boolean): *Element | null*

*Defined in [querying.ts:75](https://github.com/fb55/domutils/blob/75e160c/src/querying.ts#L75)*

Finds one element in a tree that passes a test.

**Parameters:**

▪ **test**: *function*

Function to test nodes on.

▸ (`elem`: Element): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

▪ **nodes**: *Node[]*

Array of nodes to search.

▪`Default value`  **recurse**: *boolean*= true

Also consider child nodes.

**Returns:** *Element | null*

___

###  findOneChild

▸ **findOneChild**(`test`: function, `nodes`: Node[]): *Node | undefined*

*Defined in [querying.ts:61](https://github.com/fb55/domutils/blob/75e160c/src/querying.ts#L61)*

Finds the first element inside of an array that matches a test function.

**Parameters:**

▪ **test**: *function*

Function to test nodes on.

▸ (`elem`: Node): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

▪ **nodes**: *Node[]*

Array of nodes to search.

**Returns:** *Node | undefined*
