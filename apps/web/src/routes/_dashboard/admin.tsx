import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"
import { useEffect } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { Text } from "@/components/retroui"

export const Route = createFileRoute("/_dashboard/admin")({
	component: AdminLayout,
})

function AdminLayout() {
	const user = useQuery(api.auth.getCurrentUser)
	const navigate = useNavigate()

	useEffect(() => {
		if (user && user.role !== "admin") {
			navigate({ to: "/" })
		}
	}, [user, navigate])

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-[50vh] flex-1">
				<Text>Loading...</Text>
			</div>
		)
	}

	if (user.role !== "admin") {
		return (
			<div className="flex items-center justify-center min-h-[50vh] flex-1">
				<Text>Redirecting...</Text>
			</div>
		)
	}

	return (
		<>
			<AdminSidebar />
			<main className="flex-1 p-4 md:p-6">
				<Outlet />
			</main>
		</>
	)
}
