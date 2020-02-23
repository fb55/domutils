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

*Defined in [manipulation.ts:65](https://github.com/fb55/domutils/blob/6bff23a/src/manipulation.ts#L65)*

Append an element after another

**`argument`** elem The element to append to

**`argument`** next The element be added

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |
`next` | Node |

**Returns:** *void*

___

###  appendChild

▸ **appendChild**(`elem`: Element, `child`: Node): *void*

*Defined in [manipulation.ts:48](https://github.com/fb55/domutils/blob/6bff23a/src/manipulation.ts#L48)*

Append a child to an element

**`argument`** elem The element to append to

**`argument`** child The element to be added as a child

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`child` | Node |

**Returns:** *void*

___

###  prepend

▸ **prepend**(`elem`: Node, `prev`: Node): *void*

*Defined in [manipulation.ts:91](https://github.com/fb55/domutils/blob/6bff23a/src/manipulation.ts#L91)*

Prepend an element before another

**`argument`** elem The element to append to

**`argument`** prev The element be added

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |
`prev` | Node |

**Returns:** *void*

___

###  removeElement

▸ **removeElement**(`elem`: Node): *void*

*Defined in [manipulation.ts:8](https://github.com/fb55/domutils/blob/6bff23a/src/manipulation.ts#L8)*

Remove an element from the dom

**`argument`** elem The element to be removed

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |

**Returns:** *void*

___

###  replaceElement

▸ **replaceElement**(`elem`: Node, `replacement`: Node): *void*

*Defined in [manipulation.ts:24](https://github.com/fb55/domutils/blob/6bff23a/src/manipulation.ts#L24)*

Replace an element in the dom

**`argument`** elem The element to be replaced

**`argument`** replacement The element to be added

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Node |
`replacement` | Node |

**Returns:** *void*
