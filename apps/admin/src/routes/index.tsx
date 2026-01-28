import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
	return <div>Edit index.tsx to get started</div>
}
