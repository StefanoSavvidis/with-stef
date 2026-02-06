import { Badge } from "@/components/retroui"

export function LiveBadge() {
	return (
		<Badge className="bg-green-500 text-white flex items-center gap-1.5">
			<span className="relative flex h-2 w-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
				<span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
			</span>
			LIVE
		</Badge>
	)
}
