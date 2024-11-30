import type {Instance, Export} from "../index.mjs"
import {getExports} from "./getExports.mjs"

export function getExportByName(
	inst: Instance,
	export_name: string,
	type_only?: boolean
) : Export|null {
	for (const exp of getExports(inst)) {
		if (exp.name === export_name) {
			if (!type_only) {
				return exp
			}

			if (exp.is_type_only) {
				return exp
			}
		}
	}

	return null
}
