import { createContext, useContext, type ComponentProps } from "react"
import { Pressable, View, Text } from "@/tw"
import { cn } from "./cn"

interface ToggleGroupContextValue {
	value?: string | string[]
	onValueChange?: (value: string) => void
	type: "single" | "multiple"
	disabled?: boolean
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
	type: "single",
})

export interface ToggleGroupProps extends ComponentProps<typeof View> {
	type?: "single" | "multiple"
	value?: string | string[]
	onValueChange?: (value: string | string[]) => void
	disabled?: boolean
}

function ToggleGroupRoot({
	type = "single",
	value,
	onValueChange,
	disabled,
	className,
	...props
}: ToggleGroupProps) {
	const handleValueChange = (itemValue: string) => {
		if (type === "single") {
			onValueChange?.(itemValue)
		} else {
			const currentValues = Array.isArray(value) ? value : []
			const newValues = currentValues.includes(itemValue)
				? currentValues.filter((v) => v !== itemValue)
				: [...currentValues, itemValue]
			onValueChange?.(newValues)
		}
	}

	return (
		<ToggleGroupContext.Provider
			value={{ value, onValueChange: handleValueChange, type, disabled }}
		>
			<View
				className={cn("flex-row gap-1 rounded border-2 border-border p-1", className)}
				{...props}
			/>
		</ToggleGroupContext.Provider>
	)
}

export interface ToggleGroupItemProps
	extends Omit<ComponentProps<typeof Pressable>, "children"> {
	value: string
	children?: React.ReactNode
}

function ToggleGroupItem({
	value,
	className,
	children,
	...props
}: ToggleGroupItemProps) {
	const context = useContext(ToggleGroupContext)
	const isPressed =
		context.type === "single"
			? context.value === value
			: Array.isArray(context.value) && context.value.includes(value)
	const disabled = context.disabled || props.disabled

	return (
		<Pressable
			onPress={() => context.onValueChange?.(value)}
			disabled={disabled}
			className={cn(
				"flex-1 items-center justify-center rounded px-3 py-1.5",
				isPressed ? "bg-primary" : "bg-transparent",
				disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			{typeof children === "string" ? (
				<Text
					className={cn(
						"font-medium",
						isPressed ? "text-primary-foreground" : "text-foreground",
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

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
	Item: ToggleGroupItem,
})
