import ts from "typescript"

export type Instance = {
	source: ts.SourceFile,
	checker: ts.TypeChecker
}
