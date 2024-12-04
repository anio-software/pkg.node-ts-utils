export type FunctionDeclaration = {
	name: string|null,
	jsdoc: string
	modifiers: string[],

	type_params: {
		name: string,
		definition: string
	}[]

	params: {
		name: string,
		type: string,
		jsdoc: string,
		definition: string
	}[],

	return_type: string
}
