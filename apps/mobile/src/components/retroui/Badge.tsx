import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { StyleSheet, type TextStyle } from "react-native"
import { View, Text } from "@/tw"
import { cn } from "./cn"

const badgeVariants = cva("rounded", {
	variants: {
		variant: {
			default: "bg-gray-100",
			outline: "border-2 border-black bg-transparent",
			solid: "bg-black",
			surface: "border-2 border-black bg-[#ffdb33]",
		},
		size: {
			sm: "px-2 py-0.5",
			md: "px-2.5 py-1",
			lg: "px-3 py-1.5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
})

// Explicit RN styles for badge text
const textSizeStyles = StyleSheet.create({
	sm: { fontSize: 12 },
	md: { fontSize: 14 },
	lg: { fontSize: 16 },
})

const textVariantStyles: Record<string, TextStyle> = {
	default: { color: "#4b5563", fontWeight: "600" },
	outline: { color: "#000", fontWeight: "600" },
	solid: { color: "#fff", fontWeight: "600" },
	surface: { color: "#000", fontWeight: "600" },
}

export interface BadgeProps
	extends ComponentProps<typeof View>,
		VariantProps<typeof badgeVariants> {
	children: React.ReactNode
}

export function Badge({
	children,
	size = "md",
	variant = "default",
	className,
	...props
}: BadgeProps) {
	const textStyle = [
		textSizeStyles[size ?? "md"],
		textVariantStyles[variant ?? "default"],
	]

	return (
		<View className={cn(badgeVariants({ variant, size }), className)} {...props}>
			{typeof children === "string" ? (
				<Text style={textStyle}>{children}</Text>
			) : (
				children
			)}
		</View>
	)
}
