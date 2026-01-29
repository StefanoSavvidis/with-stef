import { Link } from "@tanstack/react-router"
import { Text } from "@/components/retroui"

export default function Header() {
	return (
		<header className="border-b-2 border-border bg-card px-6 py-4">
			<div className="flex items-center justify-between">
				<Link to="/">
					<Text as="h4" className="font-head">
						Admin
					</Text>
				</Link>
			</div>
		</header>
	)
}
