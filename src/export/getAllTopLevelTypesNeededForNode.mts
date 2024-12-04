import ts from "typescript"
import type {Instance} from "./Instance.d.mts"
import type {TopLevelType} from "./TopLevelType.d.mts"
import {getTypesUsed} from "./getTypesUsed.mts"
import {getTopLevelTypes} from "./getTopLevelTypes.mts"

export function getAllTopLevelTypesNeededForNode(
	inst: Instance,
	node: ts.Node,
	ignored_types: string[] = []
) : {name: string, definition: string}[] {
	const top_level_types = getTopLevelTypes(inst, true)

	function findType(name: string) : TopLevelType|null {
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
						definition: `/* couldn't find the type '${type_name}' at the top level */`
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
