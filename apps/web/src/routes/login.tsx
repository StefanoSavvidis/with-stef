import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Authenticated, Unauthenticated } from "convex/react"
import { useId, useState } from "react"
import { Button, Card, Input } from "@/components/retroui"
import { authClient } from "../lib/auth-client"

export const Route = createFileRoute("/login")({
	component: LoginPage,
})

function LoginPage() {
	return (
		<>
			<Authenticated>
				<AlreadyLoggedIn />
			</Authenticated>
			<Unauthenticated>
				<LoginForm />
			</Unauthenticated>
		</>
	)
}

function AlreadyLoggedIn() {
	const navigate = useNavigate()

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<Card className="w-full max-w-md">
				<Card.Header>
					<Card.Title>Already logged in</Card.Title>
					<Card.Description>You are already logged in.</Card.Description>
				</Card.Header>
				<Card.Content className="flex gap-3">
					<Button onClick={() => navigate({ to: "/" })}>Go to Dashboard</Button>
					<Button variant="secondary" onClick={() => authClient.signOut()}>
						Sign Out
					</Button>
				</Card.Content>
			</Card>
		</div>
	)
}

function LoginForm() {
	const [email, setEmail] = useState("")
	const [username, setUsername] = useState("")
	const [identifier, setIdentifier] = useState("")
	const [password, setPassword] = useState("")
	const [isSignUp, setIsSignUp] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const emailId = useId()
	const usernameId = useId()
	const identifierId = useId()
	const passwordId = useId()

	const toggleMode = () => {
		setIsSignUp(!isSignUp)
		setEmail("")
		setUsername("")
		setIdentifier("")
		setPassword("")
		setError(null)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
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
			navigate({ to: "/" })
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<Card className="w-full max-w-md">
				<Card.Header>
					<Card.Title>{isSignUp ? "Sign Up" : "Sign In"}</Card.Title>
					<Card.Description>With Stef</Card.Description>
				</Card.Header>
				<Card.Content>
					<form onSubmit={handleSubmit} className="space-y-4">
						{isSignUp ? (
							<>
								<div>
									<label htmlFor={emailId} className="block mb-2 font-medium">
										Email
									</label>
									<Input
										id={emailId}
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										placeholder="you@example.com"
									/>
								</div>

								<div>
									<label
										htmlFor={usernameId}
										className="block mb-2 font-medium"
									>
										Username
									</label>
									<Input
										id={usernameId}
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
										minLength={3}
										maxLength={30}
										placeholder="Choose a username"
									/>
								</div>
							</>
						) : (
							<div>
								<label
									htmlFor={identifierId}
									className="block mb-2 font-medium"
								>
									Email or Username
								</label>
								<Input
									id={identifierId}
									type="text"
									value={identifier}
									onChange={(e) => setIdentifier(e.target.value)}
									required
									placeholder="you@example.com or username"
								/>
							</div>
						)}

						<div>
							<label htmlFor={passwordId} className="block mb-2 font-medium">
								Password
							</label>
							<Input
								id={passwordId}
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
								placeholder="Enter password"
							/>
						</div>

						{error && (
							<div className="p-3 border-2 border-destructive bg-destructive/10 text-destructive rounded">
								{error}
							</div>
						)}

						<Button
							type="submit"
							disabled={loading}
							className="w-full justify-center"
						>
							{loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={toggleMode}
							className="w-full justify-center"
						>
							{isSignUp
								? "Already have an account? Sign In"
								: "Need an account? Sign Up"}
						</Button>
					</form>
				</Card.Content>
			</Card>
		</div>
	)
}
