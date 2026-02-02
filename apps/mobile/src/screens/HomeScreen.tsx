import { useMutation, useQuery } from "convex/react"
import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { SectionList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { View } from "@/tw"
import { Text, Button, Card, Badge, toast } from "@/components/retroui"
import type { TriviaStackParamList } from "@/navigation/types"

type Game = {
	_id: Id<"triviaGames">
	_creationTime: number
	name: string
	status: "draft" | "live" | "ended"
	createdBy: string
	deletionTime?: number
}

type Section = {
	title: string
	subtitle: string
	data: Game[]
	isLive: boolean
}

export default function HomeScreen() {
	const navigation =
		useNavigation<NativeStackNavigationProp<TriviaStackParamList>>()
	const liveGames = useQuery(api.trivia.listLiveGames)
	const endedGames = useQuery(api.trivia.listEndedGames)
	const joinGame = useMutation(api.trivia.joinGame)

	const handleJoinGame = async (gameId: Id<"triviaGames">) => {
		try {
			await joinGame({ gameId })
			navigation.navigate("Game", { gameId })
		} catch (error) {
			toast.error("Unable to join game", "Please try again.")
		}
	}

	const handleViewResults = (gameId: Id<"triviaGames">) => {
		navigation.navigate("Game", { gameId })
	}

	const sections: Section[] = [
		{
			title: "Live Games",
			subtitle: "Join a live trivia game to play now.",
			data: liveGames ?? [],
			isLive: true,
		},
		{
			title: "Past Games",
			subtitle: "View results and leaderboards from past games.",
			data: endedGames ?? [],
			isLive: false,
		},
	]

	return (
		<View className="flex-1 bg-white">
			<SectionList
				sections={sections}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ padding: 20, paddingTop: 48 }}
				stickySectionHeadersEnabled={false}
				renderSectionHeader={({ section }) => (
					<View className="mb-2 mt-4">
						<Text variant="h2">{section.title}</Text>
						<Text variant="muted">{section.subtitle}</Text>
					</View>
				)}
				ItemSeparatorComponent={() => <View className="h-4" />}
				renderItem={({ item, section }) => (
					<Card>
						<Card.Content className="gap-3">
							<View className="flex-row items-center justify-between">
								<Text variant="h3">{item.name}</Text>
								<Badge size="sm" variant={section.isLive ? "surface" : "default"}>
									{section.isLive ? "LIVE" : "ENDED"}
								</Badge>
							</View>
							{section.isLive ? (
								<Button onPress={() => handleJoinGame(item._id)} size="lg">
									Join Game
								</Button>
							) : (
								<Button
									onPress={() => handleViewResults(item._id)}
									size="lg"
									variant="outline"
								>
									View Results
								</Button>
							)}
						</Card.Content>
					</Card>
				)}
				renderSectionFooter={({ section }) =>
					section.data.length === 0 ? (
						<Card>
							<Card.Content>
								<Text>
									{section.isLive
										? "No live games right now."
										: "No past games yet."}
								</Text>
								<Text variant="muted">
									{section.isLive
										? "Check back soon for new games."
										: "Games will appear here once they end."}
								</Text>
							</Card.Content>
						</Card>
					) : null
				}
			/>
		</View>
	)
}
