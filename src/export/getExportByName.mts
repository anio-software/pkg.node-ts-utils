import type {Instance} from "./Instance.d.mts"
import type {Export} from "./Export.d.mts"
import {getExports} from "./getExports.mts"

export function getExportByName(
	inst: Instance,
	export_name: string,
	kind: "type-only" | "value-only" | "dont-care" = "dont-care"
) : Export|null {
	for (const exp of getExports(inst)) {
		if (exp.name !== export_name) continue

		if (kind === "dont-care") {
			return exp
		} else if (kind === "type-only" && exp.is_type_only) {
			return exp
		} else if (kind === "value-only" && !exp.is_type_only) {
			return exp
		}
	}

	return null
}
