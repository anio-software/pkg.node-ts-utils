import type {RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"

import type {Instance} from "#~src/export/Instance.d.mts"
import type {Export} from "#~src/export/Export.d.mts"

import {implementation as __getExportsRecursive} from "./__getExportsRecursive.mts"

export function implementation(
	wrappedContext: RuntimeWrappedContextInstance,
	inst: Instance
) : Export[] {
	return __getExportsRecursive(
		wrappedContext, null, inst
	)
}
