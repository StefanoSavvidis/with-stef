import { createContext, useContext, type ComponentProps } from "react"
import { Pressable, View } from "@/tw"
import { cn } from "./cn"

interface RadioGroupContextValue {
	value?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue>({})

export interface RadioGroupProps extends ComponentProps<typeof View> {
	value?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
}

function RadioGroup({
	value,
	onValueChange,
	disabled,
	className,
	...props
}: RadioGroupProps) {
	return (
		<RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
			<View className={cn("gap-2", className)} {...props} />
		</RadioGroupContext.Provider>
	)
}

export interface RadioItemProps
	extends Omit<ComponentProps<typeof Pressable>, "children"> {
	value: string
	children?: React.ReactNode
}

function RadioItem({ value, className, children, ...props }: RadioItemProps) {
	const context = useContext(RadioGroupContext)
	const checked = context.value === value
	const disabled = context.disabled || props.disabled

	return (
		<Pressable
			onPress={() => context.onValueChange?.(value)}
			disabled={disabled}
			className={cn("flex-row items-center gap-2", className)}
			{...props}
		>
			<View
				className={cn(
					"h-5 w-5 items-center justify-center rounded-full border-2 border-border",
					disabled && "opacity-50",
				)}
			>
				{checked && (
					<View className="h-2.5 w-2.5 rounded-full bg-primary" />
				)}
			</View>
			{children}
		</Pressable>
	)
}

export const Radio = Object.assign(RadioGroup, {
	Item: RadioItem,
})
