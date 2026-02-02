import { useCallback, useRef, useEffect, useMemo, type ComponentProps } from "react"
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { View, Text as TWText } from "@/tw"
import { cn } from "./cn"
import { Text } from "./Text"

export interface DrawerProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	children?: React.ReactNode
	snapPoints?: (string | number)[]
}

function DrawerRoot({
	open,
	onOpenChange,
	children,
	snapPoints: customSnapPoints,
}: DrawerProps) {
	const bottomSheetRef = useRef<BottomSheet>(null)
	const snapPoints = useMemo(
		() => customSnapPoints || ["25%", "50%", "90%"],
		[customSnapPoints],
	)

	useEffect(() => {
		if (open) {
			bottomSheetRef.current?.snapToIndex(1)
		} else {
			bottomSheetRef.current?.close()
		}
	}, [open])

	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				onOpenChange?.(false)
			}
		},
		[onOpenChange],
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
			index={1}
			snapPoints={snapPoints}
			enablePanDownToClose
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
			<BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
		</BottomSheet>
	)
}

function DrawerHeader({ className, ...props }: ComponentProps<typeof View>) {
	return (
		<View
			className={cn("border-b border-border px-4 pb-4", className)}
			{...props}
		/>
	)
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof TWText>) {
	return <Text variant="h3" className={cn(className)} {...props} />
}

function DrawerContent({ className, ...props }: ComponentProps<typeof View>) {
	return <View className={cn("flex-1 p-4", className)} {...props} />
}

export const Drawer = Object.assign(DrawerRoot, {
	Header: DrawerHeader,
	Title: DrawerTitle,
	Content: DrawerContent,
})
