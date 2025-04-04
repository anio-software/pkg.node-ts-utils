import ts from "typescript"
import {randomIdentifierSync} from "@aniojs/random-ident"

export function _createSyntheticSourceFile(
	code: string
): ts.SourceFile {
	const syntheticSourceFileName = `synthetic${randomIdentifierSync(32)}.mts`

	return ts.createSourceFile(
		syntheticSourceFileName,
		code,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
}
