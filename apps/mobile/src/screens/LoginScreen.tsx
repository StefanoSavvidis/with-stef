import { useState } from "react"
import { View } from "@/tw"
import {
	Text,
	Input,
	Label,
	Button,
	Card,
	Alert,
} from "@/components/retroui"
import { authClient } from "../lib/auth-client"

interface LoginScreenProps {
	onAuthSuccess?: () => void
}

export default function LoginScreen({ onAuthSuccess }: LoginScreenProps) {
	const [email, setEmail] = useState("")
	const [username, setUsername] = useState("")
	const [identifier, setIdentifier] = useState("")
	const [password, setPassword] = useState("")
	const [isSignUp, setIsSignUp] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const toggleMode = () => {
		setIsSignUp(!isSignUp)
		setEmail("")
		setUsername("")
		setIdentifier("")
		setPassword("")
		setError(null)
	}

	const handleSubmit = async () => {
		if (isSignUp && (!email || !username || !password)) {
			setError("Please fill in all fields")
			return
		}
		if (!isSignUp && (!identifier || !password)) {
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
					username,
					name: email.split("@")[0],
				})
				if (result.error) {
					setError(result.error.message ?? "Sign up failed")
					return
				}
			} else {
				const isEmail = identifier.includes("@")
				if (isEmail) {
					const result = await authClient.signIn.email({
						email: identifier,
						password,
					})
					if (result.error) {
						setError(result.error.message ?? "Sign in failed")
						return
					}
				} else {
					const result = await authClient.signIn.username({
						username: identifier,
						password,
					})
					if (result.error) {
						setError(result.error.message ?? "Sign in failed")
						return
					}
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
		<View className="flex-1 justify-center bg-white p-5">
			<View className="mb-8">
				<Text variant="h1" className="mb-2 text-center">
					{isSignUp ? "Sign Up" : "Sign In"}
				</Text>
				<Text variant="muted" className="text-center">
					Welcome to With Stef
				</Text>
			</View>

			<Card className="mb-6 w-full">
				<Card.Content className="gap-4">
					{isSignUp ? (
						<>
							<View>
								<Label>Email</Label>
								<Input
									placeholder="Enter your email"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoComplete="email"
								/>
							</View>

							<View>
								<Label>Username</Label>
								<Input
									placeholder="Choose a username"
									value={username}
									onChangeText={setUsername}
									autoCapitalize="none"
									autoComplete="username"
								/>
							</View>
						</>
					) : (
						<View>
							<Label>Email or Username</Label>
							<Input
								placeholder="Enter your email or username"
								value={identifier}
								onChangeText={setIdentifier}
								autoCapitalize="none"
								autoComplete="username"
							/>
						</View>
					)}

					<View>
						<Label>Password</Label>
						<Input
							placeholder="Enter your password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							autoComplete="password"
						/>
					</View>

					{error && (
						<Alert status="error">
							<View className="flex-row items-center gap-2">
								<Alert.Icon status="error" />
								<Alert.Title status="error">{error}</Alert.Title>
							</View>
						</Alert>
					)}

					<Button
						variant="default"
						size="lg"
						onPress={handleSubmit}
						loading={loading}
						className="mt-2 w-full"
					>
						{isSignUp ? "Sign Up" : "Sign In"}
					</Button>
				</Card.Content>
			</Card>

			<Button
				variant="link"
				onPress={toggleMode}
				className="self-center"
			>
				{isSignUp
					? "Already have an account? Sign In"
					: "Need an account? Sign Up"}
			</Button>
		</View>
	)
}
