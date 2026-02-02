import { X } from "lucide-react"
import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/retroui/Button"
import { Text } from "@/components/retroui/Text"
import { cn } from "@/lib/utils"

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	children: ReactNode
	className?: string
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	className,
}: ModalProps) {
	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		if (isOpen) {
			document.addEventListener("keydown", handleEscape)
			document.body.style.overflow = "hidden"
		}
		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.body.style.overflow = ""
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Enter" && onClose()}
			/>

			{/* Modal */}
			<div
				className={cn(
					"relative bg-card border-2 border-black shadow-lg p-6 min-w-[400px] max-w-lg max-h-[90vh] overflow-y-auto",
					className,
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<Text as="h2">{title}</Text>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						aria-label="Close modal"
					>
						<X className="w-5 h-5" />
					</Button>
				</div>

				{/* Content */}
				{children}
			</div>
		</div>,
		document.body,
	)
}
