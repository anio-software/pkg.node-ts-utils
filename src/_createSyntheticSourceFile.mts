import ts from "typescript"
import {randomIdentifierSync} from "@aniojs/random-ident"

export function _createSyntheticSourceFile(
	code: string, isTSX: boolean
): ts.SourceFile {
	const syntheticSourceFileName = `synthetic${randomIdentifierSync(32)}${isTSX ? ".tsx" : ".ts"}`

	return ts.createSourceFile(
		syntheticSourceFileName,
		code,
		ts.ScriptTarget.Latest,
		true,
		isTSX ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	)
}
