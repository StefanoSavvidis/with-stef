import { api } from "@with-stef/backend/convex/_generated/api"
import type { Doc, Id } from "@with-stef/backend/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Check } from "lucide-react"
import { useState } from "react"
import { Button, Card, Text } from "@/components/retroui"
import { cn } from "@/lib/utils"

type Question = Doc<"triviaQuestions">

interface QuestionsListProps {
	questions: Question[]
	gameStatus: Doc<"triviaGames">["status"]
	onAddQuestion: () => void
}

export function QuestionsList({
	questions,
	gameStatus,
	onAddQuestion,
}: QuestionsListProps) {
	const hasLiveQuestion = questions.some((q) => q.status === "live")

	return (
		<Card className="p-4 w-full block">
			<div className="flex items-center justify-between mb-4">
				<Text as="h3">Questions</Text>
				{gameStatus !== "ended" && (
					<Button onClick={onAddQuestion} size="sm">
						+ Add
					</Button>
				)}
			</div>

			{questions.length === 0 ? (
				<Text as="p" className="text-muted-foreground">
					No questions yet. Add your first question!
				</Text>
			) : (
				<div className="space-y-3">
					{questions.map((question, index) => (
						<QuestionRow
							key={question._id}
							question={question}
							index={index}
							gameStatus={gameStatus}
							hasLiveQuestion={hasLiveQuestion}
						/>
					))}
				</div>
			)}
		</Card>
	)
}

interface QuestionRowProps {
	question: Question
	index: number
	gameStatus: Doc<"triviaGames">["status"]
	hasLiveQuestion: boolean
}

function QuestionRow({
	question,
	index,
	gameStatus,
	hasLiveQuestion,
}: QuestionRowProps) {
	const isLive = question.status === "live"
	const isClosed = question.status === "closed"
	const isDraft = question.status === "draft"

	return (
		<div
			className={cn(
				"p-3 border-2 border-black",
				isLive && "bg-red-50 border-red-500",
				isClosed && !question.isAnswerRevealed && "bg-yellow-50",
			)}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						<Text as="p" className="font-medium">
							{index + 1}. {question.text}
						</Text>
						<QuestionStatusBadge question={question} />
					</div>

					{question.isAnswerRevealed && question.correctOption !== undefined && (
						<Text as="p" className="text-sm text-green-700">
							Answer: {question.options[question.correctOption]} (+
							{question.baseScore * question.multiplier} pts)
						</Text>
					)}
				</div>
			</div>

			{/* Live Question Controls */}
			{isLive && gameStatus === "live" && (
				<LiveQuestionControls questionId={question._id} />
			)}

			{/* Closed Question - Reveal Answer */}
			{isClosed && !question.isAnswerRevealed && (
				<RevealAnswerControls question={question} />
			)}

			{/* Draft Question - Make Live */}
			{isDraft && gameStatus === "live" && (
				<DraftQuestionControls
					questionId={question._id}
					disabled={hasLiveQuestion}
				/>
			)}
		</div>
	)
}

function QuestionStatusBadge({ question }: { question: Question }) {
	const { status, isAnswerRevealed } = question

	if (status === "live") {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 border border-red-300">
				<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
				LIVE
			</span>
		)
	}

	if (status === "closed" && !isAnswerRevealed) {
		return (
			<span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
				CLOSED
			</span>
		)
	}

	if (status === "closed" && isAnswerRevealed) {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-300">
				<Check className="w-3 h-3" />
				REVEALED
			</span>
		)
	}

	return (
		<span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
			DRAFT
		</span>
	)
}

function LiveQuestionControls({
	questionId,
}: {
	questionId: Id<"triviaQuestions">
}) {
	const [isClosing, setIsClosing] = useState(false)
	const updateStatus = useMutation(api.trivia.updateQuestionStatus)

	const handleClose = async () => {
		setIsClosing(true)
		try {
			await updateStatus({ questionId, status: "closed" })
		} finally {
			setIsClosing(false)
		}
	}

	return (
		<div className="mt-3 pt-3 border-t border-red-200">
			<Button
				variant="secondary"
				size="sm"
				onClick={handleClose}
				disabled={isClosing}
			>
				{isClosing ? "Closing..." : "Close Question"}
			</Button>
		</div>
	)
}

function RevealAnswerControls({ question }: { question: Question }) {
	const [selectedOption, setSelectedOption] = useState<number | null>(null)
	const [isRevealing, setIsRevealing] = useState(false)
	const setCorrectAnswer = useMutation(api.trivia.setCorrectAnswer)

	const handleReveal = async () => {
		if (selectedOption === null) return
		setIsRevealing(true)
		try {
			await setCorrectAnswer({
				questionId: question._id,
				correctOption: selectedOption,
			})
		} finally {
			setIsRevealing(false)
		}
	}

	return (
		<div className="mt-3 pt-3 border-t border-yellow-200 space-y-3">
			<div className="grid grid-cols-2 gap-2">
				{question.options.map((option, index) => (
					<button
						key={index}
						type="button"
						onClick={() => setSelectedOption(index)}
						className={cn(
							"p-2 text-left text-sm border-2 transition-colors",
							selectedOption === index
								? "border-green-500 bg-green-50"
								: "border-gray-300 hover:border-gray-400",
						)}
					>
						<span className="font-medium">
							{String.fromCharCode(65 + index)}.
						</span>{" "}
						{option}
					</button>
				))}
			</div>
			<Button
				size="sm"
				onClick={handleReveal}
				disabled={selectedOption === null || isRevealing}
			>
				{isRevealing ? "Revealing..." : "Reveal Answer"}
			</Button>
		</div>
	)
}

function DraftQuestionControls({
	questionId,
	disabled,
}: {
	questionId: Id<"triviaQuestions">
	disabled: boolean
}) {
	const [isMakingLive, setIsMakingLive] = useState(false)
	const updateStatus = useMutation(api.trivia.updateQuestionStatus)

	const handleMakeLive = async () => {
		setIsMakingLive(true)
		try {
			await updateStatus({ questionId, status: "live" })
		} finally {
			setIsMakingLive(false)
		}
	}

	return (
		<div className="mt-3 pt-3 border-t border-gray-200">
			<Button
				size="sm"
				variant="outline"
				onClick={handleMakeLive}
				disabled={disabled || isMakingLive}
			>
				{isMakingLive ? "Making Live..." : disabled ? "Another question is live" : "Make Live"}
			</Button>
		</div>
	)
}
