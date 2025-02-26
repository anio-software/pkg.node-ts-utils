import {
	readConfigFile as tsReadConfigFile,
	sys as tsSys,
	convertCompilerOptionsFromJson as tsConvertCompilerOptionsFromJson
} from "typescript"

export function readTSConfigFile(
	tsconfig_path: string,
	project_root: string
) {
	// Don't use JSON.parse to parse the config file
	// because TypeScript configs are allowed to have
	// comments in them.
	const tsconfig = tsReadConfigFile(
		tsconfig_path, tsSys.readFile
	).config

	const {errors, options} = tsConvertCompilerOptionsFromJson(
		tsconfig.compilerOptions, project_root
	)

	if (errors.length) {
		throw new Error(
			`Failed to load '${tsconfig_path}': \n    • ` +
			errors.map(({messageText}) => messageText).join("\n    • ")
		)
	}

	return {
		tsconfig,
		compilerOptions: options
	}
}
