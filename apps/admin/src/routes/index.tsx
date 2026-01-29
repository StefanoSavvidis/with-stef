import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { api } from "@with-stef/backend/convex/_generated/api"
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react"
import { useEffect } from "react"
import { Button, Card, Text } from "@/components/retroui"
import { authClient } from "../lib/auth-client"

export const Route = createFileRoute("/")({ component: App })

function App() {
	return (
		<>
			<AuthLoading>
				<div className="p-8">
					<Text>Loading...</Text>
				</div>
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

	return (
		<div className="p-8">
			<Text>Redirecting to login...</Text>
		</div>
	)
}

function Dashboard() {
	const user = useQuery(api.auth.getCurrentUser)

	return (
		<div className="p-8">
			<Text as="h1" className="mb-6">
				Admin Dashboard
			</Text>
			{user && (
				<Card className="max-w-md">
					<Card.Header>
						<Card.Title>Welcome, {user.name ?? user.email}</Card.Title>
						<Card.Description>Role: {user.role ?? "user"}</Card.Description>
					</Card.Header>
					<Card.Content>
						<Button variant="secondary" onClick={() => authClient.signOut()}>
							Sign Out
						</Button>
					</Card.Content>
				</Card>
			)}
		</div>
	)
}
