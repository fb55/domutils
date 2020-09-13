[domutils](../README.md) › ["legacy"](_legacy_.md)

# Module: "legacy"

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

*Defined in [legacy.ts:89](https://github.com/fb55/domutils/blob/ed0c566/src/legacy.ts#L89)*

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

*Defined in [legacy.ts:79](https://github.com/fb55/domutils/blob/ed0c566/src/legacy.ts#L79)*

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

*Defined in [legacy.ts:102](https://github.com/fb55/domutils/blob/ed0c566/src/legacy.ts#L102)*

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

*Defined in [legacy.ts:111](https://github.com/fb55/domutils/blob/ed0c566/src/legacy.ts#L111)*

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

*Defined in [legacy.ts:74](https://github.com/fb55/domutils/blob/ed0c566/src/legacy.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | TestElementOpts |
`element` | Node |

**Returns:** *boolean*
