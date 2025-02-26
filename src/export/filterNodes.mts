import {
	type Node as TSNode,
	visitEachChild as tsVisitEachChild,
	visitNode as tsVisitNode
} from "typescript"

export function filterNodes(
	entry: TSNode,
	test: (node: TSNode) => boolean
) : TSNode[] {
	const result : TSNode[] = []

	function visitor(node: TSNode) {
		if (test(node)) {
			result.push(node)
		}

		return tsVisitEachChild(node, visitor, undefined)
	}

	tsVisitNode(entry, visitor)

	return result
}
