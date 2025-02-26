import {
	type Node as TSNode,
	isTypeQueryNode as tsIsTypeQueryNode,
	isTypeReferenceNode as tsIsTypeReferenceNode,
	type TypeReferenceNode as TSTypeReferenceNode,
	type TypeQueryNode as TSTypeQueryNode
} from "typescript"
import type {Instance} from "./Instance.d.mts"
import {filterNodes} from "./filterNodes.mts"

export function getTypesUsed(
	inst: Instance,
	node: TSNode
) : string[] {
	const list : string[] = []

	const nodes = filterNodes(
		node, (node: TSNode) => {
			// catch "typeof X"
			if (tsIsTypeQueryNode(node)) return true

			return tsIsTypeReferenceNode(node)
		}
	) as (TSTypeReferenceNode|TSTypeQueryNode)[]

	for (const node of nodes) {
		if (tsIsTypeReferenceNode(node)) {
			const sym = inst.checker.getTypeAtLocation(node)

			if (sym.isTypeParameter()) continue

			list.push(node.typeName.getText(inst.source))
		} else if (tsIsTypeQueryNode(node)) {
			const identifier = node.exprName.getText(inst.source)

			list.push(`typeof:${identifier}`)
		}
	}

	return list
}
