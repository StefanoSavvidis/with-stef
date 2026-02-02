import { Link } from "@tanstack/react-router"
import type { Doc } from "@with-stef/backend/convex/_generated/dataModel"
import { Button, Card, Text } from "@/components/retroui"
import { cn } from "@/lib/utils"

interface GamesListProps {
	games: Doc<"triviaGames">[]
	onCreateGame: () => void
}

export function GamesList({ games, onCreateGame }: GamesListProps) {
	return (
		<Card className="p-4 w-full block">
			<div className="flex items-center justify-between mb-4">
				<Text as="h3">All Games</Text>
				<Button onClick={onCreateGame}>+ Create Game</Button>
			</div>

			{games.length === 0 ? (
				<Text as="p" className="text-muted-foreground">
					No games yet. Create your first trivia game!
				</Text>
			) : (
				<div className="space-y-2">
					{games.map((game) => (
						<GameRow key={game._id} game={game} />
					))}
				</div>
			)}
		</Card>
	)
}

function GameRow({ game }: { game: Doc<"triviaGames"> }) {
	return (
		<div className="flex items-center justify-between p-3 border-2 border-black bg-background">
			<div className="flex items-center gap-3">
				<Text as="p" className="font-medium">
					{game.name}
				</Text>
				<StatusBadge status={game.status} />
			</div>
			<Button variant="outline" size="sm" asChild>
				<Link to="/trivia/games/$gameId" params={{ gameId: game._id }}>
					{game.status === "ended" ? "View" : "Manage"}
				</Link>
			</Button>
		</div>
	)
}

function StatusBadge({ status }: { status: Doc<"triviaGames">["status"] }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border",
				status === "live" &&
					"bg-green-100 text-green-800 border-green-300",
				status === "draft" &&
					"bg-gray-100 text-gray-800 border-gray-300",
				status === "ended" &&
					"bg-gray-50 text-gray-500 border-gray-200",
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
