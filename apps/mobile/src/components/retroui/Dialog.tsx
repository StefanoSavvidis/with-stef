import { useCallback, useRef, useEffect, type ComponentProps } from "react"
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { View, Text as TWText } from "@/tw"
import { cn } from "./cn"
import { Text } from "./Text"

export interface DialogProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	children?: React.ReactNode
}

function DialogRoot({ open, onOpenChange, children }: DialogProps) {
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
			<BottomSheetView>{children}</BottomSheetView>
		</BottomSheet>
	)
}

function DialogHeader({ className, ...props }: ComponentProps<typeof View>) {
	return (
		<View
			className={cn("border-b border-border px-4 pb-4", className)}
			{...props}
		/>
	)
}

function DialogTitle({ className, ...props }: ComponentProps<typeof TWText>) {
	return <Text variant="h3" className={cn(className)} {...props} />
}

function DialogDescription({
	className,
	...props
}: ComponentProps<typeof TWText>) {
	return (
		<TWText
			className={cn("mt-1 text-sm text-muted-foreground", className)}
			{...props}
		/>
	)
}

function DialogContent({ className, ...props }: ComponentProps<typeof View>) {
	return <View className={cn("p-4", className)} {...props} />
}

function DialogFooter({ className, ...props }: ComponentProps<typeof View>) {
	return (
		<View
			className={cn(
				"flex-row items-center justify-end gap-2 border-t border-border p-4",
				className,
			)}
			{...props}
		/>
	)
}

export const Dialog = Object.assign(DialogRoot, {
	Header: DialogHeader,
	Title: DialogTitle,
	Description: DialogDescription,
	Content: DialogContent,
	Footer: DialogFooter,
})
