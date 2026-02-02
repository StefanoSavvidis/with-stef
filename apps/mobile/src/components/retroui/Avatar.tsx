import { useState } from "react"
import type { ComponentProps } from "react"
import { Image, StyleSheet } from "react-native"
import { View, Text } from "@/tw"
import { cn } from "./cn"

export interface AvatarProps extends ComponentProps<typeof View> {
	src?: string | null
	alt?: string
	fallback?: string
	size?: "sm" | "md" | "lg"
}

const sizeClasses = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-14 w-14",
}

// Explicit styles for text sizes in RN
const textStyles = StyleSheet.create({
	sm: { fontSize: 12, fontWeight: "600", color: "#4b5563" },
	md: { fontSize: 14, fontWeight: "600", color: "#4b5563" },
	lg: { fontSize: 18, fontWeight: "600", color: "#4b5563" },
})

export function Avatar({
	src,
	alt,
	fallback,
	size = "md",
	className,
	...props
}: AvatarProps) {
	const [error, setError] = useState(false)

	const initials =
		fallback ||
		(alt
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) ??
			"?")

	const showFallback = !src || error

	return (
		<View
			className={cn(
				"items-center justify-center overflow-hidden rounded-full border-2 border-black bg-gray-100",
				sizeClasses[size],
				className,
			)}
			{...props}
		>
			{showFallback ? (
				<Text style={textStyles[size]}>{initials}</Text>
			) : (
				<Image
					source={{ uri: src }}
					onError={() => setError(true)}
					style={{ width: "100%", height: "100%" }}
					resizeMode="cover"
					accessibilityLabel={alt}
				/>
			)}
		</View>
	)
}
