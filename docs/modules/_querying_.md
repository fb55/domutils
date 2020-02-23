[domutils](../README.md) › ["querying"](_querying_.md)

# External module: "querying"

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

▸ **existsOne**(`test`: function, `elems`: Node[]): *boolean*

*Defined in [querying.ts:72](https://github.com/fb55/domutils/blob/6bff23a/src/querying.ts#L72)*

**Parameters:**

▪ **test**: *function*

▸ (`elem`: Element): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

▪ **elems**: *Node[]*

**Returns:** *boolean*

___

###  filter

▸ **filter**(`test`: function, `element`: Node | Node[], `recurse`: boolean, `limit`: number): *Node[]*

*Defined in [querying.ts:4](https://github.com/fb55/domutils/blob/6bff23a/src/querying.ts#L4)*

**Parameters:**

▪ **test**: *function*

▸ (`elem`: Node): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

▪ **element**: *Node | Node[]*

▪`Default value`  **recurse**: *boolean*= true

▪`Default value`  **limit**: *number*= Infinity

**Returns:** *Node[]*

___

###  find

▸ **find**(`test`: function, `elems`: Node[], `recurse`: boolean, `limit`: number): *Node[]*

*Defined in [querying.ts:14](https://github.com/fb55/domutils/blob/6bff23a/src/querying.ts#L14)*

**Parameters:**

▪ **test**: *function*

▸ (`elem`: Node): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

▪ **elems**: *Node[]*

▪ **recurse**: *boolean*

▪ **limit**: *number*

**Returns:** *Node[]*

___

###  findAll

▸ **findAll**(`test`: function, `rootElems`: Node[]): *Element[]*

*Defined in [querying.ts:91](https://github.com/fb55/domutils/blob/6bff23a/src/querying.ts#L91)*

**Parameters:**

▪ **test**: *function*

▸ (`elem`: Element): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

▪ **rootElems**: *Node[]*

**Returns:** *Element[]*

___

###  findOne

▸ **findOne**(`test`: function, `elems`: Node[], `recurse`: boolean): *Element | null*

*Defined in [querying.ts:51](https://github.com/fb55/domutils/blob/6bff23a/src/querying.ts#L51)*

**Parameters:**

▪ **test**: *function*

▸ (`elem`: Element): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

▪ **elems**: *Node[]*

▪`Default value`  **recurse**: *boolean*= true

**Returns:** *Element | null*

___

###  findOneChild

▸ **findOneChild**(`test`: function, `elems`: Node[]): *Node | null*

*Defined in [querying.ts:40](https://github.com/fb55/domutils/blob/6bff23a/src/querying.ts#L40)*

**Parameters:**

▪ **test**: *function*

▸ (`elem`: Node): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

▪ **elems**: *Node[]*

**Returns:** *Node | null*
