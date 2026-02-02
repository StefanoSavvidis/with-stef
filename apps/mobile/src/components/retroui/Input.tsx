import type { ComponentProps } from "react"
import { StyleSheet, TextInput as RNTextInput } from "react-native"

const styles = StyleSheet.create({
	input: {
		width: "100%",
		fontSize: 16,
		color: "#000",
		backgroundColor: "#fff",
		borderWidth: 2,
		borderColor: "#000",
		borderRadius: 4,
		paddingHorizontal: 16,
		paddingVertical: 12,
		minHeight: 48,
	},
	error: {
		color: "#ef4444",
		borderColor: "#ef4444",
	},
})

export interface InputProps extends ComponentProps<typeof RNTextInput> {
	error?: boolean
}

export function Input({
	placeholder = "Enter text",
	error = false,
	style,
	...props
}: InputProps) {
	return (
		<RNTextInput
			placeholder={placeholder}
			placeholderTextColor="#737373"
			style={[styles.input, error && styles.error, style]}
			{...props}
		/>
	)
}
