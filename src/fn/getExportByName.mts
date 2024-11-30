import type {Instance, Export} from "../index.mjs"
import {getExports} from "./getExports.mjs"

export function getExportByName(
	inst: Instance,
	export_name: string
) : Export|null {
	for (const exp of getExports(inst)) {
		if (exp.name === export_name) {
			return exp
		}
	}

	return null
}
