import ts from "typescript"

export type Instance = {
	program: ts.Program
	source: ts.SourceFile,
	checker: ts.TypeChecker
	compilerHost: ts.CompilerHost
	compilerOptions: ts.CompilerOptions
}
