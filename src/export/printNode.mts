import ts from "typescript"

function _convertSpacesToTabs(str: string): string {
	const lines: string[] = []

	for (const line of str.split("\n")) {
		let lastSpacePosition = 0

		for (; lastSpacePosition < line.length; ++lastSpacePosition) {
			if (line[lastSpacePosition] !== " ") break;
		}

		const indentLevel = Math.floor(lastSpacePosition / 4)

		lines.push("\t".repeat(indentLevel) + `${line.slice(
			indentLevel * 4
		)}`)
	}

	return lines.join("\n")
}

export function printNode(node: ts.Node): string {
	const printer = ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
		removeComments: false,
		omitTrailingSemicolon: true
	})

	const emitHint: ts.EmitHint = ts.isSourceFile(
		node
	) ? ts.EmitHint.SourceFile : ts.EmitHint.Unspecified

	return _convertSpacesToTabs(
		printer.printNode(
			emitHint,
			node,
			node.getSourceFile()
		)
	)
}
