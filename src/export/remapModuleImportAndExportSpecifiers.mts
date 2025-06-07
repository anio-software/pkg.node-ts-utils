import ts from "typescript"
import type {Transformer} from "./Transformer.d.mts"
import {printNode} from "./printNode.mts"
import {copyComments} from "#~src/copyComments.mts"

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
		const mapperResult = mapper(defaultModuleSpecifier, oldNode)
		const newModuleSpecifier = factory.createStringLiteral(
			mapperResult ?? defaultModuleSpecifier
		)

		if (ts.isImportDeclaration(oldNode)) {
			return copyComments(oldNode, factory.createImportDeclaration(
				oldNode.modifiers,
				oldNode.importClause,
				newModuleSpecifier,
				oldNode.attributes
			))
		}

		return copyComments(oldNode, factory.createExportDeclaration(
			oldNode.modifiers,
			oldNode.isTypeOnly,
			oldNode.exportClause,
			newModuleSpecifier,
			oldNode.attributes
		))
	}
}
