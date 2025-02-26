import {
	type Node as TSNode
} from "typescript"
import type {Instance} from "./Instance.d.mts"
import {mapImportSpecifiers} from "./mapImportSpecifiers.mts"

type Aliases = {
	[key: string]: string
}

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
	instance: Instance, aliases: Aliases
) : TSNode {
	const sortedAliases = sortAliases(aliases)

	return mapImportSpecifiers(
		instance, (importSpecifier: string) => {
			let newImportSpecifier = importSpecifier

			for (const {alias, substitute} of sortedAliases) {
				if (importSpecifier.startsWith(alias)) {
					newImportSpecifier = importSpecifier.slice(alias.length)
					newImportSpecifier = `${substitute}${newImportSpecifier}`

					break
				}
			}

			return newImportSpecifier
		}
	)
}
