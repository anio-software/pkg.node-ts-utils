import type {Instance, TopLevelType} from "../index.mjs"
import {getTopLevelTypeDeclarations} from "./getTopLevelTypeDeclarations.mjs"
import {getTypeImports} from "./getTypeImports.mjs"

export function getTopLevelTypes(
	inst: Instance,
	drop_export_keyword: boolean = true
) : TopLevelType[] {
	const imports : TopLevelType[] = []

	for (const imp of getTypeImports(inst)) {
		imports.push({
			name: imp.identifier,
			definition: imp.definition,
			node: imp.node,
			depends_on_type: []
		})
	}

	// sort imports
	imports.sort(sorter)

	const types = getTopLevelTypeDeclarations(inst, drop_export_keyword)

	// sort types
	types.sort(sorter)

	return [...imports, ...types]

	function sorter(a: TopLevelType, b: TopLevelType) {
		return a.name.localeCompare(b.name)
	}
}
