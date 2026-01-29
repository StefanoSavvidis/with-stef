import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import { authClient } from "../../lib/auth-client"

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL
if (!CONVEX_URL) {
	console.error("missing env var VITE_CONVEX_URL")
}

const convex = new ConvexReactClient(CONVEX_URL, {
	expectAuth: true,
})

export default function AppConvexProvider({
	children,
	initialToken,
}: {
	children: React.ReactNode
	initialToken?: string | null
}) {
	return (
		<ConvexBetterAuthProvider
			client={convex}
			authClient={authClient}
			initialToken={initialToken}
		>
			{children}
		</ConvexBetterAuthProvider>
	)
}

export { convex, authClient }
