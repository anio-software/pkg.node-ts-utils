import ts from "typescript"
import {randomIdentifierSync} from "@aniojs/random-ident"

export function _createSyntheticSourceFile(
	code: string, isTSX: boolean
): ts.SourceFile {
	// NB: there is no such thing as ".mtsx"
	const syntheticSourceFileName = `synthetic${randomIdentifierSync(32)}${isTSX ? ".tsx" : ".mts"}`

	return ts.createSourceFile(
		syntheticSourceFileName,
		code,
		ts.ScriptTarget.Latest,
		true,
		isTSX ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	)
}
