import {
	ScriptTarget as tsScriptTarget,
	ModuleKind as tsModuleKind,
	ModuleResolutionKind as tsModuleResolutionKind,
	createCompilerHost as tsCreateCompilerHost,
	createProgram as tsCreateProgram
} from "typescript"
import type {Instance} from "./Instance.d.mts"

export function parseCode(
	code: string
) : Instance {
	const compiler_options = {
		target: tsScriptTarget.ESNext,
		module: tsModuleKind.NodeNext,
		ModuleResolutionKind: tsModuleResolutionKind.NodeNext
	}

	const synthetic_file_name = `${Math.random().toString(32).slice(2)}.mts`

	const host = tsCreateCompilerHost(compiler_options, true)

	host.fileExists = (file_path) => file_path === synthetic_file_name
	host.readFile = (file_path) => {
		return (file_path === synthetic_file_name) ? code : ""
	}
	host.writeFile = () => undefined
	host.readDirectory = () => []
	host.directoryExists = () => false

	const program = tsCreateProgram(
		[synthetic_file_name],
		compiler_options,
		host
	)

	const source = program.getSourceFile(synthetic_file_name)!
	const checker = program.getTypeChecker()

	return {
		program,
		source,
		checker,
		compilerHost: host,
		compilerOptions: compiler_options
	}
}
