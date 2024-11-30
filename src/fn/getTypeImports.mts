import type {Instance, ImportsList} from "../index.mjs"
import {getImports} from "./getImports.mjs"

export function getTypeImports(
	inst: Instance
) : ImportsList {
	return getImports(inst).filter(entry => {
		return entry.is_type_only
	})
}
