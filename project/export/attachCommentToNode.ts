import ts from "typescript"
import type {NodeComment} from "./NodeComment.d.mts"

export function attachCommentToNode(node: ts.Node, comment: NodeComment) {
	const tsKind = (() => {
		if (comment.kind === "singleLine") {
			return ts.SyntaxKind.SingleLineCommentTrivia
		}

		return ts.SyntaxKind.MultiLineCommentTrivia
	})()

	if (comment.isTrailing === true) {
		ts.addSyntheticTrailingComment(node, tsKind, comment.text)
	} else {
		ts.addSyntheticLeadingComment(node, tsKind, comment.text)
	}
}
