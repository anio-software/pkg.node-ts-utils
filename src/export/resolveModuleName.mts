import {
	ScriptTarget as tsScriptTarget,
	ModuleKind as tsModuleKind,
	ModuleResolutionKind as tsModuleResolutionKind,
	resolveModuleName as tsResolveModuleName,
	sys as tsSys
} from "typescript"

export function resolveModuleName(
	moduleName: string, filePath: string
) {
	const compilerOptions = {
		target: tsScriptTarget.ESNext,
		module: tsModuleKind.NodeNext,
		ModuleResolutionKind: tsModuleResolutionKind.NodeNext
	}

	return tsResolveModuleName(
		moduleName,
		filePath,
		compilerOptions,
		tsSys
	).resolvedModule
}
