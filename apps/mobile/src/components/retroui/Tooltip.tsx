import { useState, type ComponentProps } from "react"
import { Pressable, View, Text } from "@/tw"
import { cn } from "./cn"

export interface TooltipProps {
	children: React.ReactNode
	content: string
}

export function Tooltip({ children, content }: TooltipProps) {
	const [visible, setVisible] = useState(false)

	return (
		<View className="relative">
			<Pressable
				onPressIn={() => setVisible(true)}
				onPressOut={() => setVisible(false)}
			>
				{children}
			</Pressable>
			{visible && (
				<View className="absolute -top-10 left-0 z-50 rounded border-2 border-border bg-foreground px-2 py-1">
					<Text className="text-xs text-background">{content}</Text>
				</View>
			)}
		</View>
	)
}
