import type {Instance} from "../index.mjs"
import {getExports} from "./getExports.mjs"

export function getExportNames(
	inst: Instance,
	options : {
		ignore_types: boolean
	} = {
		ignore_types: false
	}
) : string[] {
	let list = getExports(inst)

	if (options.ignore_types) {
		list = list.filter(x => {
			return !x.is_type_only
		})
	}

	return list.map(x => x.name)
}
