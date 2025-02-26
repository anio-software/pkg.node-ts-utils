import {
	type Node as TSNode,
	visitEachChild as tsVisitEachChild,
	visitNode as tsVisitNode
} from "typescript"

export function mapNodes<T>(
	entry: TSNode,
	map: (node: TSNode) => T|undefined
) : T[] {
	const result : T[] = []

	function visitor(node: TSNode) {
		const mapped_node = map(node)

		if (mapped_node !== undefined) {
			result.push(mapped_node)
		}

		return tsVisitEachChild(node, visitor, undefined)
	}

	tsVisitNode(entry, visitor)

	return result
}
