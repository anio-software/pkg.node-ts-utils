import {
	type Node as TSNode,
	isImportDeclaration as tsIsImportDeclaration,
	type ImportDeclaration as TSImportDeclaration,
	type ImportClause as TSImportClause,
	isNamedImports as tsIsNamedImports,
	isNamespaceImport as tsIsNamespaceImport
}from "typescript"

import type {Instance} from "./Instance.d.mts"
import type {Import} from "./Import.d.mts"
import {filterNodes} from "./filterNodes.mts"

export function getImports(
	inst: Instance
) : Import[] {
	const list : Import[] = []
	const {source} = inst

	const nodes = filterNodes(source, (node: TSNode) => {
		if (!tsIsImportDeclaration(node)) return false
		if (!node.importClause) return false

		return true
	}) as TSImportDeclaration[]

	for (const node of nodes) {
		const module_name = node.moduleSpecifier.getText(
			source
		).toString().slice(1).slice(0, -1)

		const clause : TSImportClause = node.importClause!

		if (clause.namedBindings && tsIsNamedImports(clause.namedBindings)) {
			for (const element of clause.namedBindings.elements) {
				const identifier = element.name.getText(source)

				const import_name = element.propertyName ? element.propertyName.getText(
					source
				) : identifier

				const is_type_only = clause.isTypeOnly || element.isTypeOnly

				let definition_clause = `${import_name} as ${identifier}`

				if (import_name === identifier) definition_clause = identifier

				list.push({
					node,
					identifier,
					kind: "named",
					is_type_only,
					module_name,
					import_name,
					definition: `import ${is_type_only ? "type " : ""}{${definition_clause}} from "${module_name}"`
				})
			}
		} else if (clause.namedBindings && tsIsNamespaceImport(clause.namedBindings)) {
			const identifier = clause.namedBindings.name.getText(source)

			list.push({
				node,
				identifier,
				kind: "star",
				is_type_only: clause.isTypeOnly,
				module_name,
				definition: `import ${clause.isTypeOnly ? "type " : ""}* as ${identifier} from "${module_name}"`
			})
		} else if (clause.name) {
			const identifier = clause.name!.getText(source)

			list.push({
				node,
				identifier,
				kind: "default",
				is_type_only: clause.isTypeOnly,
				module_name,
				definition: `import ${clause.isTypeOnly ? "type " : ""}${identifier} from "${module_name}"`
			})
		}
	}

	return list
}
