import ts from "typescript"
import type {Transformer} from "./Transformer.ts"
import {expandImportDeclaration} from "#~src/expandImportDeclaration.ts"
import {expandExportDeclaration} from "#~src/expandExportDeclaration.ts"
import {copyComments} from "#~src/copyComments.ts"

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
