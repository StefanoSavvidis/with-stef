import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { usePaginatedQuery } from "convex/react"
import { Button, Card, Text } from "@/components/retroui"

interface LeaderboardProps {
	gameId: Id<"triviaGames">
}

const PAGE_SIZE = 10

export function Leaderboard({ gameId }: LeaderboardProps) {
	const { results, status, loadMore } = usePaginatedQuery(
		api.trivia.getLeaderboard,
		{ gameId },
		{ initialNumItems: PAGE_SIZE },
	)

	if (status === "LoadingFirstPage") {
		return (
			<Card className="p-4 w-full block">
				<Text as="h3" className="mb-4">
					Leaderboard
				</Text>
				<Text as="p" className="text-muted-foreground">
					Loading...
				</Text>
			</Card>
		)
	}

	return (
		<Card className="p-4 w-full block">
			<Text as="h3" className="mb-4">
				Leaderboard
			</Text>

			{results.length === 0 ? (
				<Text as="p" className="text-muted-foreground">
					No participants yet
				</Text>
			) : (
				<div className="space-y-2">
					{results.map((entry, index) => (
						<div
							key={entry.participantId}
							className="flex items-center justify-between p-2 border-b border-gray-200 last:border-0"
						>
							<div className="flex items-center gap-3">
								<span className="w-6 text-center font-bold text-muted-foreground">
									{index + 1}
								</span>
								<Text as="p">{entry.name}</Text>
							</div>
							<Text as="p" className="font-bold">
								{entry.score} pts
							</Text>
						</div>
					))}

					{status === "CanLoadMore" && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => loadMore(PAGE_SIZE)}
							className="w-full mt-2"
						>
							Load More
						</Button>
					)}

					{status === "LoadingMore" && (
						<Text as="p" className="text-center text-muted-foreground mt-2">
							Loading...
						</Text>
					)}
				</div>
			)}
		</Card>
	)
}
