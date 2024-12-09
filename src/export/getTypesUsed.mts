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
			// catch "typeof X"
			if (ts.isTypeQueryNode(node)) return true

			return ts.isTypeReferenceNode(node)
		}
	) as (ts.TypeReferenceNode|ts.TypeQueryNode)[]

	for (const node of nodes) {
		if (ts.isTypeReferenceNode(node)) {
			const sym = inst.checker.getTypeAtLocation(node)

			if (sym.isTypeParameter()) continue

			list.push(node.typeName.getText(inst.source))
		} else if (ts.isTypeQueryNode(node)) {
			const identifier = node.exprName.getText(inst.source)

			list.push(`typeof:${identifier}`)
		}
	}

	return list
}
