import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { createServerFn } from "@tanstack/react-start"
import { Toaster } from "../components/retroui"
import ConvexProvider from "../integrations/convex/provider"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"
import { getToken } from "../lib/auth-server"
import appCss from "../styles.css?url"

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	return await getToken()
})

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "With Stef",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	beforeLoad: async () => {
		const token = await getAuth()
		return { isAuthenticated: !!token, token }
	},
	component: RootComponent,
})

function RootComponent() {
	const { token } = Route.useRouteContext()

	return (
		<RootDocument>
			<ConvexProvider initialToken={token}>
				<Outlet />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
			</ConvexProvider>
		</RootDocument>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Toaster />
				<Scripts />
			</body>
		</html>
	)
}
