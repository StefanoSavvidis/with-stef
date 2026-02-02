import type { ComponentProps } from "react"
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated"
import { Pressable, View } from "@/tw"
import { cn } from "./cn"
import { useEffect } from "react"

const AnimatedView = Animated.createAnimatedComponent(View)

export interface SwitchProps
	extends Omit<ComponentProps<typeof Pressable>, "children"> {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function Switch({
	checked = false,
	onCheckedChange,
	disabled,
	className,
	...props
}: SwitchProps) {
	const translateX = useSharedValue(checked ? 20 : 0)

	useEffect(() => {
		translateX.value = withTiming(checked ? 20 : 0, { duration: 150 })
	}, [checked, translateX])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}))

	return (
		<Pressable
			onPress={() => onCheckedChange?.(!checked)}
			disabled={disabled}
			className={cn(
				"h-6 w-11 flex-row items-center rounded-none border-2 border-border px-0.5",
				checked ? "bg-primary" : "bg-muted",
				disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<AnimatedView
				style={animatedStyle}
				className={cn(
					"h-4 w-4 border-2 border-border",
					checked ? "bg-background" : "bg-primary",
				)}
			/>
		</Pressable>
	)
}
