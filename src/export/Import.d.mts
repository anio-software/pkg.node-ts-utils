import ts from "typescript"

export type Import = ({
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
})
