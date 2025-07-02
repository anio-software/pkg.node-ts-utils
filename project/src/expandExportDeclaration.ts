import ts from "typescript"

export function expandExportDeclaration(
	declaration: ts.ExportDeclaration,
	factory: ts.NodeFactory
): ts.VisitResult<ts.Node> {
	if (!declaration.exportClause) return declaration
	if (!ts.isNamedExports(declaration.exportClause)) return declaration

	const ret: ts.ExportDeclaration[] = []

	for (const element of declaration.exportClause.elements) {
		const namedExports = factory.createNamedExports([
			factory.createExportSpecifier(
				false,
				element.propertyName,
				element.name
			)
		])

		ret.push(
			factory.createExportDeclaration(
				[],
				element.isTypeOnly || declaration.isTypeOnly,
				namedExports,
				declaration.moduleSpecifier
			)
		)
	}

	return ret
}
