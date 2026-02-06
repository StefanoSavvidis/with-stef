import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"
import { ChevronDown } from "lucide-react"
import { Avatar, Menu, Text } from "@/components/retroui"
import { authClient } from "@/lib/auth-client"

export default function Header() {
	const user = useQuery(api.auth.getCurrentUser)
	const navigate = useNavigate()
	const routerState = useRouterState()
	const isOnAdmin = routerState.location.pathname.startsWith("/admin")

	const handleSignOut = async () => {
		await authClient.signOut()
		navigate({ to: "/login" })
	}

	return (
		<header className="border-b-2 border-border bg-card px-6 py-4">
			<div className="flex items-center justify-between">
				<Link to="/">
					<Text as="h4" className="font-head">
						With Stef
					</Text>
				</Link>

				{user && (
					<Menu>
						<Menu.Trigger asChild>
							<button
								type="button"
								className="flex items-center gap-2 hover:opacity-80 transition-opacity"
							>
								<Avatar className="h-8 w-8">
									<Avatar.Fallback className="text-xs">
										{user.name?.charAt(0).toUpperCase() ?? "?"}
									</Avatar.Fallback>
								</Avatar>
								<ChevronDown className="w-4 h-4" />
							</button>
						</Menu.Trigger>
						<Menu.Content align="end" sideOffset={8} className="min-w-[200px]">
							<div className="px-2 py-1.5">
								<p className="text-sm font-medium">{user.name}</p>
								<p className="text-xs text-muted-foreground">{user.email}</p>
							</div>
							<div className="h-px bg-border my-1" />
							{user.role === "admin" && !isOnAdmin && (
								<Menu.Item asChild>
									<Link to="/admin">Admin</Link>
								</Menu.Item>
							)}
							{isOnAdmin && (
								<Menu.Item asChild>
									<Link to="/">Home</Link>
								</Menu.Item>
							)}
							<Menu.Item
								className="text-red-600 focus:bg-red-50"
								onSelect={handleSignOut}
							>
								Sign Out
							</Menu.Item>
						</Menu.Content>
					</Menu>
				)}
			</div>
		</header>
	)
}
