import ts from "typescript"

export type Export = {
	name: string,
	is_type_only: boolean,
	node: ts.Node
}
