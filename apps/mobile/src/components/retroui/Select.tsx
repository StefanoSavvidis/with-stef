import {
	createContext,
	useContext,
	useCallback,
	useRef,
	useEffect,
	useState,
	type ComponentProps,
} from "react"
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet"
import { Pressable, View, Text } from "@/tw"
import { cn } from "./cn"
import { Icon } from "./Icon"
import { HardShadow } from "./HardShadow"

interface SelectContextValue {
	value?: string
	onValueChange?: (value: string) => void
	open: boolean
	setOpen: (open: boolean) => void
	label?: string
	setLabel: (label: string) => void
}

const SelectContext = createContext<SelectContextValue>({
	open: false,
	setOpen: () => {},
	setLabel: () => {},
})

export interface SelectProps {
	value?: string
	onValueChange?: (value: string) => void
	children?: React.ReactNode
}

function SelectRoot({ value, onValueChange, children }: SelectProps) {
	const [open, setOpen] = useState(false)
	const [label, setLabel] = useState("")

	return (
		<SelectContext.Provider
			value={{ value, onValueChange, open, setOpen, label, setLabel }}
		>
			{children}
		</SelectContext.Provider>
	)
}

export interface SelectTriggerProps extends Omit<ComponentProps<typeof Pressable>, "children"> {
	children?: React.ReactNode
}

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
	const { setOpen } = useContext(SelectContext)

	return (
		<HardShadow offset={4} radius={4}>
			<Pressable
				onPress={() => setOpen(true)}
				className={cn(
					"flex-row items-center justify-between rounded border-2 border-border bg-background px-4 py-3",
					className,
				)}
				{...props}
			>
				{children}
				<Icon name="chevron-down" size={20} color="#000" />
			</Pressable>
		</HardShadow>
	)
}

export interface SelectValueProps {
	placeholder?: string
	className?: string
}

function SelectValue({ placeholder = "Select...", className }: SelectValueProps) {
	const { label } = useContext(SelectContext)

	return (
		<Text
			className={cn(
				"text-base",
				label ? "text-foreground" : "text-muted-foreground",
				className,
			)}
		>
			{label || placeholder}
		</Text>
	)
}

export interface SelectContentProps {
	children?: React.ReactNode
}

function SelectContent({ children }: SelectContentProps) {
	const { open, setOpen } = useContext(SelectContext)
	const bottomSheetRef = useRef<BottomSheet>(null)

	useEffect(() => {
		if (open) {
			bottomSheetRef.current?.expand()
		} else {
			bottomSheetRef.current?.close()
		}
	}, [open])

	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				setOpen(false)
			}
		},
		[setOpen],
	)

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
			/>
		),
		[],
	)

	if (!open) return null

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			enablePanDownToClose
			enableDynamicSizing
			onChange={handleSheetChanges}
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: "transparent" }}
			handleIndicatorStyle={{ backgroundColor: "#000" }}
		>
			<HardShadow offset={6} radius={0} style={{ alignSelf: "stretch" }}>
				<View className="border-2 border-black bg-white">
					<BottomSheetScrollView style={{ maxHeight: 400 }}>
						<View className="py-2">{children}</View>
					</BottomSheetScrollView>
				</View>
			</HardShadow>
		</BottomSheet>
	)
}

export interface SelectItemProps extends ComponentProps<typeof Pressable> {
	value: string
	children: React.ReactNode
}

function SelectItem({ value, children, className, ...props }: SelectItemProps) {
	const { value: selectedValue, onValueChange, setOpen, setLabel } =
		useContext(SelectContext)
	const isSelected = selectedValue === value

	const handlePress = () => {
		onValueChange?.(value)
		setLabel(typeof children === "string" ? children : value)
		setOpen(false)
	}

	return (
		<Pressable
			onPress={handlePress}
			className={cn(
				"flex-row items-center justify-between px-4 py-3",
				isSelected && "bg-primary",
				className,
			)}
			{...props}
		>
			<Text
				className={cn(
					"text-base",
					isSelected ? "text-primary-foreground" : "text-foreground",
				)}
			>
				{children}
			</Text>
			{isSelected && <Icon name="check" size={20} color="#000" />}
		</Pressable>
	)
}

export const Select = Object.assign(SelectRoot, {
	Trigger: SelectTrigger,
	Value: SelectValue,
	Content: SelectContent,
	Item: SelectItem,
})
