import ts from "typescript"
import {randomIdentifierSync} from "@aniojs/random-ident"

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

	//
	// the typescript API is a bit misleading here,
	// node.getSourceFile() doesn't always return a source
	// file. in some cases it returns undefined instead.
	// from my experience, this is the case when a node
	// is created with a factory function.
	// it should do no harm to just create an empty
	// source file in that case instead.
	//
	const sourceFile = (() => {
		const nodeSourceFile = node.getSourceFile()

		if (typeof nodeSourceFile === "undefined") {
			const syntheticSourceFileName = `synthetic${randomIdentifierSync(32)}.mts`

			// todo: log error/warning

			return ts.createSourceFile(
				syntheticSourceFileName,
				"",
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TS
			)
		}

		return nodeSourceFile
	})()

	const emitHint: ts.EmitHint = ts.isSourceFile(
		node
	) ? ts.EmitHint.SourceFile : ts.EmitHint.Unspecified

	return _convertSpacesToTabs(
		printer.printNode(
			emitHint,
			node,
			sourceFile
		)
	)
}
