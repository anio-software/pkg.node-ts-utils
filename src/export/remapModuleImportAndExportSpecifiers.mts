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
	return (oldNode, {factory}) => {
		if (
		    !ts.isImportDeclaration(oldNode) &&
		    !ts.isExportDeclaration(oldNode)
		   ) {
			return oldNode
		}

		if (!oldNode.moduleSpecifier) return oldNode

		const defaultModuleSpecifier = printNode(oldNode.moduleSpecifier).slice(1, -1)
		const newModuleSpecifier = factory.createStringLiteral(
			mapper(defaultModuleSpecifier, oldNode) ?? defaultModuleSpecifier
		)

		if (ts.isImportDeclaration(oldNode)) {
			return factory.createImportDeclaration(
				oldNode.modifiers,
				oldNode.importClause,
				newModuleSpecifier,
				oldNode.attributes
			)
		}

		return factory.createExportDeclaration(
			oldNode.modifiers,
			oldNode.isTypeOnly,
			oldNode.exportClause,
			newModuleSpecifier,
			oldNode.attributes
		)
	}
}
