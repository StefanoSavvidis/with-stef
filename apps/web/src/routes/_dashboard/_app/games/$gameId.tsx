import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { LiveBadge } from "@/components/LiveBadge"
import { Page } from "@/components/Page"
import { Badge, Button, Card, Text } from "@/components/retroui"
import { Leaderboard } from "@/components/trivia/Leaderboard"

export const Route = createFileRoute("/_dashboard/_app/games/$gameId")({
	component: GamePage,
})

function StatsSection({ gameId }: { gameId: Id<"triviaGames"> }) {
	const stats = useQuery(api.trivia.getMyStats, { gameId })

	if (!stats) return null

	return (
		<div className="space-y-2">
			<Text as="h3">Your Stats</Text>
			<div className="grid grid-cols-2 gap-2">
				<Card className="block px-3 py-2" style={{ backgroundColor: "#fae583" }}>
					<div className="text-xs text-muted-foreground">Rank</div>
					<div className="font-bold">
						#{stats.rank}/{stats.totalParticipants}
					</div>
				</Card>
				<Card className="block px-3 py-2" style={{ backgroundColor: "#ffdb33" }}>
					<div className="text-xs text-muted-foreground">Points</div>
					<div className="font-bold">{stats.score}</div>
				</Card>
			</div>
			<div className="grid grid-cols-3 gap-2">
				<Card className="block px-3 py-2" style={{ backgroundColor: "#93c5fd" }}>
					<div className="text-xs text-muted-foreground">Answered</div>
					<div className="font-bold">{stats.totalAnswered}</div>
				</Card>
				<Card className="block px-3 py-2" style={{ backgroundColor: "#86efac" }}>
					<div className="text-xs text-muted-foreground">Correct</div>
					<div className="font-bold">{stats.totalCorrect}</div>
				</Card>
				<Card className="block px-3 py-2" style={{ backgroundColor: "#fca5a5" }}>
					<div className="text-xs text-muted-foreground">Wrong</div>
					<div className="font-bold">{stats.totalWrong}</div>
				</Card>
			</div>
		</div>
	)
}

function GamePage() {
	const { gameId } = Route.useParams() as { gameId: Id<"triviaGames"> }
	const game = useQuery(api.trivia.getGame, { gameId })
	const stats = useQuery(api.trivia.getMyStats, { gameId })
	const submitAnswer = useMutation(api.trivia.submitAnswer)

	const isEnded = game?.status === "ended"
	const liveQuestion =
		game?.questions?.find((question) => question?.status === "live") ?? null

	const [selectedOption, setSelectedOption] = useState<number | null>(null)
	const currentQuestionId = liveQuestion?._id

	const resetKey = useMemo(
		() => (currentQuestionId ? String(currentQuestionId) : "waiting"),
		[currentQuestionId],
	)

	const handleAnswer = async (option: number) => {
		if (!liveQuestion) return
		try {
			await submitAnswer({
				questionId: liveQuestion._id,
				selectedOption: option,
			})
		} catch {
			toast.error("Unable to submit answer. Please try again.")
		}
	}

	// Loading state
	if (game === undefined) {
		return (
			<Page backLink={{ to: "/", label: "Back to Home" }}>
				<Text className="text-center">Loading...</Text>
			</Page>
		)
	}

	// Game not found
	if (game === null) {
		return (
			<Page backLink={{ to: "/", label: "Back to Home" }}>
				<Card className="p-4 w-full block">
					<Text as="h3">Game not found</Text>
					<Text as="p" className="text-muted-foreground mt-1">
						This game may have been deleted or doesn't exist.
					</Text>
				</Card>
			</Page>
		)
	}

	return (
		<Page
			backLink={{ to: "/", label: "Back to Home" }}
			topRight={
				isEnded ? <Badge variant="default">ENDED</Badge> : <LiveBadge />
			}
			key={resetKey}
		>
			<div>
				<Text as="h1">{game.name}</Text>
				<Text as="p" className="text-muted-foreground">
					{isEnded
						? "Game has ended. View final results below."
						: "Answer quickly to earn points."}
				</Text>
			</div>

			{/* Stats Section */}
			{stats ? (
				<StatsSection gameId={gameId} />
			) : isEnded ? (
				<Card className="p-4 w-full block bg-muted">
					<Text as="h3">You did not participate</Text>
					<Text as="p" className="text-muted-foreground mt-1">
						You didn't join this game, but you can view the leaderboard
						below.
					</Text>
				</Card>
			) : null}

			{/* Game content */}
			{isEnded ? (
				<div className="space-y-2">
					<Text as="h3">Leaderboard</Text>
					<Leaderboard gameId={gameId} />
				</div>
			) : liveQuestion ? (
				<div className="space-y-4">
					<Card
						className="p-4 w-full block"
						style={{ backgroundColor: "#fffbeb" }}
					>
						<Text as="h3">{liveQuestion.text}</Text>
					</Card>

					<div className="grid grid-cols-2 gap-3">
						{liveQuestion.options.map((option, index) => (
							<Button
								key={`${liveQuestion._id}-${index}`}
								variant={
									selectedOption === index ? "default" : "outline"
								}
								className="h-24 justify-center"
								onClick={() => {
									setSelectedOption(index)
									handleAnswer(index)
								}}
							>
								<Text as="p" className="font-bold text-center">
									{option}
								</Text>
							</Button>
						))}
					</div>
				</div>
			) : (
				<Card className="p-4 w-full block bg-muted">
					<Text as="h3">Waiting for next question…</Text>
					<Text as="p" className="text-muted-foreground mt-1">
						Hang tight while the host posts.
					</Text>
				</Card>
			)}
		</Page>
	)
}
