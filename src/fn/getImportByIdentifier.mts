import type {Instance, Import} from "../index.mjs"
import {getImports} from "./getImports.mjs"

export function getImportByIdentifier(
	inst: Instance,
	identifier: string
) : Import|null {
	for (const imp of getImports(inst)) {
		if (imp.identifier === identifier) {
			return imp
		}
	}

	return null
}
