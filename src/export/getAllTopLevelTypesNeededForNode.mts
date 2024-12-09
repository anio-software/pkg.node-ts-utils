import ts from "typescript"
import type {Instance} from "./Instance.d.mts"
import type {TopLevelType} from "./TopLevelType.d.mts"
import {getTypesUsed} from "./getTypesUsed.mts"
import {getTopLevelTypes} from "./getTopLevelTypes.mts"
import {getImports} from "./getImports.mts"
import type {Import} from "./Import.d.mts"

export function getAllTopLevelTypesNeededForNode(
	inst: Instance,
	node: ts.Node,
	ignored_types: string[] = []
) : {name: string, definition: string}[] {
	const top_level_types = getTopLevelTypes(inst, true)
	const top_level_imports = getImports(inst)

	function findType(name: string) : TopLevelType|null {
		//
		// not a type but referring to a top level identifier
		//
		if (name.startsWith(`typeof:`)) {
			let matched_import : undefined|Import = undefined

			const identifier_to_search = name.slice(`typeof:`.length)

			for (const top_level_import of top_level_imports) {
				if (top_level_import.identifier === identifier_to_search) {
					matched_import = top_level_import

					break
				}
			}

			if (matched_import) {
				return {
					definition: matched_import.definition,
					depends_on_type: [],
					name: identifier_to_search,
					node: null
				}
			}

			return null
		}

		for (const _ of top_level_types) {
			if (_.name === name) return _
		}

		return null
	}

	function resolve(
		types: string[]
	) : {name: string, definition: string}[] {
		let ret : {name: string, definition: string}[] = []

		for (const type_name of types) {
			if (ignored_types.includes(type_name)) continue

			const type = findType(type_name)

			if (!type) {
				if (!(ret.map(x => x.name).includes(type_name))) {
					ret.push({
						name: type_name,
						definition: `/* couldn't find a user defined type named '${type_name}' at the top level */`
					})
				}

				continue
			}

			//
			// remove references to the type itself
			// to prevent infinite recursion
			// (i.e. handle the case when the type depends on itself)
			//
			const depends_on_type = type.depends_on_type.filter(type => {
				return type !== type_name
			})

			if (depends_on_type.length) {
				ret = [
					...resolve(depends_on_type),
					...ret
				]
			}

			// make sure we don't have duplicates
			if (!(ret.map(x => x.name).includes(type_name))) {
				ret.push({
					name: type_name,
					definition: type.definition
				})
			}
		}

		return ret
	}

	return resolve(getTypesUsed(inst, node))
}
