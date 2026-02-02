import { api } from "@with-stef/backend/convex/_generated/api"
import type { Id } from "@with-stef/backend/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useState } from "react"
import { Button, Input, Text } from "@/components/retroui"
import { Modal } from "@/components/ui/Modal"

interface AddQuestionModalProps {
	isOpen: boolean
	onClose: () => void
	gameId: Id<"triviaGames">
}

export function AddQuestionModal({
	isOpen,
	onClose,
	gameId,
}: AddQuestionModalProps) {
	const [text, setText] = useState("")
	const [options, setOptions] = useState(["", "", "", ""])
	const [baseScore, setBaseScore] = useState(10)
	const [multiplier, setMultiplier] = useState(1)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const createQuestion = useMutation(api.trivia.createQuestion)

	const handleOptionChange = (index: number, value: string) => {
		const newOptions = [...options]
		newOptions[index] = value
		setOptions(newOptions)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!text.trim() || options.some((o) => !o.trim())) return

		setIsSubmitting(true)
		try {
			await createQuestion({
				gameId,
				text: text.trim(),
				options: options.map((o) => o.trim()),
				baseScore,
				multiplier,
			})
			handleClose()
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClose = () => {
		setText("")
		setOptions(["", "", "", ""])
		setBaseScore(10)
		setMultiplier(1)
		onClose()
	}

	const isValid = text.trim() && options.every((o) => o.trim())

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Add Question">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Text as="p" className="text-sm font-medium">
						Question
					</Text>
					<Input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="What is the capital of France?"
						autoFocus
					/>
				</div>

				<div className="space-y-2">
					<Text as="p" className="text-sm font-medium">
						Options
					</Text>
					{options.map((option, index) => (
						<div key={index} className="flex items-center gap-2">
							<span className="w-6 text-sm font-medium text-muted-foreground">
								{String.fromCharCode(65 + index)}.
							</span>
							<Input
								type="text"
								value={option}
								onChange={(e) => handleOptionChange(index, e.target.value)}
								placeholder={`Option ${String.fromCharCode(65 + index)}`}
								className="flex-1"
							/>
						</div>
					))}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Text as="p" className="text-sm font-medium">
							Points
						</Text>
						<Input
							type="number"
							value={baseScore}
							onChange={(e) => setBaseScore(Number(e.target.value))}
							min={1}
						/>
					</div>
					<div className="space-y-2">
						<Text as="p" className="text-sm font-medium">
							Multiplier
						</Text>
						<Input
							type="number"
							value={multiplier}
							onChange={(e) => setMultiplier(Number(e.target.value))}
							min={1}
							step={0.5}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={!isValid || isSubmitting}>
						{isSubmitting ? "Adding..." : "Add"}
					</Button>
				</div>
			</form>
		</Modal>
	)
}
