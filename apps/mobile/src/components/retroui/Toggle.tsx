import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { Pressable, Text } from "@/tw"
import { cn } from "./cn"

const toggleVariants = cva(
	"flex-row items-center justify-center rounded border-2 border-border",
	{
		variants: {
			variant: {
				default: "",
				outline: "bg-transparent",
			},
			size: {
				sm: "px-2 py-1",
				md: "px-3 py-1.5",
				lg: "px-4 py-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
)

export interface ToggleProps
	extends Omit<ComponentProps<typeof Pressable>, "children">,
		VariantProps<typeof toggleVariants> {
	pressed?: boolean
	onPressedChange?: (pressed: boolean) => void
	children?: React.ReactNode
}

export function Toggle({
	pressed = false,
	onPressedChange,
	size = "md",
	variant = "default",
	className,
	disabled,
	children,
	...props
}: ToggleProps) {
	return (
		<Pressable
			onPress={() => onPressedChange?.(!pressed)}
			disabled={disabled}
			className={cn(
				toggleVariants({ variant, size }),
				pressed ? "bg-primary" : "bg-muted",
				disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			{typeof children === "string" ? (
				<Text
					className={cn(
						"font-medium",
						pressed ? "text-primary-foreground" : "text-foreground",
					)}
				>
					{children}
				</Text>
			) : (
				children
			)}
		</Pressable>
	)
}
