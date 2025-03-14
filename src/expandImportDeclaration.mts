import ts from "typescript"

export function expandImportDeclaration(
	declaration: ts.ImportDeclaration,
	factory: ts.NodeFactory
): ts.VisitResult<ts.Node> {
	// these all already only use one module specifier (in MOST cases anyway)
	if (!declaration.importClause) return declaration
	if (!declaration.importClause.namedBindings) return declaration
	if (!ts.isNamedImports(declaration.importClause.namedBindings)) return declaration

	const ret: ts.ImportDeclaration[] = []

	for (const element of declaration.importClause.namedBindings.elements) {
		const importSpecifier = factory.createImportSpecifier(
			false,
			element.propertyName,
			element.name
		)

		const importClause = factory.createImportClause(
			element.isTypeOnly || declaration.importClause.isTypeOnly,
			undefined,
			factory.createNamedImports([importSpecifier])
		)

		ret.push(
			factory.createImportDeclaration(
				[], importClause, declaration.moduleSpecifier
			)
		)
	}

	return ret
}
