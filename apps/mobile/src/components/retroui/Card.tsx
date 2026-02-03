import type { ComponentProps } from "react"
import { StyleSheet } from "react-native"
import { View, Text as TWText } from "@/tw"
import { cn } from "./cn"
import { Text } from "./Text"
import { HardShadow } from "./HardShadow"

const styles = StyleSheet.create({
	description: { fontSize: 14, color: "#6b7280" },
})

export interface CardProps extends ComponentProps<typeof View> {}

function CardRoot({ className, children, ...props }: CardProps) {
	return (
		<HardShadow
			offset={4}
			radius={4}
			containerClassName={className}
			className={cn("rounded border-2 border-black bg-white", className)}
			{...props}
		>
			{children}
		</HardShadow>
	)
}

function CardHeader({ className, ...props }: CardProps) {
	return <View className={cn("flex-col p-4", className)} {...props} />
}

function CardTitle({ className, ...props }: ComponentProps<typeof TWText>) {
	return <Text variant="h3" className={cn("mb-2", className)} {...props} />
}

function CardDescription({
	className,
	style,
	...props
}: ComponentProps<typeof TWText>) {
	return (
		<TWText
			className={cn("text-sm text-gray-500", className)}
			style={[styles.description, style]}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: CardProps) {
	return <View className={cn("p-4", className)} {...props} />
}

function CardFooter({ className, ...props }: CardProps) {
	return (
		<View
			className={cn("flex-row items-center border-t border-black p-4", className)}
			{...props}
		/>
	)
}

export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
})
