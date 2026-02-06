import { Link, useMatchRoute } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"
import { Home, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
	{
		label: "Home",
		href: "/",
		icon: Home,
		adminOnly: false,
	},
	{
		label: "Admin",
		href: "/admin",
		icon: Shield,
		adminOnly: true,
	},
]

export function BottomNav() {
	const matchRoute = useMatchRoute()
	const user = useQuery(api.auth.getCurrentUser)

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black bg-card md:hidden">
			<div className="flex h-14 items-center justify-around">
				{navItems
					.filter((item) => !item.adminOnly || user?.role === "admin")
					.map((item) => {
						const isActive = matchRoute({ to: item.href, fuzzy: true })
						const Icon = item.icon

						return (
							<Link
								key={item.href}
								to={item.href}
								className="flex flex-col items-center gap-0.5"
							>
								<div
									className={cn(
										"flex items-center justify-center w-9 h-9 border-2 border-transparent rounded transition-all",
										isActive
											? "bg-primary border-black shadow-md"
											: "hover:bg-accent",
									)}
								>
									<Icon className="w-5 h-5" />
								</div>
								<span className="text-xs font-head">{item.label}</span>
							</Link>
						)
					})}
			</div>
		</nav>
	)
}
