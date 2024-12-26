import {createContext} from "@fourtune/realm-js/v0/runtime"

// vvv--- types needed for implementation
import type {Export} from "#~src/export/Export.d.mts"
import type {Instance} from "#~src/export/Instance.d.mts"
/* couldn't find a user defined type named 'ts.ExportDeclaration' at the top level */
/* couldn't find a user defined type named 'ts.Node' at the top level */
// ^^^--- types needed for implementation

import {getExportsRecursiveFactory as factory} from "#~synthetic/user/export/getExportsRecursiveFactory.mts"

const fn = factory(createContext())

export function getExportsRecursive(filePath: string|null, inst: Instance) : Export[] {
	return fn(filePath, inst)
}
