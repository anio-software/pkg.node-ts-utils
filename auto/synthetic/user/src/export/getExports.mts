import {createContext} from "@fourtune/realm-js/v0/runtime"

// vvv--- types needed for implementation
import type {Instance} from "#~src/export/Instance.d.mts"
import type {Ret} from "#~src/__getExportsRecursive.mts"
// ^^^--- types needed for implementation

import {getExportsFactory as factory} from "#~synthetic/user/export/getExportsFactory.mts"

const fn = factory(createContext())

export function getExports(inst: Instance) : Ret {
	return fn(inst)
}
