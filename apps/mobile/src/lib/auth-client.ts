import { createAuthClient } from "better-auth/react"
import { expoClient } from "@better-auth/expo/client"
import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { usernameClient } from "better-auth/client/plugins"
import * as SecureStore from "expo-secure-store"

const CONVEX_SITE_URL = process.env.EXPO_PUBLIC_CONVEX_SITE_URL!

export const authClient = createAuthClient({
	baseURL: CONVEX_SITE_URL,
	plugins: [
		convexClient(),
		usernameClient(),
		expoClient({
			storagePrefix: "with-stef",
			storage: SecureStore,
		}),
	],
})
