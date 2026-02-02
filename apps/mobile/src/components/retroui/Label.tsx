import type { ComponentProps } from "react"
import { StyleSheet } from "react-native"
import { Text } from "@/tw"
import { cn } from "./cn"

const styles = StyleSheet.create({
	label: {
		marginBottom: 4,
		fontSize: 14,
		fontWeight: "500",
		color: "#000",
	},
})

export interface LabelProps extends ComponentProps<typeof Text> {}

export function Label({ className, style, ...props }: LabelProps) {
	return (
		<Text
			className={cn("mb-1 text-sm font-medium text-black", className)}
			style={[styles.label, style]}
			{...props}
		/>
	)
}
