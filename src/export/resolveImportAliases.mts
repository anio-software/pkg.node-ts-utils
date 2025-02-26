import {
	type TransformationContext as TSTransformationContext,
	type Node as TSNode,
	visitEachChild as tsVisitEachChild,
	isImportDeclaration as tsIsImportDeclaration,
	type SourceFile as TSSourceFile,
	factory as tsFactory,
	isExportDeclaration as tsIsExportDeclaration,
	visitNode as tsVisitNode,
	transform as tsTransform
} from "typescript"
import type {Instance} from "./Instance.d.mts"

type Aliases = {
	[key: string]: string
}

function sortAliases(aliases: Aliases) {
	let sorted = []

	for (const key in aliases) {
		sorted.push({key, value: aliases[key]})
	}

	sorted.sort((a, b) => {
		return b.key.length - a.key.length
	})

	return sorted.map(entry => {
		return {
			alias: entry.key,
			substitute: entry.value
		}
	})
}

function resolveImportAlias(
	sorted_aliases: {alias: string, substitute: string}[],
	import_specifier: string
) {
	let new_import_specifier = import_specifier

	for (const {alias, substitute} of sorted_aliases) {
		if (import_specifier.startsWith(alias)) {
			new_import_specifier = import_specifier.slice(alias.length)
			new_import_specifier = `${substitute}${new_import_specifier}`

			break
		}
	}

	return new_import_specifier
}

function transformerFactory(
	aliases: Aliases
) {
	const sorted_aliases = sortAliases(aliases)

	return function transformer(context: TSTransformationContext) {
		return (root_node: TSNode) => {
			const visit = (node: TSNode) : TSNode => {
				const new_node = tsVisitEachChild(node, visit, context)

				if (tsIsImportDeclaration(new_node)) {
					const import_specifier = new_node.moduleSpecifier.getText(
						root_node as TSSourceFile
					).toString().slice(1).slice(0, -1)

					const new_import_specifier = resolveImportAlias(sorted_aliases, import_specifier)

					return context.factory.createImportDeclaration(
						new_node.modifiers,
						new_node.importClause,
						tsFactory.createStringLiteral(new_import_specifier),
						new_node.attributes
					)
				} else if (tsIsExportDeclaration(new_node) && new_node.moduleSpecifier) {
					const import_specifier = new_node.moduleSpecifier.getText(
						root_node as TSSourceFile
					).toString().slice(1).slice(0, -1)

					const new_import_specifier = resolveImportAlias(sorted_aliases, import_specifier)

					return context.factory.createExportDeclaration(
						new_node.modifiers,
						new_node.isTypeOnly,
						new_node.exportClause,
						tsFactory.createStringLiteral(new_import_specifier),
						new_node.attributes
					)
				}

				return new_node
			}

			return tsVisitNode(root_node, visit)
		}
	}
}

export function resolveImportAliases(
	instance: Instance, aliases: Aliases
) : TSNode {
	const transformer = transformerFactory(aliases)

	const {transformed} = tsTransform(instance.source, [transformer])

	return transformed[0]
}
