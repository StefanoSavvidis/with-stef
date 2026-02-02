import type { ComponentProps } from "react"
import { View } from "@/tw"
import { cn } from "./cn"

export interface ProgressProps extends ComponentProps<typeof View> {
	value?: number
	max?: number
}

export function Progress({
	value = 0,
	max = 100,
	className,
	...props
}: ProgressProps) {
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

	return (
		<View
			className={cn(
				"h-4 w-full overflow-hidden rounded border-2 border-border bg-muted",
				className,
			)}
			{...props}
		>
			<View
				className="h-full bg-primary"
				style={{ width: `${percentage}%` }}
			/>
		</View>
	)
}
