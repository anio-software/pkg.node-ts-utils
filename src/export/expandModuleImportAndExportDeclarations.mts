import ts from "typescript"
import type {Transformer} from "./astTransform.mts"
import {expandImportDeclaration} from "#~src/expandImportDeclaration.mts"
import {expandExportDeclaration} from "#~src/expandExportDeclaration.mts"

export function expandModuleImportAndExportDeclarations(): Transformer {
	return (oldNode, {factory}) => {
		if (ts.isImportDeclaration(oldNode)) {
			return expandImportDeclaration(oldNode, factory)
		} else if (ts.isExportDeclaration(oldNode)) {
			return expandExportDeclaration(oldNode, factory)
		}

		return oldNode
	}
}
