import ts from "typescript"
import {astFilter} from "./astFilter.mts"
import {printNode} from "./printNode.mts"

export function getModuleImportAndExportSpecifiers(
	source: ts.SourceFile
): string[] {
	const specifiers: Map<string, string> = new Map()

	const nodes = astFilter(source, node => {
		return ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
	})

	for (const node of nodes) {
		if (!node.moduleSpecifier) continue

		const moduleSpecifier = printNode(node.moduleSpecifier).slice(1, -1)

		specifiers.set(moduleSpecifier, "")
	}

	return [...specifiers.entries()].map(([key]) => {
		return key
	})
}
