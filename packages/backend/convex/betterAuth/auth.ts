import { createAuth } from "../auth"

// Static instance for schema generation only
// biome-ignore lint/suspicious/noExplicitAny: Required for static schema generation
export const auth = createAuth({} as any)
