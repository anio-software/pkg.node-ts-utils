import ts from "typescript"
import type {Instance} from "./Instance.d.mts"
import {mapNodes} from "./mapNodes.mts"
import {printNode} from "./printNode.mts"
import {getJSDocAsStringFromNode} from "./getJSDocAsStringFromNode.mts"

function getDeclarationAsString(
	node: ts.TypeAliasDeclaration,
	drop_export_keyword: boolean = true
) : string {
	let ret = ``

	// drop "export" keyword
	const type = ts.factory.createTypeAliasDeclaration(
		(drop_export_keyword === true) ? [] : node.modifiers,
		node.name,
		node.typeParameters,
		node.type
	)

	const jsdoc = getJSDocAsStringFromNode(node)

	if (jsdoc.length) ret += `${jsdoc}\n`

	ret += printNode(type)

	return ret
}

export function getTopLevelTypeDeclarations(
	inst: Instance,
	drop_export_keyword?: boolean
) {
	return mapNodes(
		inst.source, (node: ts.Node) => {
			if (node.parent !== inst.source) return
			if (!ts.isTypeAliasDeclaration(node)) return

			const depends_on_type : string[] = mapNodes(node, (n : ts.Node) => {
				if (!ts.isTypeReferenceNode(n)) return

				return n.typeName.getText(inst.source)
			})

			return {
				name: node.name.getText(inst.source),
				definition: getDeclarationAsString(node, drop_export_keyword),
				depends_on_type,
				node
			}
		}
	).filter(e => e !== undefined)
}
