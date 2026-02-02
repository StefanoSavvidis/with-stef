import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { StyleSheet, type TextStyle } from "react-native"
import { View, Text as TWText } from "@/tw"
import { cn } from "./cn"
import { Text } from "./Text"
import { Icon } from "./Icon"

const alertVariants = cva("w-full rounded border-2 p-4", {
	variants: {
		variant: {
			default: "border-black bg-white",
			solid: "border-black bg-black",
		},
		status: {
			error: "border-red-800 bg-red-100",
			success: "border-green-800 bg-green-100",
			warning: "border-yellow-800 bg-yellow-100",
			info: "border-blue-800 bg-blue-100",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

// Explicit RN text color styles
const textColorStyles: Record<string, TextStyle> = {
	error: { color: "#991b1b" },
	success: { color: "#166534" },
	warning: { color: "#854d0e" },
	info: { color: "#1e40af" },
	default: { color: "#000" },
	solid: { color: "#fff" },
}

const styles = StyleSheet.create({
	title: { fontSize: 18, fontWeight: "500" },
	description: { fontSize: 16, marginTop: 4 },
})

export interface AlertProps
	extends ComponentProps<typeof View>,
		VariantProps<typeof alertVariants> {}

function AlertRoot({ className, variant, status, ...props }: AlertProps) {
	return (
		<View
			className={cn(alertVariants({ variant, status }), className)}
			{...props}
		/>
	)
}

interface AlertTitleProps
	extends ComponentProps<typeof TWText>,
		VariantProps<typeof alertVariants> {}

function AlertTitle({ className, variant, status, style, ...props }: AlertTitleProps) {
	const colorStyle = textColorStyles[status || variant || "default"]
	return (
		<TWText
			style={[styles.title, colorStyle, style]}
			{...props}
		/>
	)
}

interface AlertDescriptionProps
	extends ComponentProps<typeof TWText>,
		VariantProps<typeof alertVariants> {}

function AlertDescription({
	className,
	variant,
	status,
	style,
	...props
}: AlertDescriptionProps) {
	const colorStyle = textColorStyles[status || variant || "default"]
	return (
		<TWText
			style={[styles.description, colorStyle, style]}
			{...props}
		/>
	)
}

interface AlertIconProps extends VariantProps<typeof alertVariants> {
	status?: "error" | "success" | "warning" | "info"
}

function AlertIcon({ status, variant }: AlertIconProps) {
	const iconName = {
		error: "alert-circle",
		success: "check-circle",
		warning: "warning",
		info: "info",
	}[status || "info"]

	const iconColor = {
		error: "#991b1b",
		success: "#166534",
		warning: "#854d0e",
		info: "#1e40af",
		default: "#000",
		solid: "#fff",
	}[status || variant || "default"]

	return <Icon name={iconName} size={20} color={iconColor} />
}

export const Alert = Object.assign(AlertRoot, {
	Title: AlertTitle,
	Description: AlertDescription,
	Icon: AlertIcon,
})
