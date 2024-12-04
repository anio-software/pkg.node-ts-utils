import ts from "typescript"

export function filterNodes(
	entry: ts.Node,
	test: (node: ts.Node) => boolean
) : ts.Node[] {
	const result : ts.Node[] = []

	function visitor(node: ts.Node) {
		if (test(node)) {
			result.push(node)
		}

		return ts.visitEachChild(node, visitor, undefined)
	}

	ts.visitNode(entry, visitor)

	return result
}
