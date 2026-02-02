import { api } from "@with-stef/backend/convex/_generated/api"
import { useMutation } from "convex/react"
import { useState } from "react"
import { Button, Input, Text } from "@/components/retroui"
import { Modal } from "@/components/ui/Modal"

interface CreateGameModalProps {
	isOpen: boolean
	onClose: () => void
}

export function CreateGameModal({ isOpen, onClose }: CreateGameModalProps) {
	const [name, setName] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const createGame = useMutation(api.trivia.createGame)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) return

		setIsSubmitting(true)
		try {
			await createGame({ name: name.trim() })
			setName("")
			onClose()
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClose = () => {
		setName("")
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Create New Game">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Text as="p" className="text-sm font-medium">
						Game Name
					</Text>
					<Input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Friday Night Trivia"
						autoFocus
					/>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={!name.trim() || isSubmitting}>
						{isSubmitting ? "Creating..." : "Create"}
					</Button>
				</div>
			</form>
		</Modal>
	)
}
