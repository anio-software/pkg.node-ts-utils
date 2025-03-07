import ts from "typescript"

export function mapNodes<T>(
	entry: ts.Node,
	map: (node: ts.Node) => T|undefined
) : T[] {
	const result : T[] = []

	function visitor(node: ts.Node) {
		const mappedNode = map(node)

		if (mappedNode !== undefined) {
			result.push(mappedNode)
		}

		return ts.visitEachChild(node, visitor, undefined)
	}

	ts.visitNode(entry, visitor)

	return result
}
