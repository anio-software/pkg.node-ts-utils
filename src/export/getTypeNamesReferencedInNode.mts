import ts from "typescript"
import {filterNodes} from "./filterNodes.mts"

//
// returns all type names referenced in a typescript node
//
// - excludes type parameters
// - includes identifiers referenced with the typeof operator
//
export function getTypeNamesReferencedInNode(
	tsChecker: ts.TypeChecker,
	node: ts.Node
): string[] {
	const typesUsed: Map<string, string> = new Map()
	const sourceFile = node.getSourceFile()

	const nodes = filterNodes(
		node, (node) => {
			// catch "typeof X"
			if (ts.isTypeQueryNode(node)) return true

			return ts.isTypeReferenceNode(node)
		}
	) as (ts.TypeReferenceNode|ts.TypeQueryNode)[]

	for (const node of nodes) {
		if (ts.isTypeReferenceNode(node)) {
			const sym = tsChecker.getTypeAtLocation(node)

			if (sym.isTypeParameter()) continue

			typesUsed.set(node.typeName.getText(sourceFile), "")
		} else if (ts.isTypeQueryNode(node)) {
			const identifier = node.exprName.getText(sourceFile)

			// this is safe to use because a type
			// cannot have a colon ":" in its name
			typesUsed.set(`typeof:${identifier}`, "")
		}
	}

	return [...typesUsed.entries()].map(([key]) => {
		return key
	})
}
