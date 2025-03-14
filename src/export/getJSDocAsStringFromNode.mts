import ts from "typescript"

export function getJSDocAsStringFromNode(node: ts.Node): string {
	const source = node.getSourceFile()
	const jsdoc = ts.getJSDocCommentsAndTags(node)

	const str = jsdoc.length ? jsdoc.map(
		doc => doc.getText(source)
	).join("\n") : ""

	if (!str.includes("\n")) return str

	let ret = ``
	const lines = str.split("\n")

	for (const line of lines) {
		let trimmed = line.trimStart()

		if (trimmed.startsWith("*")) {
			trimmed = ` ${trimmed}`
		}

		ret += `${trimmed}\n`
	}

	return ret.slice(0, -1)
}
