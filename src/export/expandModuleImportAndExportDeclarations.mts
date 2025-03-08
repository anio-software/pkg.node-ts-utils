import ts from "typescript"

function transformImport(node: ts.ImportDeclaration): (ts.Node)|(ts.Node)[] {
	if (!node.importClause) return node
	if (!node.importClause.namedBindings) return node
	if (!ts.isNamedImports(node.importClause.namedBindings)) return node

	const ret: ts.ImportDeclaration[] = []

	for (const element of node.importClause.namedBindings.elements) {
		ret.push(
			ts.factory.createImportDeclaration(
				undefined,
				ts.factory.createImportClause(
					element.isTypeOnly || node.importClause.isTypeOnly,
					undefined,
					ts.factory.createNamedImports(
						[
							ts.factory.createImportSpecifier(
								false,
								element.propertyName,
								element.name
							)
						]
					)
				),
				node.moduleSpecifier
			)
		)
	}

	return ret
}

function transformExport(node: ts.ExportDeclaration): ts.Node|ts.Node[] {
	if (!node.exportClause) return node
	if (!ts.isNamedExports(node.exportClause)) return node

	const ret: ts.ExportDeclaration[] = []

	for (const element of node.exportClause.elements) {
		ret.push(
			ts.factory.createExportDeclaration(
				[],
				element.isTypeOnly || node.isTypeOnly,
				ts.factory.createNamedExports([
					ts.factory.createExportSpecifier(
						false,
						element.propertyName,
						element.name
					)
				]),
				node.moduleSpecifier
			)
		)
	}

	return ret
}

function transformerFactory() {
	return function transformer(context: ts.TransformationContext) {
		return (rootNode: ts.Node) => {
			const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
				// todo rename variable
				const newNode = ts.visitEachChild(node, visit, context)

				if (ts.isImportDeclaration(newNode)) {
					return transformImport(newNode)
				} else if (ts.isExportDeclaration(newNode)) {
					return transformExport(newNode)
				}

				return newNode
			}

			return ts.visitNode(rootNode, visit)
		}
	}
}

export function expandModuleImportAndExportDeclarations(
	sourceFile: ts.SourceFile
): ts.SourceFile {
	const transformer = transformerFactory()

	const {transformed} = ts.transform(sourceFile, [transformer])

	return transformed[0] as ts.SourceFile
}
