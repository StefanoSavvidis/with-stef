import { Link, useMatchRoute } from "@tanstack/react-router"
import { ArrowLeft, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
	{
		label: "Trivia",
		href: "/admin/trivia",
		icon: Trophy,
	},
]

export function AdminSidebar() {
	const matchRoute = useMatchRoute()

	return (
		<aside className="w-[200px] min-h-full border-r-2 border-black bg-card hidden md:flex flex-col">
			<nav className="p-4 flex-1">
				<ul className="space-y-2">
					<li>
						<Link
							to="/"
							className="flex items-center gap-3 px-3 py-2 font-head text-sm border-2 border-transparent transition-all text-muted-foreground hover:bg-accent hover:border-black"
						>
							<ArrowLeft className="w-5 h-5" />
							Home
						</Link>
					</li>
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
		</aside>
	)
}
