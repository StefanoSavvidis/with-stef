import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { authClient } from "../lib/auth-client"
import { Unauthenticated, Authenticated } from "convex/react"

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
		<div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
			<h1>Already logged in</h1>
			<p>You are already logged in.</p>
			<button
				type="button"
				onClick={() => navigate({ to: "/" })}
				style={{ marginRight: "1rem" }}
			>
				Go to Dashboard
			</button>
			<button type="button" onClick={() => authClient.signOut()}>
				Sign Out
			</button>
		</div>
	)
}

function LoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isSignUp, setIsSignUp] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
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
			navigate({ to: "/" })
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
			<h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
			<p style={{ color: "#666", marginBottom: "1.5rem" }}>Admin Dashboard</p>

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "1rem" }}>
					<label
						htmlFor="email"
						style={{ display: "block", marginBottom: "0.5rem" }}
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: "0.5rem" }}
					/>
				</div>

				<div style={{ marginBottom: "1rem" }}>
					<label
						htmlFor="password"
						style={{ display: "block", marginBottom: "0.5rem" }}
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
						style={{ width: "100%", padding: "0.5rem" }}
					/>
				</div>

				{error && (
					<div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
				)}

				<button
					type="submit"
					disabled={loading}
					style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
				>
					{loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
				</button>

				<button
					type="button"
					onClick={() => setIsSignUp(!isSignUp)}
					style={{
						width: "100%",
						padding: "0.5rem",
						background: "transparent",
						border: "1px solid #ccc",
					}}
				>
					{isSignUp
						? "Already have an account? Sign In"
						: "Need an account? Sign Up"}
				</button>
			</form>
		</div>
	)
}
