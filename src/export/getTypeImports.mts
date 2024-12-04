import type {Instance} from "./Instance.d.mts"
import type {Import} from "./Import.d.mts"
import {getImports} from "./getImports.mts"

export function getTypeImports(
	inst: Instance
) : Import[] {
	return getImports(inst).filter(entry => {
		return entry.is_type_only
	})
}
