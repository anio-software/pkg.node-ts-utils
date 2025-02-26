import {
	type Program as TSProgram,
	getPreEmitDiagnostics as tsGetPreEmitDiagnostics,
	flattenDiagnosticMessageText as tsFlattenDiagnosticMessageText,
	getLineAndCharacterOfPosition as tsGetLineAndCharacterOfPosition
} from "typescript"

type DiagnosticMessage = {
	code: number
	message: string
}

export function emit(program: TSProgram): {
	emitSkipped: boolean
	diagnosticMessages: DiagnosticMessage[]
} {
	const result = program.emit()

	const allDiagnostics = tsGetPreEmitDiagnostics(program).concat(result.diagnostics)

	let diagnosticMessages: DiagnosticMessage[] = []

	for (const diagnostic of allDiagnostics) {
		const {code, messageText} = diagnostic
		const message = tsFlattenDiagnosticMessageText(messageText, "\n")

		if (diagnostic.file) {
			// @ts-ignore:next-line
			const {line, character} = tsGetLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)

			diagnosticMessages.push({
				code,
				message: `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
			})
		} else {
			diagnosticMessages.push({code, message})
		}
	}

	return {
		emitSkipped: result.emitSkipped,
		diagnosticMessages
	}
}
