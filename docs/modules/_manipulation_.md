[domutils](../README.md) › ["manipulation"](_manipulation_.md)

# External module: "manipulation"

## Index

### Functions

* [append](_manipulation_.md#append)
* [appendChild](_manipulation_.md#appendchild)
* [prepend](_manipulation_.md#prepend)
* [removeElement](_manipulation_.md#removeelement)
* [replaceElement](_manipulation_.md#replaceelement)

## Functions

###  append

▸ **append**(`elem`: Node, `next`: Node): *void*

*Defined in [manipulation.ts:65](https://github.com/fb55/domutils/blob/6b847f6/src/manipulation.ts#L65)*

Append an element after another

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`elem` | Node | The element to append to |
`next` | Node | The element be added  |

**Returns:** *void*

___

###  appendChild

▸ **appendChild**(`elem`: Element, `child`: Node): *void*

*Defined in [manipulation.ts:48](https://github.com/fb55/domutils/blob/6b847f6/src/manipulation.ts#L48)*

Append a child to an element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`elem` | Element | The element to append to |
`child` | Node | The element to be added as a child  |

**Returns:** *void*

___

###  prepend

▸ **prepend**(`elem`: Node, `prev`: Node): *void*

*Defined in [manipulation.ts:91](https://github.com/fb55/domutils/blob/6b847f6/src/manipulation.ts#L91)*

Prepend an element before another

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`elem` | Node | The element to append to |
`prev` | Node | The element be added  |

**Returns:** *void*

___

###  removeElement

▸ **removeElement**(`elem`: Node): *void*

*Defined in [manipulation.ts:8](https://github.com/fb55/domutils/blob/6b847f6/src/manipulation.ts#L8)*

Remove an element from the dom

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`elem` | Node | The element to be removed  |

**Returns:** *void*

___

###  replaceElement

▸ **replaceElement**(`elem`: Node, `replacement`: Node): *void*

*Defined in [manipulation.ts:24](https://github.com/fb55/domutils/blob/6b847f6/src/manipulation.ts#L24)*

Replace an element in the dom

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`elem` | Node | The element to be replaced |
`replacement` | Node | The element to be added  |

**Returns:** *void*
