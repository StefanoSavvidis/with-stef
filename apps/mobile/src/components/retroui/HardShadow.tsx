import type { ComponentProps, ReactNode } from "react"
import { StyleSheet, View as RNView, type ViewStyle } from "react-native"
import { View } from "@/tw"

export interface HardShadowProps
	extends Omit<ComponentProps<typeof View>, "children" | "className"> {
	children: ReactNode
	offset?: number
	color?: string
	radius?: number
	shadowStyle?: ViewStyle
	contentStyle?: ViewStyle
	className?: string
	containerClassName?: string
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		overflow: "visible",
	},
	shadow: {
		position: "absolute",
	},
	content: {
		position: "relative",
	},
})

export function HardShadow({
	children,
	offset = 4,
	color = "#000",
	radius = 4,
	shadowStyle,
	contentStyle,
	className,
	style,
	containerClassName,
	...props
}: HardShadowProps) {
	return (
		<View
			className={containerClassName}
			style={[styles.container, { borderRadius: radius }, style]}
			{...props}
		>
			<RNView
				pointerEvents="none"
				style={[
					styles.shadow,
					{
						backgroundColor: color,
						borderRadius: radius,
						top: offset,
						left: offset,
						right: -offset,
						bottom: -offset,
					},
					shadowStyle,
				]}
			/>
			<View className={className} style={[styles.content, contentStyle]}>
				{children}
			</View>
		</View>
	)
}
