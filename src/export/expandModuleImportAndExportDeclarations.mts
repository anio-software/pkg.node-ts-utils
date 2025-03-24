import ts from "typescript"
import type {Transformer} from "./Transformer.d.mts"
import {expandImportDeclaration} from "#~src/expandImportDeclaration.mts"
import {expandExportDeclaration} from "#~src/expandExportDeclaration.mts"
import {copyComments} from "#~src/copyComments.mts"

export function expandModuleImportAndExportDeclarations(): Transformer {
	return (oldNode, {factory}) => {
		if (ts.isImportDeclaration(oldNode)) {
			return copyComments(oldNode, expandImportDeclaration(oldNode, factory))
		} else if (ts.isExportDeclaration(oldNode)) {
			return copyComments(oldNode, expandExportDeclaration(oldNode, factory))
		}

		return oldNode
	}
}
