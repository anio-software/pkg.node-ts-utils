import {
	type ImportDeclaration as TSImportDeclaration
} from "typescript"

export type Import = ({
	identifier: string,
	module_name: string
	is_type_only: boolean,
	definition: string,
	node: TSImportDeclaration
}) & ({
	kind: "named",
	import_name: string
} | {
	kind: "star"
} | {
	kind: "default"
})
