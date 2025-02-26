import {
	type Node as TSNode,
	createPrinter as tsCreatePrinter,
	NewLineKind as tsNewLineKind,
	EmitHint as tsEmitHint
} from "typescript"

function _convertSpacesToTabs(
	str: string
) : string {
	let ret_lines : string[] = []

	const lines = str.split("\n")

	for (const line of lines) {
		let last_space_position = 0

		for (; last_space_position < line.length; ++last_space_position) {
			if (line[last_space_position] !== " ") break;
		}

		const indent_level = Math.floor(last_space_position / 4)

		ret_lines.push("\t".repeat(indent_level) + `${line.slice(
			indent_level * 4
		)}`)
	}

	return ret_lines.join("\n")
}

export function printNode(
	node: TSNode
) : string {
	const printer = tsCreatePrinter({
		newLine: tsNewLineKind.LineFeed,
		removeComments: false,
		omitTrailingSemicolon: true
	})

	return _convertSpacesToTabs(
		printer.printNode(
			tsEmitHint.Unspecified,
			node,
			node.getSourceFile()
		)
	)
}
