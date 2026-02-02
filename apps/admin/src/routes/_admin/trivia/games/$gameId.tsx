import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { AddQuestionModal } from "@/components/trivia/AddQuestionModal"
import { Leaderboard } from "@/components/trivia/Leaderboard"
import { QuestionsList } from "@/components/trivia/QuestionsList"
import { Button, Text } from "@/components/retroui"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_admin/trivia/games/$gameId")({
	component: GameManagementPage,
})

function GameManagementPage() {
	const { gameId } = Route.useParams()
	const navigate = useNavigate()
	const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)

	const game = useQuery(api.trivia.getGame, {
		gameId: gameId as Id<"triviaGames">,
	})
	const updateGameStatus = useMutation(api.trivia.updateGameStatus)

	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

	if (game === undefined) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Text>Loading...</Text>
			</div>
		)
	}

	if (game === null) {
		return (
			<div className="space-y-4">
				<Link
					to="/trivia"
					className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Trivia
				</Link>
				<Text as="h1">Game not found</Text>
			</div>
		)
	}

	const handleGoLive = async () => {
		setIsUpdatingStatus(true)
		try {
			await updateGameStatus({
				gameId: gameId as Id<"triviaGames">,
				status: "live",
			})
		} finally {
			setIsUpdatingStatus(false)
		}
	}

	const handleEndGame = async () => {
		setIsUpdatingStatus(true)
		try {
			await updateGameStatus({
				gameId: gameId as Id<"triviaGames">,
				status: "ended",
			})
			navigate({ to: "/trivia" })
		} finally {
			setIsUpdatingStatus(false)
		}
	}

	const questions = (game.questions ?? []).filter(
		(q): q is NonNullable<typeof q> => q !== null,
	)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Link
						to="/trivia"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Trivia
					</Link>
					<div className="flex items-center gap-3">
						<Text as="h1">{game.name}</Text>
						<StatusBadge status={game.status} />
					</div>
				</div>

				{game.status === "draft" && (
					<Button onClick={handleGoLive} disabled={isUpdatingStatus}>
						{isUpdatingStatus ? "Going Live..." : "Go Live"}
					</Button>
				)}

				{game.status === "live" && (
					<Button
						variant="secondary"
						onClick={handleEndGame}
						disabled={isUpdatingStatus}
					>
						{isUpdatingStatus ? "Ending..." : "End Game"}
					</Button>
				)}
			</div>

			{/* Main Content */}
			<div className="flex gap-6">
				{/* Questions - Left 2/3 */}
				<div className="w-2/3">
					<QuestionsList
						questions={questions}
						gameStatus={game.status}
						onAddQuestion={() => setIsAddQuestionOpen(true)}
					/>
				</div>

				{/* Leaderboard - Right 1/3 */}
				<div className="w-1/3">
					<Leaderboard gameId={gameId as Id<"triviaGames">} />
				</div>
			</div>

			<AddQuestionModal
				isOpen={isAddQuestionOpen}
				onClose={() => setIsAddQuestionOpen(false)}
				gameId={gameId as Id<"triviaGames">}
			/>
		</div>
	)
}

function StatusBadge({ status }: { status: "draft" | "live" | "ended" }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border",
				status === "live" && "bg-green-100 text-green-800 border-green-300",
				status === "draft" && "bg-gray-100 text-gray-800 border-gray-300",
				status === "ended" && "bg-gray-50 text-gray-500 border-gray-200",
			)}
		>
			{status === "live" && (
				<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
			)}
			{status === "draft" && <span className="w-2 h-2 bg-gray-400 rounded-full" />}
			{status === "ended" && <span className="w-2 h-2 bg-gray-300 rounded-full" />}
			{status.toUpperCase()}
		</span>
	)
}
