import ts from "typescript"

type DiagnosticMessage = {
	code: number
	message: string
}

export function emit(program: ts.Program): {
	emitSkipped: boolean
	diagnosticMessages: DiagnosticMessage[]
} {
	const result = program.emit()

	const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics)

	let diagnosticMessages: DiagnosticMessage[] = []

	for (const diagnostic of allDiagnostics) {
		const {code, messageText} = diagnostic
		const message = ts.flattenDiagnosticMessageText(messageText, "\n")

		if (diagnostic.file) {
			// @ts-ignore:next-line
			const {line, character} = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)

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
