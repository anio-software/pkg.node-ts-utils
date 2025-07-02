import ts from "typescript"

export function astFilter<T extends ts.Node>(
	rootNode: ts.Node,
	test: (node: ts.Node) => node is T
): T[] {
	const result: T[] = []

	function visitor(node: ts.Node) {
		if (test(node)) {
			result.push(node)
		}

		return ts.visitEachChild(node, visitor, undefined)
	}

	ts.visitNode(rootNode, visitor)

	return result
}
