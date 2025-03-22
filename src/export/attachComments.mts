import ts from "typescript"

export function attachComments<T extends ts.Node>(oldNode: T,newNode: T): T {
	const leadingComments = ts.getLeadingCommentRanges(
		oldNode.getFullText(), oldNode.getFullStart()
	)

	const trailingComments = ts.getTrailingCommentRanges(
		oldNode.getFullText(), oldNode.getEnd()
	)

	leadingComments ?.forEach(range => addComment(range, true))
	trailingComments?.forEach(range => addComment(range, false))

	return newNode

	function addComment(comment: ts.CommentRange, leading?: boolean) {
		const add =  leading === true ? ts.addSyntheticLeadingComment : ts.addSyntheticTrailingComment
		const text = oldNode.getSourceFile().text.slice(comment.pos, comment.end)

		const strippedComment = (() => {
			if (comment.kind === ts.SyntaxKind.SingleLineCommentTrivia) {
				return text.slice(2)
			} else if (comment.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
				return text.slice(2, - 2)
			}

			throw new Error(`Unknown comment kind.`)
		})()

		add(
			newNode,
			comment.kind,
			strippedComment,
			comment.hasTrailingNewLine
		)
	}
}
