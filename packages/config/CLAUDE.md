# Config Package

Shared TypeScript and Biome configurations consumed by all apps and packages.

## Exports

```typescript
// In tsconfig.json:
{ "extends": "@with-stef/config/tsconfig/base" }   // Base TS config
{ "extends": "@with-stef/config/tsconfig/react" }   // React apps (adds DOM, JSX)
{ "extends": "@with-stef/config/tsconfig/node" }    // Node.js (NodeNext modules)

// In biome.json:
{ "extends": ["@with-stef/config/biome"] }           // Shared Biome rules
```

## TypeScript Configs

### `tsconfig/base.json`
- Target: ES2022, Module: ESNext, bundler resolution
- Strict mode enabled, `noUnusedLocals`, `noUnusedParameters`

### `tsconfig/react.json` (extends base)
- Adds: DOM, DOM.Iterable libs
- JSX: `react-jsx`
- Allows `.ts` extension imports

### `tsconfig/node.json` (extends base)
- Module: NodeNext, moduleResolution: NodeNext

## Biome Config

### `biome.json`
- Formatter: Tabs (width 2)
- JS/TS: Double quotes, semicolons as needed
- Linter: Recommended rules enabled
- Organize imports on save
- Uses `.gitignore` for file exclusion
