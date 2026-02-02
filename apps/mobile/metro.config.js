const { getDefaultConfig } = require("expo/metro-config")
const { withUniwindConfig } = require("uniwind/metro")
const path = require("path")

// Find the project and workspace root directories
const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot]

// 2. Let Metro know where to resolve packages from - project first
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(monorepoRoot, "node_modules"),
]

module.exports = withUniwindConfig(config, {
	cssEntryFile: "./src/global.css",
	dtsFile: "./src/uniwind-types.d.ts",
})
