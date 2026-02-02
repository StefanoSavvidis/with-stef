import "react-native-gesture-handler"
import "./src/global.css"
import { StatusBar } from "expo-status-bar"
import { ActivityIndicator, Text as RNText, TextInput as RNTextInput } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context"
import { Uniwind } from "uniwind"
import { useFonts } from "expo-font"
import {
	ArchivoBlack_400Regular,
} from "@expo-google-fonts/archivo-black"
import {
	SpaceGrotesk_300Light,
	SpaceGrotesk_400Regular,
	SpaceGrotesk_500Medium,
	SpaceGrotesk_600SemiBold,
	SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { convex } from "./src/lib/convex"
import { authClient } from "./src/lib/auth-client"
import { View } from "./src/tw"
import { Text } from "@/components/retroui"
import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "./src/screens/LoginScreen"
import RootTabs from "./src/navigation/RootTabs"
import { fontSansRegular } from "./src/lib/fonts"

function SafeAreaListener({ children }: { children: React.ReactNode }) {
	const insets = useSafeAreaInsets()
	Uniwind.updateInsets(insets)
	return <>{children}</>
}

export default function App() {
	const [fontsLoaded] = useFonts({
		ArchivoBlack_400Regular,
		SpaceGrotesk_300Light,
		SpaceGrotesk_400Regular,
		SpaceGrotesk_500Medium,
		SpaceGrotesk_600SemiBold,
		SpaceGrotesk_700Bold,
	})

	if (fontsLoaded) {
		const TextAny = RNText as any
		TextAny.defaultProps = TextAny.defaultProps || {}
		TextAny.defaultProps.style = [
			TextAny.defaultProps.style,
			{ fontFamily: fontSansRegular },
		]
		const TextInputAny = RNTextInput as any
		TextInputAny.defaultProps = TextInputAny.defaultProps || {}
		TextInputAny.defaultProps.style = [
			TextInputAny.defaultProps.style,
			{ fontFamily: fontSansRegular },
		]
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<SafeAreaListener>
					<ConvexBetterAuthProvider client={convex} authClient={authClient}>
						<View className="flex-1 bg-white">
							<StatusBar style="auto" />

							{!fontsLoaded ? (
								<View className="flex-1 items-center justify-center">
									<ActivityIndicator size="large" color="#ffdb33" />
									<Text variant="muted" className="mt-4">
										Loading fonts...
									</Text>
								</View>
							) : null}

							{fontsLoaded ? (
								<>
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
										<NavigationContainer>
											<RootTabs />
										</NavigationContainer>
									</Authenticated>
								</>
							) : null}
						</View>
					</ConvexBetterAuthProvider>
				</SafeAreaListener>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
