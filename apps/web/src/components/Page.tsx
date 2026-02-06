import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageProps {
	children: ReactNode
	fullWidth?: boolean
	backLink?: {
		to: string
		label: string
	}
	topRight?: ReactNode
}

export function Page({
	children,
	fullWidth,
	backLink,
	topRight,
}: PageProps) {
	return (
		<main className="flex-1 p-4 md:p-6">
			<div className={cn("mx-auto space-y-5", !fullWidth && "max-w-3xl")}>
				{(backLink || topRight) && (
					<div className="flex items-center justify-between">
						{backLink ? (
							<Link
								to={backLink.to}
								className="inline-flex items-center gap-1 text-sm hover:underline"
							>
								<ArrowLeft className="w-4 h-4" />
								{backLink.label}
							</Link>
						) : (
							<div />
						)}
						{topRight}
					</div>
				)}
				{children}
			</div>
		</main>
	)
}
