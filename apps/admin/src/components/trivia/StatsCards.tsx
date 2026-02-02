import type { Doc } from "@with-stef/backend/convex/_generated/dataModel"
import { Card, Text } from "@/components/retroui"

interface StatsCardsProps {
	games: Doc<"triviaGames">[]
}

export function StatsCards({ games }: StatsCardsProps) {
	const totalGames = games.length
	const liveGames = games.filter((g) => g.status === "live").length
	const draftGames = games.filter((g) => g.status === "draft").length

	const stats = [
		{ label: "Total Games", value: totalGames },
		{ label: "Live", value: liveGames },
		{ label: "Drafts", value: draftGames },
	]

	return (
		<div className="grid grid-cols-3 gap-4">
			{stats.map((stat) => (
				<Card key={stat.label} className="p-4 w-full block">
					<Text as="p" className="text-sm text-muted-foreground">
						{stat.label}
					</Text>
					<Text as="h2" className="text-3xl">
						{stat.value}
					</Text>
				</Card>
			))}
		</div>
	)
}
