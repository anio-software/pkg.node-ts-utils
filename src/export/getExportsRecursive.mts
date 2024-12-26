import ts from "typescript"
import type {Instance} from "./Instance.d.mts"
import type {Export} from "./Export.d.mts"

export function getExportsRecursive(
	filePath: string|null,
	inst: Instance
) : Export[] {
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

	return ret
}
