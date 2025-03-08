import ts from "typescript"

export type Mapper = (
	declaration: ts.ImportDeclaration|ts.ExportDeclaration
) => string|undefined

function transformerFactory(sourceFile: ts.SourceFile, mapper: Mapper) {
	return function transformer(context: ts.TransformationContext) {
		return (rootNode: ts.Node) => {
			const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
				// todo rename variable
				const newNode = ts.visitEachChild(node, visit, context)

				if (!ts.isImportDeclaration(newNode) &&
				    !ts.isExportDeclaration(newNode)) {
					return newNode
				}

				if (!newNode.moduleSpecifier) return newNode

				const defaultImportSpecifier = newNode.moduleSpecifier.getText(
					// newNode.getSourceFile() does not work for some reason
					sourceFile
				).slice(1, -1)

				const newImportSpecifier = mapper(
					newNode
				) ?? defaultImportSpecifier

				if (ts.isImportDeclaration(newNode)) {
					return context.factory.createImportDeclaration(
						newNode.modifiers,
						newNode.importClause,
						ts.factory.createStringLiteral(newImportSpecifier),
						newNode.attributes
					)
				}

				return context.factory.createExportDeclaration(
					newNode.modifiers,
					newNode.isTypeOnly,
					newNode.exportClause,
					ts.factory.createStringLiteral(newImportSpecifier),
					newNode.attributes
				)
			}

			return ts.visitNode(rootNode, visit)
		}
	}
}

export function remapModuleImportAndExportSpecifiers(
	sourceFile: ts.SourceFile,
	mapper: Mapper
): ts.Node {
	const transformer = transformerFactory(sourceFile, mapper)

	const {transformed} = ts.transform(sourceFile, [transformer])

	return transformed[0]
}
