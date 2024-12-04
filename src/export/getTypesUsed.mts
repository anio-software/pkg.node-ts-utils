import ts from "typescript"
import type {Instance} from "./Instance.d.mts"
import {filterNodes} from "./filterNodes.mts"

export function getTypesUsed(
	inst: Instance,
	node: ts.Node
) : string[] {
	const list : string[] = []

	const nodes = filterNodes(
		node, (node: ts.Node) => {
			return ts.isTypeReferenceNode(node)
		}
	) as ts.TypeReferenceNode[]

	for (const node of nodes) {
		const sym = inst.checker.getTypeAtLocation(node)

		if (sym.isTypeParameter()) continue

		list.push(node.typeName.getText(inst.source))
	}

	return list
}
