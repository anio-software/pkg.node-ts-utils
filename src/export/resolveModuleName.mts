import ts from "typescript"

export function resolveModuleName(
	moduleName: string, filePath: string
) {
	const compilerOptions = {
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.NodeNext,
		ModuleResolutionKind: ts.ModuleResolutionKind.NodeNext
	}

	return ts.resolveModuleName(
		moduleName,
		filePath,
		compilerOptions,
		ts.sys
	).resolvedModule
}
