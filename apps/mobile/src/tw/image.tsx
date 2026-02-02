import { withUniwind } from "uniwind"
import type { ComponentProps } from "react"
import { StyleSheet, Image as RNImage } from "react-native"

function CSSImage(props: ComponentProps<typeof RNImage>) {
	const flatStyle = StyleSheet.flatten(props.style) || {}
	const { objectFit, ...style } = flatStyle as typeof flatStyle & {
		objectFit?: string
	}

	const resizeModeMap: Record<
		string,
		"cover" | "contain" | "stretch" | "center"
	> = {
		cover: "cover",
		contain: "contain",
		fill: "stretch",
		none: "center",
	}

	return (
		<RNImage
			resizeMode={objectFit ? resizeModeMap[objectFit] : undefined}
			{...props}
			style={style}
		/>
	)
}

export type ImageProps = ComponentProps<typeof RNImage> & {
	className?: string
}

export const Image = withUniwind(CSSImage) as React.FC<ImageProps>
