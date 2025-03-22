import ts from "typescript"

export type Transformer = (
	node: ts.Node,
	context: ts.TransformationContext
) => ts.VisitResult<ts.Node>

function factory(
	transformer: Transformer,
	existingContext: ts.TransformationContext|undefined
) {
	return function(context: ts.TransformationContext) {
		return (rootNode: ts.Node) => {
			const visit = (oldNode: ts.Node): ts.VisitResult<ts.Node> => {
				const newNode = transformer(
					ts.visitEachChild(oldNode, visit, context),
					existingContext ?? context
				)

				return newNode
			}

			return ts.visitNode(rootNode, visit)
		}
	}
}

export function astTransform<T extends ts.Node>(
	rootNode: T,
	transformer: Transformer|Transformer[],
	existingContext?: ts.TransformationContext
): T {
	const transformers = (
		Array.isArray(transformer) ? transformer : [transformer]
	).map(fn => {
		return factory(fn, existingContext)
	})

	const {transformed} = ts.transform(rootNode, transformers)

	return transformed[0] as T
}
