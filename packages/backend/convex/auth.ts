import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { components } from "./_generated/api"
import type { DataModel } from "./_generated/dataModel"
import { query } from "./_generated/server"
import { betterAuth, type BetterAuthOptions } from "better-auth"
import { username } from "better-auth/plugins"
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
		baseURL: siteUrl,
		trustedOrigins: [
			siteUrl,
			"http://localhost:3000",
			"http://localhost:5173",
			"withstef://",
			"exp://*",
		],
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
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
			},
			disableCSRFCheck: true,
			disableOriginCheck: true,
		},
		plugins: [convex({ authConfig }), username()],
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
