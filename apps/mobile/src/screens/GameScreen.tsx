import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Pressable } from "react-native"
import { api } from "@with-stef/backend/convex/_generated/api"
import { ScrollView, View } from "@/tw"
import { Button, Card, Text, Badge, toast, Icon } from "@/components/retroui"
import type { TriviaStackParamList } from "@/navigation/types"

export default function GameScreen() {
	const navigation =
		useNavigation<NativeStackNavigationProp<TriviaStackParamList>>()
	const route = useRoute<RouteProp<TriviaStackParamList, "Game">>()
	const { gameId } = route.params

	const game = useQuery(api.trivia.getGame, { gameId })
	const stats = useQuery(api.trivia.getMyStats, { gameId })
	const submitAnswer = useMutation(api.trivia.submitAnswer)

	const liveQuestion =
		game?.questions?.find((question) => question?.status === "live") ?? null

	const totalWrong =
		stats && stats.totalAnswered
			? stats.totalAnswered - stats.totalCorrect
			: 0

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
			value: totalWrong,
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

	return (
		<ScrollView className="flex-1 bg-white" contentContainerClassName="p-5">
			<View className="mt-10 gap-5" key={resetKey}>
				<View className="flex-row items-center justify-between">
					<Button variant="outline" size="sm" onPress={() => navigation.goBack()}>
						Back
					</Button>
					<Badge size="sm" variant="surface">
						LIVE
					</Badge>
				</View>

				<View>
					<Text variant="h2">{game?.name ?? "Live Game"}</Text>
					<Text variant="muted">Answer quickly to earn points.</Text>
				</View>

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

				{liveQuestion ? (
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
