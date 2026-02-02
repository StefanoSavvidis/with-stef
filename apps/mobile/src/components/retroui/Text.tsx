import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { StyleSheet, type TextStyle } from "react-native"
import { Text as TWText } from "@/tw"
import { cn } from "./cn"

const textVariants = cva("", {
	variants: {
		variant: {
			p: "",
			h1: "",
			h2: "",
			h3: "",
			h4: "",
			h5: "",
			h6: "",
			label: "",
			caption: "",
			muted: "",
		},
	},
	defaultVariants: {
		variant: "p",
	},
})

// React Native explicit styles for each variant
const variantStyles = StyleSheet.create({
	p: { fontSize: 16, color: "#000" },
	h1: { fontSize: 36, fontWeight: "700", color: "#000" },
	h2: { fontSize: 30, fontWeight: "600", color: "#000" },
	h3: { fontSize: 24, fontWeight: "500", color: "#000" },
	h4: { fontSize: 20, fontWeight: "500", color: "#000" },
	h5: { fontSize: 18, color: "#000" },
	h6: { fontSize: 16, color: "#000" },
	label: { fontSize: 14, fontWeight: "500", color: "#000" },
	caption: { fontSize: 12, color: "#6b7280" },
	muted: { fontSize: 14, color: "#6b7280" },
})

export interface TextProps
	extends ComponentProps<typeof TWText>,
		VariantProps<typeof textVariants> {}

export function Text({
	className,
	variant = "p",
	style,
	...props
}: TextProps) {
	const variantStyle = variantStyles[variant ?? "p"]
	const combinedStyle = useMemo(
		() => [variantStyle, style] as TextStyle[],
		[variantStyle, style],
	)

	return (
		<TWText
			className={cn(textVariants({ variant }), className)}
			style={combinedStyle}
			{...props}
		/>
	)
}
