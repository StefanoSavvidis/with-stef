import "./src/global.css"
import { StatusBar } from "expo-status-bar"
import { ActivityIndicator } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context"
import { Uniwind } from "uniwind"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { convex } from "./src/lib/convex"
import { authClient } from "./src/lib/auth-client"
import { View } from "./src/tw"
import { Text } from "@/components/retroui"
import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"

function SafeAreaListener({ children }: { children: React.ReactNode }) {
	const insets = useSafeAreaInsets()
	Uniwind.updateInsets(insets)
	return <>{children}</>
}

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<SafeAreaListener>
					<ConvexBetterAuthProvider client={convex} authClient={authClient}>
						<View className="flex-1 bg-white">
							<StatusBar style="auto" />

							<AuthLoading>
								<View className="flex-1 items-center justify-center">
									<ActivityIndicator size="large" color="#ffdb33" />
									<Text variant="muted" className="mt-4">
										Loading...
									</Text>
								</View>
							</AuthLoading>

							<Unauthenticated>
								<LoginScreen />
							</Unauthenticated>

							<Authenticated>
								<HomeScreen />
							</Authenticated>
						</View>
					</ConvexBetterAuthProvider>
				</SafeAreaListener>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
