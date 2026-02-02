import { useQuery } from "convex/react"
import { api } from "@with-stef/backend/convex/_generated/api"
import { ScrollView, View } from "@/tw"
import { Text, Button, Card, Badge, Avatar } from "@/components/retroui"
import { authClient } from "../lib/auth-client"

export default function AccountScreen() {
	const user = useQuery(api.auth.getCurrentUser)

	const handleSignOut = async () => {
		await authClient.signOut()
	}

	return (
		<ScrollView className="flex-1 bg-white" contentContainerClassName="p-5">
			<View className="mb-6 mt-12 flex-row items-center gap-4">
				<Avatar
					size="lg"
					alt={user?.name ?? user?.email}
					fallback={user?.name?.[0] ?? user?.email?.[0]}
				/>
				<View className="flex-1">
					<Text variant="h2">Account</Text>
					<Text variant="muted">{user?.email}</Text>
				</View>
			</View>

			{user && (
				<Card className="mb-6 w-full">
					<Card.Header>
						<Card.Title>Profile</Card.Title>
						<Card.Description>Your account information</Card.Description>
					</Card.Header>
					<Card.Content className="gap-4">
						<View className="flex-row items-center justify-between">
							<Text variant="label">Name</Text>
							<Text>{user.name ?? "Not set"}</Text>
						</View>

						<View className="h-px bg-black" />

						<View className="flex-row items-center justify-between">
							<Text variant="label">Email</Text>
							<Text>{user.email}</Text>
						</View>

						<View className="h-px bg-black" />

						<View className="flex-row items-center justify-between">
							<Text variant="label">Role</Text>
							<Badge
								variant={user.role === "admin" ? "surface" : "default"}
								size="sm"
							>
								{user.role ?? "user"}
							</Badge>
						</View>
					</Card.Content>
				</Card>
			)}

			<Button
				variant="destructive"
				size="lg"
				onPress={handleSignOut}
				className="w-full"
			>
				Sign Out
			</Button>
		</ScrollView>
	)
}
