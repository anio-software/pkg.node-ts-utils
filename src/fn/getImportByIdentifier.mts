import type {Instance, Import} from "../index.mjs"
import {getImports} from "./getImports.mjs"

export function getImportByIdentifier(
	inst: Instance,
	identifier: string,
	type_only?: boolean
) : Import|null {
	for (const imp of getImports(inst)) {
		if (imp.identifier === identifier) {
			if (!type_only) {
				return imp
			}

			if (imp.is_type_only) {
				return imp
			}
		}
	}

	return null
}
