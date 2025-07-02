import type {NodeCommentKind} from "./NodeCommentKind.ts"

export type NodeComment = {
	kind: NodeCommentKind
	text: string
	isTrailing: boolean
}
