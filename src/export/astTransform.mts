import ts from "typescript"

export type Transformer = (
	node: ts.Node,
	context: ts.TransformationContext
) => ts.VisitResult<ts.Node>

function factory(transformer: Transformer) {
	return function(context: ts.TransformationContext) {
		return (rootNode: ts.Node) => {
			const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
				return transformer(
					ts.visitEachChild(node, visit, context),
					context
				)
			}

			return ts.visitNode(rootNode, visit)
		}
	}
}

export function astTransform<T extends ts.Node>(
	rootNode: T,
	transformer: Transformer|Transformer[]
): T {
	const transformers = (
		Array.isArray(transformer) ? transformer : [transformer]
	).map(factory)

	const {transformed} = ts.transform(rootNode, transformers)

	return transformed[0] as T
}
