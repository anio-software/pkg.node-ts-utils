import type {Instance} from "./Instance.d.mts"
import type {Export} from "./Export.d.mts"
import {getExportsRecursive} from "./getExportsRecursive.mts"

export function getExports(
	inst: Instance
) : Export[] {
	return getExportsRecursive(null, inst)
}
