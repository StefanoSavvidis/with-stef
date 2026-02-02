import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "@/screens/HomeScreen"
import GameScreen from "@/screens/GameScreen"
import type { TriviaStackParamList } from "./types"

const Stack = createNativeStackNavigator<TriviaStackParamList>()

export default function TriviaStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Game" component={GameScreen} />
		</Stack.Navigator>
	)
}
