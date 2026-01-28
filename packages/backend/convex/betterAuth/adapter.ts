import { createApi } from "@convex-dev/better-auth"
import { createAuthOptions } from "../auth"
import schema from "./schema"

export const {
	create,
	findOne,
	findMany,
	updateOne,
	updateMany,
	deleteOne,
	deleteMany,
	// biome-ignore lint/suspicious/noExplicitAny: Required for type inference workaround with component exports
} = createApi(schema, createAuthOptions) as any
