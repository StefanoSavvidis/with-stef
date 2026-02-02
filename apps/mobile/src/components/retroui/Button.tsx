import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { ActivityIndicator, StyleSheet, type TextStyle } from "react-native"
import { Pressable, Text } from "@/tw"
import { cn } from "./cn"

export const buttonVariants = cva(
	"flex-row items-center justify-center rounded border-2 border-black",
	{
		variants: {
			variant: {
				default: "bg-[#ffdb33]",
				secondary: "bg-black",
				outline: "bg-transparent",
				link: "bg-transparent border-0",
				ghost: "bg-transparent border-0",
				destructive: "bg-[#e63946]",
			},
			size: {
				sm: "px-3 py-1",
				md: "px-4 py-2",
				lg: "px-6 py-3",
				icon: "p-2",
			},
		},
		defaultVariants: {
			size: "md",
			variant: "default",
		},
	},
)

// Explicit RN styles for button text
const textSizeStyles = StyleSheet.create({
	sm: { fontSize: 14 },
	md: { fontSize: 16 },
	lg: { fontSize: 18 },
	icon: { fontSize: 16 },
})

const textVariantStyles: Record<string, TextStyle> = {
	default: { color: "#000", fontWeight: "600" },
	secondary: { color: "#fff", fontWeight: "600" },
	outline: { color: "#000", fontWeight: "600" },
	link: { color: "#000", fontWeight: "600", textDecorationLine: "underline" },
	ghost: { color: "#000", fontWeight: "600" },
	destructive: { color: "#fff", fontWeight: "600" },
}

export interface ButtonProps
	extends Omit<ComponentProps<typeof Pressable>, "children">,
		VariantProps<typeof buttonVariants> {
	children?: React.ReactNode
	loading?: boolean
	disabled?: boolean
}

export function Button({
	children,
	size = "md",
	className,
	variant = "default",
	loading = false,
	disabled = false,
	...props
}: ButtonProps) {
	const isDisabled = disabled || loading
	const textStyle = [
		textSizeStyles[size ?? "md"],
		textVariantStyles[variant ?? "default"],
	]

	return (
		<Pressable
			className={cn(
				buttonVariants({ variant, size }),
				isDisabled && "opacity-50",
				className,
			)}
			disabled={isDisabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator
					size="small"
					color={variant === "default" ? "#000" : "#fff"}
				/>
			) : typeof children === "string" ? (
				<Text style={textStyle}>{children}</Text>
			) : (
				children
			)}
		</Pressable>
	)
}
