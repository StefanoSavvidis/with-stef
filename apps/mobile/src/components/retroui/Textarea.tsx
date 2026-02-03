import type { ComponentProps } from "react"
import { TextInput } from "@/tw"
import { cn } from "./cn"
import { HardShadow } from "./HardShadow"

export interface TextareaProps extends ComponentProps<typeof TextInput> {
	error?: boolean
}

export function Textarea({
	className,
	placeholder = "Enter text",
	error = false,
	...props
}: TextareaProps) {
	return (
		<HardShadow offset={error ? 1 : 4} color={error ? "#ef4444" : "#000"} radius={4}>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor="#737373"
				multiline
				numberOfLines={4}
				textAlignVertical="top"
				className={cn(
					"min-h-24 w-full rounded border-2 border-border bg-background px-4 py-3 text-base text-foreground",
					error && "border-destructive text-destructive",
					className,
				)}
				{...props}
			/>
		</HardShadow>
	)
}
