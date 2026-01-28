import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex, crossDomain } from "@convex-dev/better-auth/plugins"
import { components } from "./_generated/api"
import type { DataModel } from "./_generated/dataModel"
import { query } from "./_generated/server"
import { betterAuth, type BetterAuthOptions } from "better-auth"
import authConfig from "./auth.config"
import authSchema from "./betterAuth/schema"

const siteUrl = process.env.SITE_URL ?? ""

export const authComponent = createClient<DataModel, typeof authSchema>(
	components.betterAuth,
	{ local: { schema: authSchema } },
)

export const createAuthOptions = (
	ctx: GenericCtx<DataModel>,
): BetterAuthOptions => {
	return {
		trustedOrigins: [siteUrl],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: false,
					defaultValue: "user",
					input: false,
				},
			},
		},
		plugins: [crossDomain({ siteUrl }), convex({ authConfig })],
	}
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth(createAuthOptions(ctx))
}

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.getAuthUser(ctx)
	},
})
