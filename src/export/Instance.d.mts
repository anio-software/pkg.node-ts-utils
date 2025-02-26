import {
	type Program as TSProgram,
	type SourceFile as TSSourceFile,
	type TypeChecker as TSTypeChecker,
	type CompilerHost as TSCompilerHost,
	type CompilerOptions as TSCompilerOptions
} from "typescript"

export type Instance = {
	program: TSProgram
	source: TSSourceFile,
	checker: TSTypeChecker
	compilerHost: TSCompilerHost
	compilerOptions: TSCompilerOptions
}
