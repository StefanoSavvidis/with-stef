import { StatusBar } from "expo-status-bar"
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { convex } from "./src/lib/convex"
import { authClient } from "./src/lib/auth-client"
import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"

export default function App() {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<View style={styles.container}>
				<StatusBar style="auto" />

				<AuthLoading>
					<View style={styles.loading}>
						<ActivityIndicator size="large" />
						<Text style={styles.loadingText}>Loading...</Text>
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
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	loading: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		marginTop: 16,
		color: "#666",
	},
})
