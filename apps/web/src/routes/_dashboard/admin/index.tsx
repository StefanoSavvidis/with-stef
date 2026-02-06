import { Link, createFileRoute } from "@tanstack/react-router"
import { Trophy } from "lucide-react"
import { Card, Text } from "@/components/retroui"

export const Route = createFileRoute("/_dashboard/admin/")({
	component: AdminOverview,
})

function AdminOverview() {
	return (
		<div className="space-y-6">
			<Text as="h1">Admin Dashboard</Text>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Link to="/admin/trivia">
					<Card className="p-4 w-full block hover:shadow-lg transition-shadow">
						<div className="flex items-center gap-3">
							<Trophy className="w-6 h-6" />
							<div>
								<Text as="h3">Trivia Management</Text>
								<Text as="p" className="text-sm text-muted-foreground">
									Create and manage trivia games
								</Text>
							</div>
						</div>
					</Card>
				</Link>
			</div>
		</div>
	)
}
