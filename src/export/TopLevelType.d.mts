import {
	type ImportDeclaration as TSImportDeclaration,
	type TypeAliasDeclaration as TSTypeAliasDeclaration
} from "typescript"

export type TopLevelType = {
	name: string,
	definition: string,
	node: TSImportDeclaration|TSTypeAliasDeclaration|null,
	depends_on_type: string[]
}
