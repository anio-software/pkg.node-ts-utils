import ts from "typescript"

export type Instance = {
	source: ts.SourceFile,
	checker: ts.TypeChecker
}

export type FunctionDeclaration = {
	name: string|null,
	jsdoc: string
	modifiers: string[],

	type_params: {
		name: string,
		definition: string
	}[]

	params: {
		name: string,
		type: string,
		jsdoc: string,
		definition: string
	}[],

	return_type: string
}

export type ExportsList = {
	name: string,
	is_type_only: boolean,
	node: ts.Node
}[]

export type ImportsList = (({
	identifier: string,
	module_name: string
	is_type_only: boolean,
	definition: string,
	node: ts.ImportDeclaration
}) & ({
	kind: "named",
	import_name: string
} | {
	kind: "star"
} | {
	kind: "default"
}))[]

export type TopLevelType = {
	name: string,
	definition: string,
	node: ts.ImportDeclaration|ts.TypeAliasDeclaration|null,
	depends_on_type: string[]
}
