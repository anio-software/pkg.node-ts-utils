import {
	type Node as TSNode,
	type SourceFile as TSSourceFile,
	getJSDocCommentsAndTags as tsGetJSDocCommentsAndTags
} from "typescript"

export function getJSDocAsStringFromNode(
	node: TSNode
) : string {
	const source : TSSourceFile = node.getSourceFile()

	const jsdoc = tsGetJSDocCommentsAndTags(node)
	const str = jsdoc.length ? jsdoc.map(doc => doc.getText(source)).join("\n") : ""

	if (!str.includes("\n")) {
		return str
	}

	const lines = str.split("\n")
	let ret = ``

	for (const line of lines) {
		let trimmed = line.trimStart()

		if (trimmed.startsWith("*")) {
			trimmed = ` ${trimmed}`
		}

		ret += `${trimmed}\n`
	}

	return ret.slice(0, -1)
}
