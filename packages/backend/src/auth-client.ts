import { createAuthClient } from "better-auth/react"
import {
	convexClient,
	crossDomainClient,
} from "@convex-dev/better-auth/client/plugins"
import { usernameClient } from "better-auth/client/plugins"

export function createWebAuthClient(convexSiteUrl: string) {
	return createAuthClient({
		baseURL: convexSiteUrl,
		plugins: [convexClient(), crossDomainClient(), usernameClient()],
	})
}

export type AuthClient = ReturnType<typeof createWebAuthClient>
