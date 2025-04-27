import ts from "typescript"
import path from "node:path"
import type {Transformer} from "./Transformer.d.mts"
import {astTransform} from "#~src/astTransform.mts"
import {randomIdentifierSync} from "@aniojs/random-ident"

function transformAndCreateFreshSourceFile(
	inputSourceFile: ts.SourceFile,
	transformer: Transformer,
	context: ts.TransformationContext|undefined
): ts.SourceFile {
	const transformedSourceFile = astTransform(inputSourceFile, transformer, context)
	const sourceText = ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
		removeComments: false,
		omitTrailingSemicolon: true
	}).printFile(transformedSourceFile)

	const syntheticSourceFileName = `synthetic${randomIdentifierSync(32)}.mts`

	return ts.createSourceFile(
		// preserve directory hierarchy
		`${path.dirname(inputSourceFile.fileName)}/${syntheticSourceFileName}`,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
}

export function transformSourceFile(
	sourceFile: ts.SourceFile,
	inTransformer: Transformer|Transformer[],
	existingContext?: ts.TransformationContext
): ts.SourceFile {
	const transformers = (
		Array.isArray(inTransformer) ? inTransformer : [inTransformer]
	)

	let currentSourceFile = sourceFile

	for (const transformer of transformers) {
		currentSourceFile = transformAndCreateFreshSourceFile(
			currentSourceFile,
			transformer,
			existingContext
		)
	}

	return currentSourceFile
}
