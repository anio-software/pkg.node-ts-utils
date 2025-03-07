import ts from "typescript"
import {getJSDocAsStringFromNode} from "./getJSDocAsStringFromNode.mts"
import {printNode} from "./printNode.mts"

export function convertTypeAliasDeclarationToString(
	node: ts.TypeAliasDeclaration,
	options?: {
		newTypeName?: string
		dropExportKeyword?: boolean
	}
): string {
	let typeIdentifier = node.name
	let ret = ``

	if (options?.newTypeName !== undefined) {
		typeIdentifier = ts.factory.createIdentifier(options.newTypeName)
	}

	const type = ts.factory.createTypeAliasDeclaration(
		(
			options?.dropExportKeyword === true ||
			options?.dropExportKeyword === undefined
		) ? [] : node.modifiers,
		typeIdentifier,
		node.typeParameters,
		node.type
	)

	const jsdoc = getJSDocAsStringFromNode(node)

	if (jsdoc.length) ret += `${jsdoc}\n`

	ret += printNode(type)

	return ret
}
