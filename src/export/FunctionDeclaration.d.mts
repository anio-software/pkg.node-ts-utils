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
		optional: boolean
	}[],

	return_type: string
}
