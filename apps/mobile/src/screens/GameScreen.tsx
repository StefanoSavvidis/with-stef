import { useMemo, useState } from "react"
import { useMutation, useQuery, usePaginatedQuery } from "convex/react"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Pressable, ActivityIndicator } from "react-native"
import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { ScrollView, View } from "@/tw"
import { Button, Card, Text, Badge, toast, Icon } from "@/components/retroui"
import type { TriviaStackParamList } from "@/navigation/types"

function LeaderboardSection({ gameId }: { gameId: Id<"triviaGames"> }) {
	const { results, status, loadMore } = usePaginatedQuery(
		api.trivia.getLeaderboard,
		{ gameId },
		{ initialNumItems: 10 },
	)

	if (results.length === 0) {
		return (
			<Card className="bg-[#f5f5f5]">
				<Card.Content>
					<Text variant="muted">No participants yet.</Text>
				</Card.Content>
			</Card>
		)
	}

	return (
		<View className="gap-2">
			{results.map((participant, index) => (
				<View
					key={participant.participantId}
					className="flex-row items-center gap-3 rounded border-2 border-black bg-white px-4 py-3"
				>
					<View
						className="h-8 w-8 items-center justify-center rounded-full"
						style={{
							backgroundColor:
								index === 0
									? "#ffd700"
									: index === 1
										? "#c0c0c0"
										: index === 2
											? "#cd7f32"
											: "#e5e5e5",
						}}
					>
						<Text variant="label">#{index + 1}</Text>
					</View>
					<View className="flex-1">
						<Text variant="label">{participant.name}</Text>
					</View>
					<View className="flex-row items-center gap-1">
						<Icon name="star" size={14} color="#000" />
						<Text variant="label">{participant.score}</Text>
					</View>
				</View>
			))}
			{status === "CanLoadMore" && (
				<Button variant="outline" onPress={() => loadMore(10)}>
					Load More
				</Button>
			)}
			{status === "LoadingMore" && (
				<View className="items-center py-2">
					<ActivityIndicator size="small" color="#000" />
				</View>
			)}
		</View>
	)
}

