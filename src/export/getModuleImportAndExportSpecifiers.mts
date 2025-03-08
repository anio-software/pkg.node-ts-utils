import ts from "typescript"

import {filterNodes} from "./filterNodes.mts"

export function getModuleImportAndExportSpecifiers(
	sourceFile: ts.SourceFile
) {
	const nodes = filterNodes(sourceFile, node => {
		if (ts.isImportDeclaration(node)) return true
		if (ts.isExportDeclaration(node)) return true

		return false
	}) as (ts.ImportDeclaration|ts.ExportDeclaration)[]

	let moduleSpecifiers: Map<string, string> = new Map()

	for (const node of nodes) {
		if (!node.moduleSpecifier) continue

		const moduleSpecifier = node.moduleSpecifier.getText(
			sourceFile
		).slice(1, -1)

		moduleSpecifiers.set(moduleSpecifier, "")
	}

	return [
		...moduleSpecifiers.entries()
	].map(([key]) => {
		return key
	})
}
