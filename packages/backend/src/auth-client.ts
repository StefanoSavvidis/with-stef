import { createAuthClient } from "better-auth/react"
import {
	convexClient,
	crossDomainClient,
} from "@convex-dev/better-auth/client/plugins"

export function createWebAuthClient(convexSiteUrl: string) {
	return createAuthClient({
		baseURL: convexSiteUrl,
		plugins: [convexClient(), crossDomainClient()],
	})
}

export type AuthClient = ReturnType<typeof createWebAuthClient>
