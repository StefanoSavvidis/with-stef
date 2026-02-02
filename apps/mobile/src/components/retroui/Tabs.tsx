import {
	createContext,
	useContext,
	useState,
	type ComponentProps,
} from "react"
import { Pressable, View, Text } from "@/tw"
import { cn } from "./cn"

interface TabsContextValue {
	value: string
	onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>({
	value: "",
	onValueChange: () => {},
})

export interface TabsProps extends ComponentProps<typeof View> {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
}

function TabsRoot({
	value: controlledValue,
	defaultValue = "",
	onValueChange,
	className,
	children,
	...props
}: TabsProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
	const value = controlledValue ?? uncontrolledValue

	const handleValueChange = (newValue: string) => {
		setUncontrolledValue(newValue)
		onValueChange?.(newValue)
	}

	return (
		<TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
			<View className={cn(className)} {...props}>
				{children}
			</View>
		</TabsContext.Provider>
	)
}

export interface TabsListProps extends ComponentProps<typeof View> {}

function TabsList({ className, children, ...props }: TabsListProps) {
	return (
		<View
			className={cn(
				"flex-row rounded border-2 border-border bg-muted p-1",
				className,
			)}
			{...props}
		>
			{children}
		</View>
	)
}

export interface TabsTriggerProps extends Omit<ComponentProps<typeof Pressable>, "children"> {
	value: string
	children?: React.ReactNode
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
	const { value: selectedValue, onValueChange } = useContext(TabsContext)
	const isSelected = selectedValue === value

	return (
		<Pressable
			onPress={() => onValueChange(value)}
			className={cn(
				"flex-1 items-center justify-center rounded px-3 py-2",
				isSelected ? "bg-primary" : "bg-transparent",
				className,
			)}
			{...props}
		>
			<Text
				className={cn(
					"text-sm font-medium",
					isSelected ? "text-primary-foreground" : "text-muted-foreground",
				)}
			>
				{children}
			</Text>
		</Pressable>
	)
}

export interface TabsContentProps extends ComponentProps<typeof View> {
	value: string
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
	const { value: selectedValue } = useContext(TabsContext)

	if (selectedValue !== value) return null

	return (
		<View className={cn("mt-4", className)} {...props}>
			{children}
		</View>
	)
}

export const Tabs = Object.assign(TabsRoot, {
	List: TabsList,
	Trigger: TabsTrigger,
	Content: TabsContent,
})
