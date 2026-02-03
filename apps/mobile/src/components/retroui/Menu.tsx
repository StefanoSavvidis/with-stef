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

interface MenuContextValue {
	open: boolean
	setOpen: (open: boolean) => void
}

const MenuContext = createContext<MenuContextValue>({
	open: false,
	setOpen: () => {},
})

export interface MenuProps {
	children?: React.ReactNode
}

function MenuRoot({ children }: MenuProps) {
	const [open, setOpen] = useState(false)

	return (
		<MenuContext.Provider value={{ open, setOpen }}>
			{children}
		</MenuContext.Provider>
	)
}

export interface MenuTriggerProps extends ComponentProps<typeof Pressable> {}

function MenuTrigger({ className, children, ...props }: MenuTriggerProps) {
	const { setOpen } = useContext(MenuContext)

	return (
		<Pressable onPress={() => setOpen(true)} className={className} {...props}>
			{children}
		</Pressable>
	)
}

export interface MenuContentProps {
	children?: React.ReactNode
}

function MenuContent({ children }: MenuContentProps) {
	const { open, setOpen } = useContext(MenuContext)
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

export interface MenuItemProps extends Omit<ComponentProps<typeof Pressable>, "children"> {
	icon?: string
	destructive?: boolean
	children?: React.ReactNode
}

function MenuItem({
	children,
	className,
	icon,
	destructive,
	onPress,
	...props
}: MenuItemProps) {
	const { setOpen } = useContext(MenuContext)

	const handlePress = (e: any) => {
		onPress?.(e)
		setOpen(false)
	}

	return (
		<Pressable
			onPress={handlePress}
			className={cn("flex-row items-center gap-3 px-4 py-3", className)}
			{...props}
		>
			{icon && (
				<Icon
					name={icon}
					size={20}
					color={destructive ? "#e63946" : "#000"}
				/>
			)}
			<Text
				className={cn(
					"flex-1 text-base",
					destructive ? "text-destructive" : "text-foreground",
				)}
			>
				{children}
			</Text>
		</Pressable>
	)
}

function MenuSeparator({ className }: { className?: string }) {
	return <View className={cn("my-1 h-px bg-border", className)} />
}

function MenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<Text className={cn("px-4 py-2 text-xs font-semibold uppercase text-muted-foreground", className)}>
			{children}
		</Text>
	)
}

export const Menu = Object.assign(MenuRoot, {
	Trigger: MenuTrigger,
	Content: MenuContent,
	Item: MenuItem,
	Separator: MenuSeparator,
	Label: MenuLabel,
})
