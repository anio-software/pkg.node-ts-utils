import {implementation} from "#~src/__getExports.mts"
import type {RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"
import {getProject} from "@fourtune/realm-js/v0/project"

// vvv--- types needed for implementation
import type {Export} from "#~src/export/Export.d.mts"
import type {Instance} from "#~src/export/Instance.d.mts"
// ^^^--- types needed for implementation

declare function getExports(
	inst: Instance
) : Export[]

/**
 * @brief
 * Create an instance of the function 'getExports'.
 *
 * @param user
 * Options object (see @fourtune/realm-js/v0/runtime) or an already
 * created context with createContext().
 * This parameter is optional.
 *
 * @return
 * An instance of the function 'getExports'.
 */
export function getExportsFactory(context: RuntimeWrappedContextInstance) : typeof getExports {
	const project = getProject()
	const local_context : RuntimeWrappedContextInstance = {
		...context,
		_package: {
			name: project.package_json.name,
			version: project.package_json.version,
			author: project.package_json.author,
			license: project.package_json.license
		}
	}

	return function getExports(inst: Instance) : Export[] {
		return implementation(local_context, inst)
	}
}
