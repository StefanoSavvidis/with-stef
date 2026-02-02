import RNSlider from "@react-native-community/slider"
import { View } from "@/tw"
import { cn } from "./cn"

export interface SliderProps {
	className?: string
	value?: number
	minimumValue?: number
	maximumValue?: number
	step?: number
	disabled?: boolean
	onValueChange?: (value: number) => void
	onSlidingComplete?: (value: number) => void
}

export function Slider({
	className,
	value,
	minimumValue = 0,
	maximumValue = 100,
	step,
	disabled,
	onValueChange,
	onSlidingComplete,
}: SliderProps) {
	return (
		<View className={cn("w-full", className)}>
			<RNSlider
				value={value}
				minimumValue={minimumValue}
				maximumValue={maximumValue}
				step={step}
				disabled={disabled}
				onValueChange={onValueChange}
				onSlidingComplete={onSlidingComplete}
				minimumTrackTintColor="#ffdb33"
				maximumTrackTintColor="#f5f5f5"
				thumbTintColor="#000"
			/>
		</View>
	)
}
