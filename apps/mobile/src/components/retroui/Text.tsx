import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { StyleSheet, type TextStyle } from "react-native"
import { Text as TWText } from "@/tw"
import { cn } from "./cn"
import {
	fontHead,
	fontSansRegular,
	fontSansMedium,
	fontSansSemiBold,
} from "@/lib/fonts"

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
	p: { fontSize: 16, color: "#000", fontFamily: fontSansRegular },
	h1: { fontSize: 36, color: "#000", fontFamily: fontHead },
	h2: { fontSize: 30, color: "#000", fontFamily: fontHead },
	h3: { fontSize: 24, color: "#000", fontFamily: fontHead },
	h4: { fontSize: 20, color: "#000", fontFamily: fontSansSemiBold },
	h5: { fontSize: 18, color: "#000", fontFamily: fontSansMedium },
	h6: { fontSize: 16, color: "#000", fontFamily: fontSansRegular },
	label: { fontSize: 14, color: "#000", fontFamily: fontSansSemiBold },
	caption: { fontSize: 12, color: "#6b7280", fontFamily: fontSansRegular },
	muted: { fontSize: 14, color: "#6b7280", fontFamily: fontSansRegular },
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
