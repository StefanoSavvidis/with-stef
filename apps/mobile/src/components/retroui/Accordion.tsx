import { createContext, useContext, useState, type ComponentProps } from "react"
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	runOnJS,
} from "react-native-reanimated"
import { Pressable, View, Text as TWText } from "@/tw"
import { cn } from "./cn"
import { Text } from "./Text"
import { Icon } from "./Icon"

interface AccordionContextValue {
	expandedItems: string[]
	toggleItem: (value: string) => void
	type: "single" | "multiple"
}

const AccordionContext = createContext<AccordionContextValue>({
	expandedItems: [],
	toggleItem: () => {},
	type: "single",
})

export interface AccordionProps extends ComponentProps<typeof View> {
	type?: "single" | "multiple"
	defaultValue?: string | string[]
	children?: React.ReactNode
}

function AccordionRoot({
	type = "single",
	defaultValue,
	className,
	children,
	...props
}: AccordionProps) {
	const [expandedItems, setExpandedItems] = useState<string[]>(() => {
		if (!defaultValue) return []
		return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
	})

	const toggleItem = (value: string) => {
		setExpandedItems((prev) => {
			if (type === "single") {
				return prev.includes(value) ? [] : [value]
			}
			return prev.includes(value)
				? prev.filter((v) => v !== value)
				: [...prev, value]
		})
	}

	return (
		<AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
			<View
				className={cn("rounded border-2 border-border", className)}
				{...props}
			>
				{children}
			</View>
		</AccordionContext.Provider>
	)
}

interface AccordionItemContextValue {
	value: string
	isExpanded: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
	value: "",
	isExpanded: false,
})

export interface AccordionItemProps extends ComponentProps<typeof View> {
	value: string
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
	const { expandedItems } = useContext(AccordionContext)
	const isExpanded = expandedItems.includes(value)

	return (
		<AccordionItemContext.Provider value={{ value, isExpanded }}>
			<View
				className={cn("border-b border-border last:border-b-0", className)}
				{...props}
			>
				{children}
			</View>
		</AccordionItemContext.Provider>
	)
}

export interface AccordionTriggerProps extends Omit<ComponentProps<typeof Pressable>, "children"> {
	children?: React.ReactNode
}

function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
	const { toggleItem } = useContext(AccordionContext)
	const { value, isExpanded } = useContext(AccordionItemContext)

	const rotation = useSharedValue(isExpanded ? 180 : 0)

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}))

	const handlePress = () => {
		rotation.value = withTiming(isExpanded ? 0 : 180, { duration: 200 })
		toggleItem(value)
	}

	return (
		<Pressable
			onPress={handlePress}
			className={cn(
				"flex-row items-center justify-between p-4",
				className,
			)}
			{...props}
		>
			{typeof children === "string" ? (
				<Text variant="h5">{children}</Text>
			) : (
				children
			)}
			<Animated.View style={animatedStyle}>
				<Icon name="chevron-down" size={20} color="#000" />
			</Animated.View>
		</Pressable>
	)
}

export interface AccordionContentProps extends ComponentProps<typeof View> {}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
	const { isExpanded } = useContext(AccordionItemContext)
	const height = useSharedValue(isExpanded ? 1 : 0)

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: height.value,
		maxHeight: height.value * 500,
	}))

	if (isExpanded) {
		height.value = withTiming(1, { duration: 200 })
	} else {
		height.value = withTiming(0, { duration: 200 })
	}

	return (
		<Animated.View style={animatedStyle}>
			<View className={cn("px-4 pb-4", className)} {...props}>
				{children}
			</View>
		</Animated.View>
	)
}

export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
})
