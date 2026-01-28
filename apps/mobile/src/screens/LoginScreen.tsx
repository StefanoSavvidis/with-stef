import { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native"
import { authClient } from "../lib/auth-client"

interface LoginScreenProps {
	onAuthSuccess?: () => void
}

export default function LoginScreen({ onAuthSuccess }: LoginScreenProps) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isSignUp, setIsSignUp] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		if (!email || !password) {
			setError("Please fill in all fields")
			return
		}

		setError(null)
		setLoading(true)

		try {
			if (isSignUp) {
				const result = await authClient.signUp.email({
					email,
					password,
					name: email.split("@")[0],
				})
				if (result.error) {
					setError(result.error.message ?? "Sign up failed")
					return
				}
			} else {
				const result = await authClient.signIn.email({
					email,
					password,
				})
				if (result.error) {
					setError(result.error.message ?? "Sign in failed")
					return
				}
			}
			onAuthSuccess?.()
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
			<Text style={styles.subtitle}>Welcome to With Stef</Text>

			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				autoComplete="email"
			/>

			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				autoComplete="password"
			/>

			{error && <Text style={styles.error}>{error}</Text>}

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text style={styles.buttonText}>
						{isSignUp ? "Sign Up" : "Sign In"}
					</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.switchButton}
				onPress={() => setIsSignUp(!isSignUp)}
			>
				<Text style={styles.switchText}>
					{isSignUp
						? "Already have an account? Sign In"
						: "Need an account? Sign Up"}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 32,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		fontSize: 16,
	},
	error: {
		color: "red",
		marginBottom: 16,
		textAlign: "center",
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 16,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	switchButton: {
		padding: 16,
		alignItems: "center",
	},
	switchText: {
		color: "#007AFF",
		fontSize: 14,
	},
})
