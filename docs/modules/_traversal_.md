[domutils](../README.md) › ["traversal"](_traversal_.md)

# External module: "traversal"

## Index

### Functions

* [getAttributeValue](_traversal_.md#getattributevalue)
* [getChildren](_traversal_.md#getchildren)
* [getName](_traversal_.md#getname)
* [getParent](_traversal_.md#getparent)
* [getSiblings](_traversal_.md#getsiblings)
* [hasAttrib](_traversal_.md#hasattrib)

## Functions

###  getAttributeValue

▸ **getAttributeValue**(`elem`: Element, `name`: string): *string*

*Defined in [traversal.ts:17](https://github.com/fb55/domutils/blob/6bff23a/src/traversal.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`name` | string |

**Returns:** *string*

___

###  getChildren

▸ **getChildren**(`elem`: Node): *Node[] | null*

*Defined in [traversal.ts:3](https://github.com/fb55/domutils/blob/6bff23a/src/traversal.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

**Returns:** *Node[] | null*

___

###  getName

▸ **getName**(`elem`: Element): *string*

*Defined in [traversal.ts:30](https://github.com/fb55/domutils/blob/6bff23a/src/traversal.ts#L30)*

Returns the name property of an element

**`argument`** elem The element to get the name for

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

**Returns:** *string*

___

###  getParent

▸ **getParent**(`elem`: Node): *Node | null*

*Defined in [traversal.ts:8](https://github.com/fb55/domutils/blob/6bff23a/src/traversal.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

**Returns:** *Node | null*

___

###  getSiblings

▸ **getSiblings**(`elem`: Node): *Node[] | null*

*Defined in [traversal.ts:12](https://github.com/fb55/domutils/blob/6bff23a/src/traversal.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

**Returns:** *Node[] | null*

___

###  hasAttrib

▸ **hasAttrib**(`elem`: Element, `name`: string): *boolean*

*Defined in [traversal.ts:21](https://github.com/fb55/domutils/blob/6bff23a/src/traversal.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`name` | string |

**Returns:** *boolean*
