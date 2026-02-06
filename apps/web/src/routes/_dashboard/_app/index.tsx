import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { LiveBadge } from "@/components/LiveBadge"
import { Badge, Button, Card, Text } from "@/components/retroui"

export const Route = createFileRoute("/_dashboard/_app/")({
	component: HomePage,
})

function HomePage() {
	const liveGames = useQuery(api.trivia.listLiveGames)
	const endedGames = useQuery(api.trivia.listEndedGames)
	const joinGame = useMutation(api.trivia.joinGame)
	const navigate = useNavigate()

	const handleJoinGame = async (gameId: Id<"triviaGames">) => {
		try {
			await joinGame({ gameId })
			navigate({ to: "/games/$gameId", params: { gameId } })
		} catch {
			toast.error("Failed to join game. Please try again.")
		}
	}

	return (
		<main className="flex-1 p-4 md:p-6">
			<div className="space-y-6">
				<Text as="h1">Trivia Games</Text>

				{/* Live Games */}
				<section>
					<Text as="h4" className="mb-3 text-muted-foreground">
						Live Games
					</Text>
					{liveGames === undefined ? (
						<Text className="text-muted-foreground">Loading...</Text>
					) : liveGames.length === 0 ? (
						<Card className="p-4 w-full block">
							<Text as="p" className="text-muted-foreground">
								No live games right now. Check back soon!
							</Text>
						</Card>
					) : (
						<div className="space-y-3">
							{liveGames.map((game) => (
								<Card key={game._id} className="p-4 w-full block">
									<div className="flex items-center justify-between">
										<Text as="h3">{game.name}</Text>
										<div className="flex items-center gap-2">
											<LiveBadge />
											<Button
												size="sm"
												onClick={() => handleJoinGame(game._id)}
											>
												Join Game
											</Button>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</section>

				{/* Past Games */}
				<section>
					<Text as="h4" className="mb-3 text-muted-foreground">
						Past Games
					</Text>
					{endedGames === undefined ? (
						<Text className="text-muted-foreground">Loading...</Text>
					) : endedGames.length === 0 ? (
						<Card className="p-4 w-full block">
							<Text as="p" className="text-muted-foreground">
								No past games yet. Games will appear here once they end.
							</Text>
						</Card>
					) : (
						<div className="space-y-3">
							{endedGames.map((game) => (
								<Card key={game._id} className="p-4 w-full block">
									<div className="flex items-center justify-between">
										<Text as="h3">{game.name}</Text>
										<div className="flex items-center gap-2">
											<Badge variant="outline">ENDED</Badge>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													navigate({
														to: "/games/$gameId",
														params: { gameId: game._id },
													})
												}
											>
												View Results
											</Button>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	)
}
