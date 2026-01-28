import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	user: defineTable({
		name: v.string(),
		email: v.string(),
		emailVerified: v.boolean(),
		image: v.optional(v.string()),
		role: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("email", ["email"]),

	session: defineTable({
		expiresAt: v.number(),
		token: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
		ipAddress: v.optional(v.string()),
		userAgent: v.optional(v.string()),
		userId: v.id("user"),
	})
		.index("token", ["token"])
		.index("userId", ["userId"]),

	account: defineTable({
		accountId: v.string(),
		providerId: v.string(),
		userId: v.id("user"),
		accessToken: v.optional(v.string()),
		refreshToken: v.optional(v.string()),
		idToken: v.optional(v.string()),
		accessTokenExpiresAt: v.optional(v.number()),
		refreshTokenExpiresAt: v.optional(v.number()),
		scope: v.optional(v.string()),
		password: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("userId", ["userId"]),

	verification: defineTable({
		identifier: v.string(),
		value: v.string(),
		expiresAt: v.number(),
		createdAt: v.optional(v.number()),
		updatedAt: v.optional(v.number()),
	}).index("identifier", ["identifier"]),
})
