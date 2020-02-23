[domutils](../README.md) › ["legacy"](_legacy_.md)

# External module: "legacy"

## Index

### Functions

* [getElementById](_legacy_.md#getelementbyid)
* [getElements](_legacy_.md#getelements)
* [getElementsByTagName](_legacy_.md#getelementsbytagname)
* [getElementsByTagType](_legacy_.md#getelementsbytagtype)
* [testElement](_legacy_.md#testelement)

## Functions

###  getElementById

▸ **getElementById**(`id`: string | function, `element`: Node | Node[], `recurse`: boolean): *Element | null*

*Defined in [legacy.ts:90](https://github.com/fb55/domutils/blob/6bff23a/src/legacy.ts#L90)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string &#124; function | - |
`element` | Node &#124; Node[] | - |
`recurse` | boolean | true |

**Returns:** *Element | null*

___

###  getElements

▸ **getElements**(`options`: TestElementOpts, `element`: Node | Node[], `recurse`: boolean, `limit`: number): *Node[]*

*Defined in [legacy.ts:80](https://github.com/fb55/domutils/blob/6bff23a/src/legacy.ts#L80)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | TestElementOpts | - |
`element` | Node &#124; Node[] | - |
`recurse` | boolean | - |
`limit` | number | Infinity |

**Returns:** *Node[]*

___

###  getElementsByTagName

▸ **getElementsByTagName**(`name`: string | function, `element`: Node | Node[], `recurse`: boolean, `limit`: number): *Element[]*

*Defined in [legacy.ts:103](https://github.com/fb55/domutils/blob/6bff23a/src/legacy.ts#L103)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`name` | string &#124; function | - |
`element` | Node &#124; Node[] | - |
`recurse` | boolean | - |
`limit` | number | Infinity |

**Returns:** *Element[]*

___

###  getElementsByTagType

▸ **getElementsByTagType**(`type`: ElementType | function, `element`: Node | Node[], `recurse`: boolean, `limit`: number): *Node[]*

*Defined in [legacy.ts:112](https://github.com/fb55/domutils/blob/6bff23a/src/legacy.ts#L112)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`type` | ElementType &#124; function | - |
`element` | Node &#124; Node[] | - |
`recurse` | boolean | true |
`limit` | number | Infinity |

**Returns:** *Node[]*

___

###  testElement

▸ **testElement**(`options`: TestElementOpts, `element`: Node): *boolean*

*Defined in [legacy.ts:75](https://github.com/fb55/domutils/blob/6bff23a/src/legacy.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | TestElementOpts |
`element` | Node |

**Returns:** *boolean*
