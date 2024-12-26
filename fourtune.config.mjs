import {generateFactoryFiles} from "@fourtune/realm-js/v0/autogenerate"

export default {
	realm: {
		name: "js",
		type: "package",

		options: {
			runtime: "node",
			external_npm_packages: ["typescript"]
		}
	},

	autogenerate: {
		...generateFactoryFiles({
			source_file: "src/__getExportsRecursive.mts",
			export_name: "getExportsRecursive",
			destination: "src/export"
		}),
		...generateFactoryFiles({
			source_file: "src/__getExports.mts",
			export_name: "getExports",
			destination: "src/export"
		})
	}
}
