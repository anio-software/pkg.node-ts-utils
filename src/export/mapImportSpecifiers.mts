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

type Mapper = (importSpecifier: string) => string

function transformerFactory(mapper: Mapper) {
	return function transformer(context: TSTransformationContext) {
		return (rootNode: TSNode) => {
			const visit = (node: TSNode) : TSNode => {
				const newNode = tsVisitEachChild(node, visit, context)

				if (tsIsImportDeclaration(newNode)) {
					const importSpecifier = newNode.moduleSpecifier.getText(
						rootNode as TSSourceFile
					).toString().slice(1).slice(0, -1)

					const new_import_specifier = mapper(importSpecifier)

					return context.factory.createImportDeclaration(
						newNode.modifiers,
						newNode.importClause,
						tsFactory.createStringLiteral(new_import_specifier),
						newNode.attributes
					)
				} else if (tsIsExportDeclaration(newNode) && newNode.moduleSpecifier) {
					const import_specifier = newNode.moduleSpecifier.getText(
						rootNode as TSSourceFile
					).toString().slice(1).slice(0, -1)

					const new_import_specifier = mapper(import_specifier)

					return context.factory.createExportDeclaration(
						newNode.modifiers,
						newNode.isTypeOnly,
						newNode.exportClause,
						tsFactory.createStringLiteral(new_import_specifier),
						newNode.attributes
					)
				}

				return newNode
			}

			return tsVisitNode(rootNode, visit)
		}
	}
}

export function mapImportSpecifiers(
	instance: Instance,
	mapper: Mapper
) : TSNode {
	const transformer = transformerFactory(mapper)

	const {transformed} = tsTransform(instance.source, [transformer])

	return transformed[0]
}
