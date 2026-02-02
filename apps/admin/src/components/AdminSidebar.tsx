import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router"
import { Trophy, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const navItems = [
	{
		label: "Trivia",
		href: "/trivia",
		icon: Trophy,
	},
]

export function AdminSidebar() {
	const matchRoute = useMatchRoute()
	const navigate = useNavigate()

	const handleLogout = async () => {
		await authClient.signOut()
		navigate({ to: "/login" })
	}

	return (
		<aside className="w-[200px] min-h-full border-r-2 border-black bg-card flex flex-col">
			<nav className="p-4 flex-1">
				<ul className="space-y-2">
					{navItems.map((item) => {
						const isActive = matchRoute({ to: item.href, fuzzy: true })
						const Icon = item.icon

						return (
							<li key={item.href}>
								<Link
									to={item.href}
									className={cn(
										"flex items-center gap-3 px-3 py-2 font-head text-sm border-2 border-transparent transition-all",
										isActive
											? "bg-primary border-black shadow-md"
											: "hover:bg-accent hover:border-black",
									)}
								>
									<Icon className="w-5 h-5" />
									{item.label}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			<div className="p-4 border-t-2 border-black">
				<button
					type="button"
					onClick={handleLogout}
					className="flex items-center gap-3 px-3 py-2 w-full font-head text-sm border-2 border-transparent transition-all text-red-600 hover:bg-red-50 hover:border-red-300"
				>
					<LogOut className="w-5 h-5" />
					Logout
				</button>
			</div>
		</aside>
	)
}
