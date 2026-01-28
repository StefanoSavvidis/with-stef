import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
	Authenticated,
	Unauthenticated,
	AuthLoading,
	useQuery,
} from "convex/react"
import { api } from "@with-stef/backend/convex/_generated/api"
import { authClient } from "../lib/auth-client"
import { useEffect } from "react"

export const Route = createFileRoute("/")({ component: App })

function App() {
	return (
		<>
			<AuthLoading>
				<div style={{ padding: "2rem" }}>Loading...</div>
			</AuthLoading>
			<Unauthenticated>
				<RedirectToLogin />
			</Unauthenticated>
			<Authenticated>
				<Dashboard />
			</Authenticated>
		</>
	)
}

function RedirectToLogin() {
	const navigate = useNavigate()

	useEffect(() => {
		navigate({ to: "/login" })
	}, [navigate])

	return <div style={{ padding: "2rem" }}>Redirecting to login...</div>
}

function Dashboard() {
	const user = useQuery(api.auth.getCurrentUser)

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Admin Dashboard</h1>
			{user && (
				<div>
					<p>Welcome, {user.name ?? user.email}</p>
					<p>Role: {user.role ?? "user"}</p>
					<button
						type="button"
						onClick={() => authClient.signOut()}
						style={{ marginTop: "1rem" }}
					>
						Sign Out
					</button>
				</div>
			)}
		</div>
	)
}
