import type { ComponentProps } from "react"
import { ScrollView } from "react-native"
import { View, Text } from "@/tw"
import { cn } from "./cn"

export interface TableProps extends ComponentProps<typeof View> {}

function TableRoot({ className, children, ...props }: TableProps) {
	return (
		<View
			className={cn("rounded border-2 border-border overflow-hidden", className)}
			{...props}
		>
			{children}
		</View>
	)
}

function TableHeader({ className, children, ...props }: TableProps) {
	return (
		<View className={cn("bg-muted", className)} {...props}>
			{children}
		</View>
	)
}

function TableBody({ className, children, ...props }: TableProps) {
	return (
		<View className={cn(className)} {...props}>
			{children}
		</View>
	)
}

function TableRow({ className, children, ...props }: TableProps) {
	return (
		<View
			className={cn("flex-row border-b border-border last:border-b-0", className)}
			{...props}
		>
			{children}
		</View>
	)
}

export interface TableCellProps extends ComponentProps<typeof View> {
	header?: boolean
}

function TableCell({ className, header, children, ...props }: TableCellProps) {
	return (
		<View className={cn("flex-1 p-3", className)} {...props}>
			{typeof children === "string" ? (
				<Text
					className={cn(
						header ? "font-semibold text-foreground" : "text-foreground",
					)}
				>
					{children}
				</Text>
			) : (
				children
			)}
		</View>
	)
}

function TableHead({ className, children, ...props }: ComponentProps<typeof View>) {
	return (
		<View className={cn("flex-1 p-3", className)} {...props}>
			{typeof children === "string" ? (
				<Text className="font-semibold text-foreground">{children}</Text>
			) : (
				children
			)}
		</View>
	)
}

export const Table = Object.assign(TableRoot, {
	Header: TableHeader,
	Body: TableBody,
	Row: TableRow,
	Cell: TableCell,
	Head: TableHead,
})
