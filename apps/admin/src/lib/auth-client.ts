import { createWebAuthClient } from "@with-stef/backend/auth-client"

const CONVEX_SITE_URL = import.meta.env.VITE_CONVEX_SITE_URL

if (!CONVEX_SITE_URL) {
	console.error("missing env var VITE_CONVEX_SITE_URL")
}

export const authClient = createWebAuthClient(CONVEX_SITE_URL)
