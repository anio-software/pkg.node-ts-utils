import ts from "typescript"
import {getJSDocAsFormattedStringFromNode} from "./getJSDocAsFormattedStringFromNode.ts"
import {printNode} from "./printNode.ts"
import {_createSyntheticSourceFile} from "#~src/_createSyntheticSourceFile.ts"
import {transformSourceFile} from "./transformSourceFile.ts"

export function getTypeAliasDeclarationAsFormattedString(
	node: ts.TypeAliasDeclaration,
	options?: {
		newTypeName?: string
		dropExportKeyword?: boolean
	}
): string {
	const nodeSourceFile = node.getSourceFile()

	if (!nodeSourceFile) {
		throw new Error(`This function can only work with nodes that belong to a source file.`)
	}

	const tmpSourceFile = _createSyntheticSourceFile(
		printNode(node), nodeSourceFile.fileName.endsWith(".tsx")
	)

	// marker to check if we have more than one ts type alias declaration node
	let transformedTypeNode = false

	const newSourceFile = transformSourceFile(
		tmpSourceFile, (node, context) => {
			if (!ts.isTypeAliasDeclaration(node)) return node
			if (transformedTypeNode) {
				throw new Error(
					`shouldn't be able to get here, means we have multiple type alias declarations.`
				)
			}

			transformedTypeNode = true

			let typeName = node.name

			if (options?.newTypeName !== undefined) {
				typeName = context.factory.createIdentifier(
					options.newTypeName
				)
			}

			const modifiers = (
				options?.dropExportKeyword === true ||
				options?.dropExportKeyword === undefined
			) ? [] : node.modifiers

			return context.factory.updateTypeAliasDeclaration(
				node, modifiers, typeName, node.typeParameters, node.type
			)
		}
	)

	const jsdoc = getJSDocAsFormattedStringFromNode(node)

	let ret = ``

	if (jsdoc.length) ret += `${jsdoc}\n`

	ret += printNode(newSourceFile)

	return ret
}
