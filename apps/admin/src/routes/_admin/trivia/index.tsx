import { createFileRoute } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"
import { useState } from "react"
import {
	ActiveGameCard,
	NoActiveGame,
} from "@/components/trivia/ActiveGameCard"
import { CreateGameModal } from "@/components/trivia/CreateGameModal"
import { GamesList } from "@/components/trivia/GamesList"
import { StatsCards } from "@/components/trivia/StatsCards"
import { Text } from "@/components/retroui"

export const Route = createFileRoute("/_admin/trivia/")({
	component: TriviaDashboard,
})

function TriviaDashboard() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const games = useQuery(api.trivia.getMyGames)

	if (!games) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Text>Loading...</Text>
			</div>
		)
	}

	const liveGame = games.find((g) => g.status === "live")

	return (
		<div className="space-y-6">
			<Text as="h1">Trivia</Text>

			{/* Stats */}
			<section>
				<Text as="h4" className="mb-3 text-muted-foreground">
					Dashboard
				</Text>
				<StatsCards games={games} />
			</section>

			{/* Active Game */}
			<section>
				<Text as="h4" className="mb-3 text-muted-foreground">
					Active Game
				</Text>
				{liveGame ? <ActiveGameCard game={liveGame} /> : <NoActiveGame />}
			</section>

			{/* All Games */}
			<section>
				<GamesList games={games} onCreateGame={() => setIsCreateModalOpen(true)} />
			</section>

			<CreateGameModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>
		</div>
	)
}
