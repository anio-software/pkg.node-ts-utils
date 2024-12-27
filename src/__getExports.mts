import type {RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"

import type {Instance} from "#~src/export/Instance.d.mts"

import {implementation as __getExportsRecursive, type Ret} from "#~src/__getExportsRecursive.mts"

export function implementation(
	wrappedContext: RuntimeWrappedContextInstance,
	inst: Instance
) : Ret {
	return __getExportsRecursive(
		wrappedContext, null, inst
	)
}
