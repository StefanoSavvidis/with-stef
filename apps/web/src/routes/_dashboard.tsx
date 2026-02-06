import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { useEffect } from "react"
import { BottomNav } from "@/components/BottomNav"
import Header from "@/components/Header"
import { Text } from "@/components/retroui"

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
})

function DashboardLayout() {
	return (
		<>
			<AuthLoading>
				<div className="flex items-center justify-center min-h-[50vh]">
					<Text>Loading...</Text>
				</div>
			</AuthLoading>
			<Unauthenticated>
				<RedirectToLogin />
			</Unauthenticated>
			<Authenticated>
				<Header />
				<div className="flex min-h-[calc(100vh-57px)] pb-14 md:pb-0">
					<Outlet />
				</div>
				<BottomNav />
			</Authenticated>
		</>
	)
}

function RedirectToLogin() {
	const navigate = useNavigate()

	useEffect(() => {
		navigate({ to: "/login" })
	}, [navigate])

	return (
		<div className="flex items-center justify-center min-h-[50vh]">
			<Text>Redirecting to login...</Text>
		</div>
	)
}
