import {
	type Node as TSNode
} from "typescript"

export type Export = {
	name: string,
	is_type_only: boolean,
	node: TSNode,
	originModule: string|undefined
}
