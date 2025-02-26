import {implementation} from "#~src/__getExportsRecursive.mts"
import type {RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"
import {getProject} from "@fourtune/realm-js/v0/project"

// vvv--- types needed for implementation
import type {Export} from "#~src/export/Export.d.mts"
import type {Instance} from "#~src/export/Instance.d.mts"
type Ret = {
	exports: Export[];
	getTypeExportByName: (name: string) => Export | null;
	getValueExportByName: (name: string) => Export | null;
	getExportByName: (name: string) => Export | null;
	exportNames: string[];
}
import type {ExportDeclaration as TSExportDeclaration} from "typescript"
import type {Node as TSNode} from "typescript"
// ^^^--- types needed for implementation

declare function getExportsRecursive(
	filePath: string|null,
	inst: Instance,
	_originModule?: string|undefined
) : Ret

/**
 * @brief
 * Create an instance of the function 'getExportsRecursive'.
 *
 * @param user
 * Options object (see @fourtune/realm-js/v0/runtime) or an already
 * created context with createContext().
 * This parameter is optional.
 *
 * @return
 * An instance of the function 'getExportsRecursive'.
 */
export function getExportsRecursiveFactory(context: RuntimeWrappedContextInstance) : typeof getExportsRecursive {
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

	return function getExportsRecursive(filePath: string|null, inst: Instance, _originModule?: string|undefined) : Ret {
		return implementation(local_context, filePath, inst, _originModule)
	}
}
