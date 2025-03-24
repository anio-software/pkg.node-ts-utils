import type {NodeCommentKind} from "./NodeCommentKind.d.mts"

export type NodeComment = {
	kind: NodeCommentKind
	text: string
	isTrailing: boolean
}
