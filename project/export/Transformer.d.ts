import ts from "typescript"

export type Transformer = (
	node: ts.Node,
	context: ts.TransformationContext
) => ts.VisitResult<ts.Node>
