import { withUniwind, useCSSVariable } from "uniwind"
import type { ComponentProps } from "react"
import {
	View as RNView,
	Text as RNText,
	Pressable as RNPressable,
	ScrollView as RNScrollView,
	TextInput as RNTextInput,
	TouchableHighlight as RNTouchableHighlight,
} from "react-native"

type WithClassName<T> = T & { className?: string }

export type ViewProps = WithClassName<ComponentProps<typeof RNView>>
export const View = withUniwind(RNView) as React.FC<ViewProps>

export type TextProps = WithClassName<ComponentProps<typeof RNText>>
export const Text = withUniwind(RNText) as React.FC<TextProps>

export type PressableProps = WithClassName<ComponentProps<typeof RNPressable>>
export const Pressable = withUniwind(RNPressable) as React.FC<PressableProps>

export type TextInputProps = WithClassName<ComponentProps<typeof RNTextInput>>
export const TextInput = withUniwind(RNTextInput) as React.FC<TextInputProps>

export type TouchableHighlightProps = WithClassName<
	ComponentProps<typeof RNTouchableHighlight>
>
export const TouchableHighlight = withUniwind(
	RNTouchableHighlight,
) as React.FC<TouchableHighlightProps>

export type ScrollViewProps = WithClassName<
	ComponentProps<typeof RNScrollView>
> & {
	contentContainerClassName?: string
}
export const ScrollView = withUniwind(RNScrollView, {
	contentContainerStyle: { fromClassName: "contentContainerClassName" },
}) as React.FC<ScrollViewProps>

export { useCSSVariable }
