import ts from "typescript"

export function mapNodes<T>(
	entry: ts.Node,
	map: (node: ts.Node) => T|undefined
) : T[] {
	const result : T[] = []

	function visitor(node: ts.Node) {
		const mapped_node = map(node)

		if (mapped_node !== undefined) {
			result.push(mapped_node)
		}

		return ts.visitEachChild(node, visitor, undefined)
	}

	ts.visitNode(entry, visitor)

	return result
}
