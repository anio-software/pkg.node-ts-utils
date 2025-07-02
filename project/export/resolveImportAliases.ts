import type {Transformer} from "./Transformer.ts"
import {remapModuleImportAndExportSpecifiers} from "./remapModuleImportAndExportSpecifiers.ts"

type Aliases = Record<string, string>

function sortAliases(aliases: Aliases) {
	let sorted = []

	for (const key in aliases) {
		sorted.push({key, value: aliases[key]})
	}

	sorted.sort((a, b) => {
		return b.key.length - a.key.length
	})

	return sorted.map(entry => {
		return {
			alias: entry.key,
			substitute: entry.value
		}
	})
}

export function resolveImportAliases(
	aliases: Aliases
): Transformer {
	const sortedAliases = sortAliases(aliases)

	return remapModuleImportAndExportSpecifiers((moduleSpecifier) => {
		let newImportSpecifier = moduleSpecifier

		for (const {alias, substitute} of sortedAliases) {
			if (moduleSpecifier.startsWith(alias)) {
				newImportSpecifier = moduleSpecifier.slice(alias.length)
				newImportSpecifier = `${substitute}${newImportSpecifier}`

				break
			}
		}

		return newImportSpecifier
	})
}
