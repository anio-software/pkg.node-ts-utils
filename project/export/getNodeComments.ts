import ts from "typescript"
import {printNode} from "./printNode.ts"

import type {NodeCommentKind} from "./NodeCommentKind.ts"
import type {NodeComment} from "./NodeComment.ts"

function syntaxKindToKind(syntaxKind: ts.SyntaxKind): NodeCommentKind {
	if (syntaxKind === ts.SyntaxKind.SingleLineCommentTrivia) {
		return "singleLine"
	} else if (syntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
		return "multiLine"
	}

	throw new Error(`Invalid syntax kind '${ts.SyntaxKind[syntaxKind]}'`)
}

function getCommentText(kind: NodeCommentKind, str: string) {
	if (kind === "singleLine") {
		return str.slice(2)
	}

	return str.slice(2, -2)
}

export function getNodeComments(node: ts.Node): NodeComment[] {
	const nodeComments: NodeComment[] = []

	// yes, this is sub-optimal but it works
	const nodeFullText = printNode(node)

	ts.getLeadingCommentRanges(
		nodeFullText, 0
	)?.forEach(range => {
		const kind = syntaxKindToKind(range.kind)
		const comment = nodeFullText.slice(range.pos, range.end)

		nodeComments.push({
			kind,
			text: getCommentText(kind, comment),
			isTrailing: false
		})
	})

	ts.getTrailingCommentRanges(
		nodeFullText, nodeFullText.length
	)?.forEach(range => {
		const kind = syntaxKindToKind(range.kind)
		const comment = nodeFullText.slice(range.pos, range.end)

		nodeComments.push({
			kind,
			text: getCommentText(kind, comment),
			isTrailing: true
		})
	})

	return nodeComments
}
