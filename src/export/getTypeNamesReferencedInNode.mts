import ts from "typescript"
import {astFilter} from "./astFilter.mts"
import {printNode} from "./printNode.mts"

//
// returns all type names referenced in a typescript node
//
// - excludes type parameters
// - includes identifiers referenced with the typeof operator
//
export function getTypeNamesReferencedInNode(
	tsChecker: ts.TypeChecker,
	rootNode: ts.Node
): string[] {
	const typesUsed: Map<string, string> = new Map()

	const nodes = astFilter(
		rootNode, (node) => {
			return ts.isTypeQueryNode(node) || ts.isTypeReferenceNode(node)
		}
	)

	for (const node of nodes) {
		if (ts.isTypeReferenceNode(node)) {
			const sym = tsChecker.getTypeAtLocation(node)

			if (sym.isTypeParameter()) continue

			typesUsed.set(printNode(node.typeName), "")
		} else if (ts.isTypeQueryNode(node)) {
			const identifier = printNode(node.exprName)

			// this is safe to use because a type
			// cannot have a colon ":" in its name
			typesUsed.set(`typeof:${identifier}`, "")
		}
	}

	return [...typesUsed.entries()].map(([key]) => {
		return key
	})
}
