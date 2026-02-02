import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react"
import { useEffect } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { Text } from "@/components/retroui"

export const Route = createFileRoute("/_admin")({
	component: AdminLayout,
})

function AdminLayout() {
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
				<AdminContent />
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

function AdminContent() {
	const user = useQuery(api.auth.getCurrentUser)
	const navigate = useNavigate()

	useEffect(() => {
		if (user && user.role !== "admin") {
			navigate({ to: "/" })
		}
	}, [user, navigate])

	// Still loading user data
	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Text>Loading...</Text>
			</div>
		)
	}

	// Non-admin users get redirected
	if (user.role !== "admin") {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Text>Redirecting...</Text>
			</div>
		)
	}

	// Admin users see the layout
	return (
		<div className="flex min-h-[calc(100vh-57px)]">
			<AdminSidebar />
			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	)
}
