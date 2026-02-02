import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { Pressable, View } from "@/tw"
import { cn } from "./cn"
import { Icon } from "./Icon"

const checkboxVariants = cva(
	"items-center justify-center rounded border-2 border-border",
	{
		variants: {
			variant: {
				default: "",
				solid: "",
			},
			size: {
				sm: "h-4 w-4",
				md: "h-5 w-5",
				lg: "h-6 w-6",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
)

const checkedVariants = cva("", {
	variants: {
		variant: {
			default: "bg-primary",
			solid: "bg-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

export interface CheckboxProps
	extends Omit<ComponentProps<typeof Pressable>, "children">,
		VariantProps<typeof checkboxVariants> {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({
	checked = false,
	onCheckedChange,
	size = "md",
	variant = "default",
	className,
	disabled,
	...props
}: CheckboxProps) {
	const sizeKey = size || "md"
	const iconSize = { sm: 12, md: 16, lg: 20 }[sizeKey]
	const iconColor = variant === "solid" ? "#fff" : "#000"

	return (
		<Pressable
			onPress={() => onCheckedChange?.(!checked)}
			disabled={disabled}
			className={cn(
				checkboxVariants({ variant, size }),
				checked && checkedVariants({ variant }),
				disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			{checked && <Icon name="check" size={iconSize} color={iconColor} />}
		</Pressable>
	)
}
