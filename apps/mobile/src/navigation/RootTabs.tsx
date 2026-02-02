import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useQuery } from "convex/react"
import { api } from "@with-stef/backend/convex/_generated/api"
import { Icon, Text } from "@/components/retroui"
import TriviaStack from "./TriviaStack"
import AccountScreen from "@/screens/AccountScreen"
import AdminPlaygroundScreen from "@/screens/AdminPlaygroundScreen"
import type { RootTabParamList } from "./types"

const Tab = createBottomTabNavigator<RootTabParamList>()

const tabBarIconMap: Record<keyof RootTabParamList, string> = {
	Trivia: "grid",
	Account: "user",
	Admin: "settings",
}

export default function RootTabs() {
	const user = useQuery(api.auth.getCurrentUser)
	const isAdmin = user?.role === "admin"

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					height: 88,
					paddingTop: 12,
					paddingBottom: 14,
					borderTopWidth: 2,
					borderTopColor: "#000000",
					backgroundColor: "#ffffff",
				},
				tabBarItemStyle: {
					paddingTop: 2,
					paddingBottom: 4,
				},
				tabBarIconStyle: {
					marginTop: 4,
				},
				tabBarLabel: ({ focused }) => {
					const color = focused ? "#000000" : "#6b7280"
					return (
						<Text
							className={focused ? "text-black" : "text-gray-500"}
							numberOfLines={1}
							style={{ fontSize: 12, marginTop: 4 }}
						>
							{route.name}
						</Text>
					)
				},
				tabBarIcon: ({ focused }) => {
					const color = focused ? "#000000" : "#6b7280"
					return <Icon name={tabBarIconMap[route.name]} size={22} color={color} />
				},
			})}
		>
			<Tab.Screen name="Trivia" component={TriviaStack} />
			<Tab.Screen name="Account" component={AccountScreen} />
			{isAdmin ? (
				<Tab.Screen name="Admin" component={AdminPlaygroundScreen} />
			) : null}
		</Tab.Navigator>
	)
}
