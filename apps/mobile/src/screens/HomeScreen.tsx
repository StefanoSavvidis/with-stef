import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useQuery } from "convex/react"
import { api } from "@with-stef/backend/convex/_generated/api"
import { authClient } from "../lib/auth-client"

export default function HomeScreen() {
	const user = useQuery(api.auth.getCurrentUser)

	const handleSignOut = async () => {
		await authClient.signOut()
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome!</Text>

			{user && (
				<View style={styles.userInfo}>
					<Text style={styles.label}>Name</Text>
					<Text style={styles.value}>{user.name ?? "Not set"}</Text>

					<Text style={styles.label}>Email</Text>
					<Text style={styles.value}>{user.email}</Text>

					<Text style={styles.label}>Role</Text>
					<Text style={styles.value}>{user.role ?? "user"}</Text>
				</View>
			)}

			<TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
				<Text style={styles.signOutText}>Sign Out</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 24,
		marginTop: 60,
	},
	userInfo: {
		backgroundColor: "#f5f5f5",
		padding: 16,
		borderRadius: 8,
		marginBottom: 24,
	},
	label: {
		fontSize: 12,
		color: "#666",
		marginBottom: 4,
		textTransform: "uppercase",
	},
	value: {
		fontSize: 16,
		marginBottom: 16,
	},
	signOutButton: {
		backgroundColor: "#ff3b30",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	signOutText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
})
