import ts from "typescript"
import {getNodeComments} from "#~export/getNodeComments.ts"
import {attachCommentToNode} from "#~export/attachCommentToNode.ts"

export function copyComments<
	T extends ts.VisitResult<ts.Node>
>(oldNode: ts.Node, newNode: T): T {
	if (!newNode) return newNode;
	if (oldNode === newNode) return newNode;

	const comments = getNodeComments(oldNode)

	if ("kind" in newNode) {
		for (const comment of comments) {
			attachCommentToNode(newNode, comment)
		}
	} else if (Array.isArray(newNode)) {
		for (const comment of comments) {
			for (const node of newNode) {
				attachCommentToNode(node, comment)
			}
		}
	}

	return newNode
}
