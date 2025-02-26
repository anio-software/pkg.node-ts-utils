import {createContext} from "@fourtune/realm-js/v0/runtime"

// vvv--- types needed for implementation
import type {Export} from "#~src/export/Export.d.mts"
import type {Instance} from "#~src/export/Instance.d.mts"
type Ret = {
	exports: Export[];
	getTypeExportByName: (name: string) => Export | null;
	getValueExportByName: (name: string) => Export | null;
	getExportByName: (name: string) => Export | null;
	exportNames: string[];
}
import type {ExportDeclaration as TSExportDeclaration} from "typescript"
import type {Node as TSNode} from "typescript"
// ^^^--- types needed for implementation

import {getExportsRecursiveFactory as factory} from "#~synthetic/user/export/getExportsRecursiveFactory.mts"

const fn = factory(createContext())

export function getExportsRecursive(filePath: string|null, inst: Instance, _originModule?: string|undefined) : Ret {
	return fn(filePath, inst, _originModule)
}
