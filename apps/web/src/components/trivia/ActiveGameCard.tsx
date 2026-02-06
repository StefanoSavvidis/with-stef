import { Link } from "@tanstack/react-router"
import type { Doc } from "@with-stef/backend/convex/_generated/dataModel"
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"
import { ArrowRight } from "lucide-react"
import { Button, Card, Text } from "@/components/retroui"

interface ActiveGameCardProps {
	game: Doc<"triviaGames">
}

export function ActiveGameCard({ game }: ActiveGameCardProps) {
	const gameData = useQuery(api.trivia.getGame, { gameId: game._id })
	const participantCount = useQuery(api.trivia.getParticipantCount, {
		gameId: game._id,
	})
	const questions = gameData?.questions ?? []
	const liveQuestion = questions.find((q) => q?.status === "live")
	const totalQuestions = questions.length

	return (
		<Card className="p-4 w-full block">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<Text as="h3">{game.name}</Text>
						<span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-300">
							<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
							LIVE
						</span>
					</div>
					<Text as="p" className="text-sm text-muted-foreground">
						{participantCount ?? 0} participant{participantCount !== 1 ? "s" : ""}
						{liveQuestion && ` · Question ${questions.indexOf(liveQuestion) + 1} of ${totalQuestions} live`}
						{!liveQuestion && totalQuestions > 0 && ` · ${totalQuestions} question${totalQuestions !== 1 ? "s" : ""}`}
					</Text>
				</div>
				<Button asChild>
					<Link to="/admin/trivia/games/$gameId" params={{ gameId: game._id }}>
						Manage
						<ArrowRight className="w-4 h-4 ml-2" />
					</Link>
				</Button>
			</div>
		</Card>
	)
}

export function NoActiveGame() {
	return (
		<Card className="p-4 w-full block">
			<Text as="p" className="text-muted-foreground">
				No active games. Create a game and go live to start!
			</Text>
		</Card>
	)
}
