import { Outlet, createFileRoute } from "@tanstack/react-router"
import { AppSidebar } from "@/components/AppSidebar"

export const Route = createFileRoute("/_dashboard/_app")({
	component: AppLayout,
})

function AppLayout() {
	return (
		<>
			<AppSidebar />
			<Outlet />
		</>
	)
}
