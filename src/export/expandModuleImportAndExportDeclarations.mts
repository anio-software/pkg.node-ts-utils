import ts from "typescript"
import type {Transformer} from "./astTransform.mts"
import {expandImportDeclaration} from "#~src/expandImportDeclaration.mts"
import {expandExportDeclaration} from "#~src/expandExportDeclaration.mts"

export function expandModuleImportAndExportDeclarations(): Transformer {
	return (node, {factory}) => {
		if (ts.isImportDeclaration(node)) {
			return expandImportDeclaration(node, factory)
		} else if (ts.isExportDeclaration(node)) {
			return expandExportDeclaration(node, factory)
		}

		return node
	}
}
