import * as Burnt from "burnt"

export interface ToastOptions {
	title: string
	message?: string
	preset?: "done" | "error" | "none"
	duration?: number
}

export const toast = {
	show: ({ title, message, preset = "none", duration = 3 }: ToastOptions) => {
		Burnt.toast({
			title,
			message,
			preset,
			duration,
		})
	},

	success: (title: string, message?: string) => {
		Burnt.toast({
			title,
			message,
			preset: "done",
			duration: 3,
		})
	},

	error: (title: string, message?: string) => {
		Burnt.toast({
			title,
			message,
			preset: "error",
			duration: 3,
		})
	},

	alert: ({
		title,
		message,
		preset = "none",
	}: Omit<ToastOptions, "duration">) => {
		Burnt.alert({
			title,
			message,
			preset,
		})
	},
}

// Re-export for convenience
export { Burnt }
