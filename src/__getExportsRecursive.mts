import {useContext, type RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"

import ts from "typescript"
import type {Instance} from "#~src/export/Instance.d.mts"
import type {Export} from "#~src/export/Export.d.mts"
import {filterNodes} from "#~src/export/filterNodes.mts"
import {resolveModuleName} from "#~src/export/resolveModuleName.mts"
import {parseCode} from "#~src/export/parseCode.mts"
import fs from "node:fs"

export function implementation(
	wrappedContext: RuntimeWrappedContextInstance,
	filePath: string|null,
	inst: Instance
) : Export[] {
	const context = useContext(wrappedContext, 0)

	const module_symbol = inst.checker.getSymbolAtLocation(inst.source)

	if (!module_symbol) return []

	const export_symbols = inst.checker.getExportsOfModule(module_symbol)
	const ret : Export[] = []

	for (const symbol of export_symbols) {
		let is_type_only : boolean = false

		if (!symbol.declarations) {
			throw new Error(`symbol.declarations is not defined.`)
		} else if (symbol.declarations.length !== 1) {
			throw new Error(`expected exactly one declaration.`)
		}

		const declaration = symbol.declarations[0]

		if (ts.isExportSpecifier(declaration)) {
			is_type_only ||= declaration.isTypeOnly
		} else if (ts.isTypeAliasDeclaration(declaration)) {
			is_type_only = true
		}

		if (declaration.parent && ts.isNamedExports(declaration.parent)) {
			for (const element of declaration.parent.elements) {
				if (symbol.name === element.name.getText(inst.source)) {
					is_type_only ||= element.isTypeOnly
				}
			}
		}

		if (declaration.parent?.parent && ts.isExportDeclaration(declaration.parent.parent)) {
			is_type_only ||= declaration.parent.parent.isTypeOnly
		}

		ret.push({
			name: symbol.name,
			is_type_only,
			node: declaration
		})
	}

	if (filePath !== null) {
		//
		// handle case of a star export:
		//
		// export * from "some-package"
		//
		// where we have to actually resolve and look at
		// "some-package" to know what exports it will produce
		//
		const starExportNodes = filterNodes(
			inst.source, (node: ts.Node) => {
				if (!ts.isExportDeclaration(node)) return false
				if (!node.moduleSpecifier) return false

				// we are only interested in exports
				// without a clause
				if (node.exportClause) return false

				return true
			}
		) as ts.ExportDeclaration[]

		for (const node of starExportNodes) {
			const moduleName = node.moduleSpecifier!.getText(inst.source).slice(1, -1)

			const resolvedModule = resolveModuleName(moduleName, filePath)

			if (!resolvedModule) {
				context.log.warn(
					`unable to resolve module name '${moduleName}' (from '${filePath}')`
				)

				continue
			}

			const resolvedModulePath = resolvedModule.resolvedFileName
			const resolvedModuleCode = fs.readFileSync(resolvedModulePath).toString()

			const moduleExports = implementation(
				wrappedContext,
				resolvedModulePath,
				parseCode(resolvedModuleCode)
			)

			for (const moduleExport of moduleExports) {
				// prevent duplicates from occouring
				// todo: this is an error condition
				if (existsInReturnArray(moduleExport.name)) {
					context.log.error(
						`already got export name '${moduleExport.name}', ignoring.`
					)

					continue
				}

				ret.push(moduleExport)
			}
		}
	}

	return ret

	function existsInReturnArray(name: string) {
		return !!ret.filter(entry => entry.name === name).length
	}
}
