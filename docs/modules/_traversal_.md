[domutils](../README.md) › ["traversal"](_traversal_.md)

# Module: "traversal"

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

*Defined in [traversal.ts:16](https://github.com/fb55/domutils/blob/75e160c/src/traversal.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`name` | string |

**Returns:** *string*

___

###  getChildren

▸ **getChildren**(`elem`: Node | Element): *Node[] | null*

*Defined in [traversal.ts:3](https://github.com/fb55/domutils/blob/75e160c/src/traversal.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node &#124; Element |

**Returns:** *Node[] | null*

___

###  getName

▸ **getName**(`elem`: Element): *string*

*Defined in [traversal.ts:29](https://github.com/fb55/domutils/blob/75e160c/src/traversal.ts#L29)*

Returns the name property of an element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`elem` | Element | The element to get the name for  |

**Returns:** *string*

___

###  getParent

▸ **getParent**(`elem`: Node): *Node | null*

*Defined in [traversal.ts:7](https://github.com/fb55/domutils/blob/75e160c/src/traversal.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

**Returns:** *Node | null*

___

###  getSiblings

▸ **getSiblings**(`elem`: Node): *Node[] | null*

*Defined in [traversal.ts:11](https://github.com/fb55/domutils/blob/75e160c/src/traversal.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

**Returns:** *Node[] | null*

___

###  hasAttrib

▸ **hasAttrib**(`elem`: Element, `name`: string): *boolean*

*Defined in [traversal.ts:20](https://github.com/fb55/domutils/blob/75e160c/src/traversal.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`name` | string |

**Returns:** *boolean*
