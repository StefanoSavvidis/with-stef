import { useMutation, useQuery } from "convex/react"
import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { View } from "@/tw"
import { Text, Button, Card, Badge, toast } from "@/components/retroui"
import type { TriviaStackParamList } from "@/navigation/types"

export default function HomeScreen() {
	const navigation =
		useNavigation<NativeStackNavigationProp<TriviaStackParamList>>()
	const liveGames = useQuery(api.trivia.listLiveGames)
	const joinGame = useMutation(api.trivia.joinGame)

	const handleJoinGame = async (gameId: Id<"triviaGames">) => {
		try {
			await joinGame({ gameId })
			navigation.navigate("Game", { gameId })
		} catch (error) {
			toast.error("Unable to join game", "Please try again.")
		}
	}

	return (
		<View className="flex-1 bg-white">
			<FlatList
				data={liveGames ?? []}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ padding: 20, paddingTop: 48 }}
				ListHeaderComponent={
					<View className="mb-2">
						<Text variant="h2">Live Games</Text>
						<Text variant="muted">Join a live trivia game to play now.</Text>
					</View>
				}
				ItemSeparatorComponent={() => <View className="h-4" />}
				renderItem={({ item }) => (
					<Card>
						<Card.Content className="gap-3">
							<View className="flex-row items-center justify-between">
								<Text variant="h3">{item.name}</Text>
								<Badge size="sm">LIVE</Badge>
							</View>
							<Button onPress={() => handleJoinGame(item._id)} size="lg">
								Join Game
							</Button>
						</Card.Content>
					</Card>
				)}
				ListEmptyComponent={
					<Card>
						<Card.Content>
							<Text>No live games right now.</Text>
							<Text variant="muted">Check back soon for new games.</Text>
						</Card.Content>
					</Card>
				}
			/>
		</View>
	)
}
