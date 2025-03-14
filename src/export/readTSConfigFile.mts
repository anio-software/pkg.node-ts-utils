import ts from "typescript"
import path from "node:path"
import {resolvePathSync} from "@aniojs/node-fs"

export function readTSConfigFile(
	projectRoot: string,
	tsconfigPath: string
) {
	if (!tsconfigPath.startsWith("/")) {
		tsconfigPath = path.join(projectRoot, tsconfigPath)
	}

	const resolvedProjectRoot = resolvePathSync(projectRoot, ["regularDir"])
	const resolvedTsConfigPath = resolvePathSync(tsconfigPath, ["regularFile"])

	// make sure 'tsconfigPath' is within 'projectRoot':
	// this also catches non-existing paths to tsconfigPath
	if (!resolvedTsConfigPath.startsWith(resolvedProjectRoot)) {
		throw new Error(
			`tsconfig file must be contained inside the project root.`
		)
	}

	// Don't use JSON.parse to parse the config file
	// because TypeScript configs are allowed to have
	// comments in them.
	const tsconfig = ts.readConfigFile(
		tsconfigPath, ts.sys.readFile
	).config

	const {errors, options} = ts.convertCompilerOptionsFromJson(
		tsconfig.compilerOptions, projectRoot
	)

	if (errors.length) {
		throw new Error(
			`Failed to load '${tsconfigPath}': \n    • ` +
			errors.map(({messageText}) => messageText).join("\n    • ")
		)
	}

	return {
		tsconfig,
		compilerOptions: options
	}
}
