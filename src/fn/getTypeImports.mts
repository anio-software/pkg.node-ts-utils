import type {Instance, Import} from "../index.mjs"
import {getImports} from "./getImports.mjs"

export function getTypeImports(
	inst: Instance
) : Import[] {
	return getImports(inst).filter(entry => {
		return entry.is_type_only
	})
}
