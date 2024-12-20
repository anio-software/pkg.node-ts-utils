import {parseCode} from "./dist/default/index.mjs"
import ts from "typescript"

const instance = parseCode(`
export type Alias1 = number

type Alias2 = string

export type {Alias2}

type Alias3 = string

export {type Alias3}
`)

const {checker, source} = instance

const sym = checker.getSymbolAtLocation(source)

for (const symbol of checker.getExportsOfModule(sym)) {
	console.log(
		symbol.name,
		(symbol.flags & ts.SymbolFlags.Value) === 0,
		(symbol.flags & ts.SymbolFlags.Alias) === 0
	)
}
