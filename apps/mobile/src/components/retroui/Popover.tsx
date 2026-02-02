import {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect,
	type ComponentProps,
} from "react"
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { Pressable, View } from "@/tw"
import { cn } from "./cn"

interface PopoverContextValue {
	open: boolean
	setOpen: (open: boolean) => void
}

const PopoverContext = createContext<PopoverContextValue>({
	open: false,
	setOpen: () => {},
})

export interface PopoverProps {
	children?: React.ReactNode
}

function PopoverRoot({ children }: PopoverProps) {
	const [open, setOpen] = useState(false)

	return (
		<PopoverContext.Provider value={{ open, setOpen }}>
			{children}
		</PopoverContext.Provider>
	)
}

export interface PopoverTriggerProps extends ComponentProps<typeof Pressable> {}

function PopoverTrigger({ className, children, ...props }: PopoverTriggerProps) {
	const { setOpen } = useContext(PopoverContext)

	return (
		<Pressable onPress={() => setOpen(true)} className={className} {...props}>
			{children}
		</Pressable>
	)
}

export interface PopoverContentProps extends ComponentProps<typeof View> {}

function PopoverContent({ className, children, ...props }: PopoverContentProps) {
	const { open, setOpen } = useContext(PopoverContext)
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
				opacity={0.3}
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
			backgroundStyle={{
				backgroundColor: "#fff",
				borderWidth: 2,
				borderColor: "#000",
				borderTopLeftRadius: 0,
				borderTopRightRadius: 0,
			}}
			handleIndicatorStyle={{ backgroundColor: "#000" }}
		>
			<BottomSheetView>
				<View className={cn("p-4", className)} {...props}>
					{children}
				</View>
			</BottomSheetView>
		</BottomSheet>
	)
}

export const Popover = Object.assign(PopoverRoot, {
	Trigger: PopoverTrigger,
	Content: PopoverContent,
})
