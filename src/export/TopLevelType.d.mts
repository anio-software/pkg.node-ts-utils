import ts from "typescript"

export type TopLevelType = {
	name: string,
	definition: string,
	node: ts.ImportDeclaration|ts.TypeAliasDeclaration|null,
	depends_on_type: string[]
}
