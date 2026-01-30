import {
	customCtx,
	customMutation,
	customQuery,
} from "convex-helpers/server/customFunctions"
import { mutation, query } from "./_generated/server"
import { authComponent } from "./auth"

// ============================================================================
// Public (no auth required)
// ============================================================================

export const publicQuery = customQuery(query, customCtx(async () => ({})))

export const publicMutation = customMutation(
	mutation,
	customCtx(async () => ({})),
)

// ============================================================================
// Authenticated (logged in user required)
// ============================================================================

export const authedQuery = customQuery(
	query,
	customCtx(async (ctx) => {
		const user = await authComponent.getAuthUser(ctx)
		if (!user) {
			throw new Error("Unauthorized: must be logged in")
		}
		return { user }
	}),
)

export const authedMutation = customMutation(
	mutation,
	customCtx(async (ctx) => {
		const user = await authComponent.getAuthUser(ctx)
		if (!user) {
			throw new Error("Unauthorized: must be logged in")
		}
		return { user }
	}),
)

// ============================================================================
// Admin (admin role required)
// ============================================================================

export const adminQuery = customQuery(
	query,
	customCtx(async (ctx) => {
		const user = await authComponent.getAuthUser(ctx)
		if (!user) {
			throw new Error("Unauthorized: must be logged in")
		}
		if (user.role !== "admin") {
			throw new Error("Unauthorized: admin access required")
		}
		return { user }
	}),
)

export const adminMutation = customMutation(
	mutation,
	customCtx(async (ctx) => {
		const user = await authComponent.getAuthUser(ctx)
		if (!user) {
			throw new Error("Unauthorized: must be logged in")
		}
		if (user.role !== "admin") {
			throw new Error("Unauthorized: admin access required")
		}
		return { user }
	}),
)
