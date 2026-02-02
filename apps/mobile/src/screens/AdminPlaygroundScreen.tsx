import { ScrollView, View } from "@/tw"
import { Text, Card, Button, Badge, Avatar } from "@/components/retroui"

export default function AdminPlaygroundScreen() {
	return (
		<ScrollView className="flex-1 bg-white" contentContainerClassName="p-5">
			<View className="mt-12 gap-6">
				<View className="gap-3">
					<Text variant="h2">Components</Text>
					<Card>
						<Card.Content className="gap-4">
							<View className="flex-row items-center gap-3">
								<Avatar size="md" alt="Admin" fallback="A" />
								<View>
									<Text variant="h3">Admin Preview</Text>
									<Text variant="muted">Retro UI samples</Text>
								</View>
							</View>
							<View className="flex-row items-center gap-2">
								<Badge size="sm">LIVE</Badge>
								<Badge size="sm" variant="surface">
									STAFF
								</Badge>
							</View>
							<View className="flex-row gap-3">
								<Button size="sm">Primary</Button>
								<Button variant="outline" size="sm">
									Outline
								</Button>
								<Button variant="secondary" size="sm">
									Secondary
								</Button>
							</View>
						</Card.Content>
					</Card>
				</View>

				<View className="gap-3">
					<Text variant="h2">Screens</Text>
					<Card>
						<Card.Content className="gap-3">
							<Text variant="h3">Game Screen Mock</Text>
							<Text variant="muted">
								Static preview of the trivia game experience.
							</Text>
							<View className="rounded border-2 border-black bg-[#fffbeb] p-3">
								<Text variant="label">Q: What is 8 x 9?</Text>
								<View className="mt-3 flex-row flex-wrap justify-between gap-2">
									<View className="w-[48%] rounded border-2 border-black bg-white p-2">
										<Text>64</Text>
									</View>
									<View className="w-[48%] rounded border-2 border-black bg-white p-2">
										<Text>72</Text>
									</View>
									<View className="w-[48%] rounded border-2 border-black bg-white p-2">
										<Text>81</Text>
									</View>
									<View className="w-[48%] rounded border-2 border-black bg-white p-2">
										<Text>56</Text>
									</View>
								</View>
							</View>
						</Card.Content>
					</Card>
				</View>
			</View>
		</ScrollView>
	)
}
