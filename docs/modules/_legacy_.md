**domutils**

> [Globals](../README.md) / "legacy"

# Module: "legacy"

## Index

### Functions

-   [getElementById](_legacy_.md#getelementbyid)
-   [getElements](_legacy_.md#getelements)
-   [getElementsByTagName](_legacy_.md#getelementsbytagname)
-   [getElementsByTagType](_legacy_.md#getelementsbytagtype)
-   [testElement](_legacy_.md#testelement)

## Functions

### getElementById

▸ **getElementById**(`id`: string \| (id: string) => boolean, `element`: Node \| Node[], `recurse`: boolean): Element \| null

_Defined in [legacy.ts:89](https://github.com/fb55/domutils/blob/69eb044/src/legacy.ts#L89)_

#### Parameters:

| Name      | Type                              | Default value |
| --------- | --------------------------------- | ------------- |
| `id`      | string \| (id: string) => boolean | -             |
| `element` | Node \| Node[]                    | -             |
| `recurse` | boolean                           | true          |

**Returns:** Element \| null

---

### getElements

▸ **getElements**(`options`: TestElementOpts, `element`: Node \| Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [legacy.ts:79](https://github.com/fb55/domutils/blob/69eb044/src/legacy.ts#L79)_

#### Parameters:

| Name      | Type            | Default value |
| --------- | --------------- | ------------- |
| `options` | TestElementOpts | -             |
| `element` | Node \| Node[]  | -             |
| `recurse` | boolean         | -             |
| `limit`   | number          | Infinity      |

**Returns:** Node[]

---

### getElementsByTagName

▸ **getElementsByTagName**(`name`: string \| (name: string) => boolean, `element`: Node \| Node[], `recurse`: boolean, `limit`: number): Element[]

_Defined in [legacy.ts:102](https://github.com/fb55/domutils/blob/69eb044/src/legacy.ts#L102)_

#### Parameters:

| Name      | Type                                | Default value |
| --------- | ----------------------------------- | ------------- |
| `name`    | string \| (name: string) => boolean | -             |
| `element` | Node \| Node[]                      | -             |
| `recurse` | boolean                             | -             |
| `limit`   | number                              | Infinity      |

**Returns:** Element[]

---

### getElementsByTagType

▸ **getElementsByTagType**(`type`: ElementType \| (type: ElementType) => boolean, `element`: Node \| Node[], `recurse`: boolean, `limit`: number): Node[]

_Defined in [legacy.ts:111](https://github.com/fb55/domutils/blob/69eb044/src/legacy.ts#L111)_

#### Parameters:

| Name      | Type                                          | Default value |
| --------- | --------------------------------------------- | ------------- |
| `type`    | ElementType \| (type: ElementType) => boolean | -             |
| `element` | Node \| Node[]                                | -             |
| `recurse` | boolean                                       | true          |
| `limit`   | number                                        | Infinity      |

**Returns:** Node[]

---

### testElement

▸ **testElement**(`options`: TestElementOpts, `element`: Node): boolean

_Defined in [legacy.ts:74](https://github.com/fb55/domutils/blob/69eb044/src/legacy.ts#L74)_

#### Parameters:

| Name      | Type            |
| --------- | --------------- |
| `options` | TestElementOpts |
| `element` | Node            |

**Returns:** boolean