export default function GameScreen() {
	const navigation =
		useNavigation<NativeStackNavigationProp<TriviaStackParamList>>()
	const route = useRoute<RouteProp<TriviaStackParamList, "Game">>()
	const { gameId } = route.params

	const game = useQuery(api.trivia.getGame, { gameId })
	const stats = useQuery(api.trivia.getMyStats, { gameId })
	const submitAnswer = useMutation(api.trivia.submitAnswer)

	const isEnded = game?.status === "ended"
	const liveQuestion =
		game?.questions?.find((question) => question?.status === "live") ?? null

	const statsTopRow = [
		{
			key: "rank",
			label: "Rank",
			value: stats ? `#${stats.rank}/${stats.totalParticipants}` : "--",
			icon: "trophy",
			background: "#fae583",
		},
		{
			key: "points",
			label: "Points",
			value: stats?.score ?? 0,
			icon: "star",
			background: "#ffdb33",
		},
	]

	const statsBottomRow = [
		{
			key: "answered",
			label: "Answered",
			value: stats?.totalAnswered ?? 0,
			icon: "list",
			background: "#93c5fd",
		},
		{
			key: "correct",
			label: "Correct",
			value: stats?.totalCorrect ?? 0,
			icon: "check-circle",
			background: "#86efac",
		},
		{
			key: "wrong",
			label: "Wrong",
			value: stats?.totalWrong ?? 0,
			icon: "x",
			background: "#fca5a5",
		},
	]

	const [selectedOption, setSelectedOption] = useState<number | null>(null)
	const currentQuestionId = liveQuestion?._id

	const resetKey = useMemo(
		() => (currentQuestionId ? String(currentQuestionId) : "waiting"),
		[currentQuestionId],
	)

	const isSelected = (index: number) => selectedOption === index

	const handleAnswer = async (selectedOption: number) => {
		if (!liveQuestion) return
		try {
			await submitAnswer({
				questionId: liveQuestion._id,
				selectedOption,
			})
		} catch (error) {
			toast.error("Unable to submit answer", "Please try again.")
		}
	}

	// Loading state
	if (game === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" color="#000" />
			</View>
		)
	}

	// Game not found
	if (game === null) {
		return (
			<View className="flex-1 items-center justify-center bg-white p-5">
				<Card>
					<Card.Content className="gap-4">
						<Text variant="h3">Game not found</Text>
						<Text variant="muted">
							This game may have been deleted or doesn't exist.
						</Text>
						<Button onPress={() => navigation.goBack()}>Go Back</Button>
					</Card.Content>
				</Card>
			</View>
		)
	}

	return (
		<ScrollView className="flex-1 bg-white" contentContainerClassName="p-5">
			<View className="mt-10 gap-5" key={resetKey}>
				<View className="flex-row items-center justify-between">
					<Button variant="outline" size="sm" onPress={() => navigation.goBack()}>
						Back
					</Button>
					<Badge size="sm" variant={isEnded ? "default" : "surface"}>
						{isEnded ? "ENDED" : "LIVE"}
					</Badge>
				</View>

				<View>
					<Text variant="h2">{game.name}</Text>
					<Text variant="muted">
						{isEnded
							? "Game has ended. View final results below."
							: "Answer quickly to earn points."}
					</Text>
				</View>

				{/* Stats Section - Show for participants, hide or show message for non-participants on ended games */}
				{stats ? (
					<View className="gap-2">
						<Text variant="h3">Your Stats</Text>
						<View className="gap-2">
							<View className="flex-row gap-2">
								{statsTopRow.map((item) => (
									<View
										key={item.key}
										className="flex-1 flex-row items-center gap-2 rounded border-2 border-black px-3 py-2"
										style={{ backgroundColor: item.background }}
									>
										<Icon name={item.icon} size={16} color="#000" />
										<View className="flex-1">
											<Text variant="caption">{item.label}</Text>
											<Text variant="label" numberOfLines={1}>
												{item.value}
											</Text>
										</View>
									</View>
								))}
							</View>
							<View className="flex-row gap-2">
								{statsBottomRow.map((item) => (
									<View
										key={item.key}
										className="flex-1 flex-row items-center gap-2 rounded border-2 border-black px-3 py-2"
										style={{ backgroundColor: item.background }}
									>
										<Icon name={item.icon} size={16} color="#000" />
										<View className="flex-1">
											<Text variant="caption">{item.label}</Text>
											<Text variant="label" numberOfLines={1}>
												{item.value}
											</Text>
										</View>
									</View>
								))}
							</View>
						</View>
					</View>
				) : isEnded ? (
					<Card className="bg-[#f5f5f5]">
						<Card.Content>
							<Text variant="h3">You did not participate</Text>
							<Text variant="muted">
								You didn't join this game, but you can view the leaderboard below.
							</Text>
						</Card.Content>
					</Card>
				) : null}

				{/* Ended game: Show leaderboard */}
				{isEnded ? (
					<View className="gap-2">
						<Text variant="h3">Leaderboard</Text>
						<LeaderboardSection gameId={gameId} />
					</View>
				) : liveQuestion ? (
					/* Live game with question */
					<View className="gap-4">
						<Card className="bg-[#fffbeb]">
							<Card.Content>
								<Text variant="h3">{liveQuestion.text}</Text>
							</Card.Content>
						</Card>

						<View className="flex-row flex-wrap justify-between gap-3">
							{liveQuestion.options.map((option, index) => (
								<View key={`${liveQuestion._id}-${index}`} className="w-[48%]">
									<Pressable
										onPress={() => {
											setSelectedOption(index)
											handleAnswer(index)
										}}
										accessibilityRole="button"
										hitSlop={8}
										style={({ pressed }) => [
											{
												backgroundColor: "#ffffff",
												borderColor: "#000000",
												borderWidth: 2,
												borderRadius: 8,
												padding: 12,
												height: 96,
												justifyContent: "center",
												alignItems: "center",
												transform: [{ scale: pressed ? 0.98 : 1 }],
												shadowColor: "#000",
												shadowOpacity: 0.1,
												shadowOffset: { width: 0, height: 2 },
												shadowRadius: 4,
												...(isSelected(index)
													? {
															backgroundColor: "#ffdb33",
															borderColor: "#000000",
															shadowOpacity: 0.2,
														}
													: null),
											},
										]}
									>
										<Text variant="h4">{option}</Text>
									</Pressable>
								</View>
							))}
						</View>
					</View>
				) : (
					/* Live game waiting for question */
					<Card className="bg-[#f5f5f5]">
						<Card.Content>
							<Text variant="h3">Waiting for next question…</Text>
							<Text variant="muted">Hang tight while the host posts.</Text>
						</Card.Content>
					</Card>
				)}
			</View>
		</ScrollView>
	)
}
