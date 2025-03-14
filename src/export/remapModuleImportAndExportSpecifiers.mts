import ts from "typescript"
import type {Transformer} from "./astTransform.mts"
import {printNode} from "./printNode.mts"

type Mapper = (
	moduleSpecifier: string,
	declaration: ts.ImportDeclaration | ts.ExportDeclaration
) => string|undefined

export function remapModuleImportAndExportSpecifiers(
	mapper: Mapper
): Transformer {
	return (node, {factory}) => {
		if (
		    !ts.isImportDeclaration(node) &&
		    !ts.isExportDeclaration(node)
		   ) {
			return node
		}

		if (!node.moduleSpecifier) return node

		const defaultModuleSpecifier = printNode(node.moduleSpecifier).slice(1, -1)
		const newModuleSpecifier = factory.createStringLiteral(
			mapper(defaultModuleSpecifier, node) ?? defaultModuleSpecifier
		)

		if (ts.isImportDeclaration(node)) {
			return factory.createImportDeclaration(
				node.modifiers,
				node.importClause,
				newModuleSpecifier,
				node.attributes
			)
		}

		return factory.createExportDeclaration(
			node.modifiers,
			node.isTypeOnly,
			node.exportClause,
			newModuleSpecifier,
			node.attributes
		)
	}
}
