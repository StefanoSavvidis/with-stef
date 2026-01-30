import { v } from "convex/values"
import { query } from "./_generated/server"
import { authComponent } from "./auth"
import {
	adminMutation,
	adminQuery,
	authedMutation,
	authedQuery,
	publicQuery,
} from "./functions"

// ============================================================================
// Admin Mutations
// ============================================================================

export const createGame = adminMutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("triviaGames", {
			name: args.name,
			status: "draft",
			createdBy: ctx.user._id,
		})
	},
})

export const updateGameStatus = adminMutation({
	args: {
		gameId: v.id("triviaGames"),
		status: v.union(v.literal("live"), v.literal("ended")),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId)
		if (!game) {
			throw new Error("Game not found")
		}
		if (game.createdBy !== ctx.user._id) {
			throw new Error("Unauthorized: not your game")
		}

		// Validate state transitions
		if (args.status === "live" && game.status !== "draft") {
			throw new Error("Can only make draft games live")
		}
		if (args.status === "ended" && game.status !== "live") {
			throw new Error("Can only end live games")
		}

		await ctx.db.patch(args.gameId, { status: args.status })
	},
})

export const createQuestion = adminMutation({
	args: {
		gameId: v.id("triviaGames"),
		text: v.string(),
		options: v.array(v.string()),
		baseScore: v.optional(v.number()),
		multiplier: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId)
		if (!game) {
			throw new Error("Game not found")
		}
		if (game.createdBy !== ctx.user._id) {
			throw new Error("Unauthorized: not your game")
		}
		if (game.status === "ended") {
			throw new Error("Cannot add questions to ended game")
		}

		if (args.options.length !== 4) {
			throw new Error("Question must have exactly 4 options")
		}

		return ctx.db.insert("triviaQuestions", {
			gameId: args.gameId,
			text: args.text,
			options: args.options,
			status: "draft",
			isAnswerRevealed: false,
			baseScore: args.baseScore ?? 10,
			multiplier: args.multiplier ?? 1,
		})
	},
})

export const updateQuestionStatus = adminMutation({
	args: {
		questionId: v.id("triviaQuestions"),
		status: v.union(v.literal("live"), v.literal("closed")),
	},
	handler: async (ctx, args) => {
		const question = await ctx.db.get(args.questionId)
		if (!question) {
			throw new Error("Question not found")
		}

		const game = await ctx.db.get(question.gameId)
		if (!game) {
			throw new Error("Game not found")
		}
		if (game.createdBy !== ctx.user._id) {
			throw new Error("Unauthorized: not your game")
		}
		if (game.status !== "live") {
			throw new Error("Game must be live to update question status")
		}

		// Validate state transitions
		if (args.status === "live") {
			if (question.status !== "draft") {
				throw new Error("Can only make draft questions live")
			}
			// Check no other question is live
			const liveQuestion = await ctx.db
				.query("triviaQuestions")
				.withIndex("by_game_and_status", (q) =>
					q.eq("gameId", question.gameId).eq("status", "live"),
				)
				.first()
			if (liveQuestion) {
				throw new Error("Another question is already live")
			}
		}

		if (args.status === "closed" && question.status !== "live") {
			throw new Error("Can only close live questions")
		}

		await ctx.db.patch(args.questionId, { status: args.status })
	},
})

export const setCorrectAnswer = adminMutation({
	args: {
		questionId: v.id("triviaQuestions"),
		correctOption: v.number(),
	},
	handler: async (ctx, args) => {
		if (args.correctOption < 0 || args.correctOption > 3) {
			throw new Error("correctOption must be 0-3")
		}

		const question = await ctx.db.get(args.questionId)
		if (!question) {
			throw new Error("Question not found")
		}

		const game = await ctx.db.get(question.gameId)
		if (!game) {
			throw new Error("Game not found")
		}
		if (game.createdBy !== ctx.user._id) {
			throw new Error("Unauthorized: not your game")
		}
		if (question.status !== "closed") {
			throw new Error("Question must be closed before setting answer")
		}
		if (question.isAnswerRevealed) {
			throw new Error("Answer already revealed")
		}

		// Update question with correct answer
		await ctx.db.patch(args.questionId, {
			correctOption: args.correctOption,
			isAnswerRevealed: true,
		})

		// Find all correct answers and update participant scores
		const answers = await ctx.db
			.query("triviaAnswers")
			.withIndex("by_question", (q) => q.eq("questionId", args.questionId))
			.collect()

		const pointsEarned = question.baseScore * question.multiplier

		for (const answer of answers) {
			if (answer.selectedOption === args.correctOption) {
				const participant = await ctx.db.get(answer.participantId)
				if (participant) {
					await ctx.db.patch(answer.participantId, {
						score: participant.score + pointsEarned,
					})
				}
			}
		}
	},
})

// ============================================================================
// User Mutations
// ============================================================================

export const joinGame = authedMutation({
	args: {
		gameId: v.id("triviaGames"),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId)
		if (!game) {
			throw new Error("Game not found")
		}
		if (game.status !== "live") {
			throw new Error("Can only join live games")
		}

		// Check if already joined
		const existing = await ctx.db
			.query("triviaParticipants")
			.withIndex("by_game_and_user", (q) =>
				q.eq("gameId", args.gameId).eq("userId", ctx.user._id),
			)
			.first()

		if (existing) {
			return existing._id // Already joined
		}

		return ctx.db.insert("triviaParticipants", {
			gameId: args.gameId,
			userId: ctx.user._id,
			name: ctx.user.name,
			score: 0,
		})
	},
})

export const submitAnswer = authedMutation({
	args: {
		questionId: v.id("triviaQuestions"),
		selectedOption: v.number(),
	},
	handler: async (ctx, args) => {
		if (args.selectedOption < 0 || args.selectedOption > 3) {
			throw new Error("selectedOption must be 0-3")
		}

		const question = await ctx.db.get(args.questionId)
		if (!question) {
			throw new Error("Question not found")
		}
		if (question.status !== "live") {
			throw new Error("Can only answer live questions")
		}

		const game = await ctx.db.get(question.gameId)
		if (!game || game.status !== "live") {
			throw new Error("Game is not live")
		}

		// Get participant
		const participant = await ctx.db
			.query("triviaParticipants")
			.withIndex("by_game_and_user", (q) =>
				q.eq("gameId", question.gameId).eq("userId", ctx.user._id),
			)
			.first()

		if (!participant) {
			throw new Error("Must join game before answering")
		}

		// Check for existing answer
		const existingAnswer = await ctx.db
			.query("triviaAnswers")
			.withIndex("by_question_and_participant", (q) =>
				q.eq("questionId", args.questionId).eq("participantId", participant._id),
			)
			.first()

		if (existingAnswer) {
			// Update existing answer
			await ctx.db.patch(existingAnswer._id, {
				selectedOption: args.selectedOption,
			})
			return existingAnswer._id
		}

		// Create new answer
		return ctx.db.insert("triviaAnswers", {
			questionId: args.questionId,
			participantId: participant._id,
			selectedOption: args.selectedOption,
		})
	},
})

// ============================================================================
// Queries
// ============================================================================

export const listLiveGames = publicQuery({
	args: {},
	handler: async (ctx) => {
		return ctx.db
			.query("triviaGames")
			.withIndex("by_status", (q) => q.eq("status", "live"))
			.collect()
	},
})

export const getGame = query({
	args: {
		gameId: v.id("triviaGames"),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx)

		const game = await ctx.db.get(args.gameId)
		if (!game) {
			return null
		}

		const questions = await ctx.db
			.query("triviaQuestions")
			.withIndex("by_game", (q) => q.eq("gameId", args.gameId))
			.collect()

		const isAdmin = user?.role === "admin" && game.createdBy === user._id

		// Filter question data based on role
		const filteredQuestions = questions
			.map((q) => {
				// Admins see everything
				if (isAdmin) {
					return q
				}
				// Users don't see draft questions
				if (q.status === "draft") {
					return null
				}
				// Users don't see correctOption until revealed
				return {
					...q,
					correctOption: q.isAnswerRevealed ? q.correctOption : undefined,
				}
			})
			.filter(Boolean)

		return {
			...game,
			questions: filteredQuestions,
		}
	},
})

export const getLeaderboard = publicQuery({
	args: {
		gameId: v.id("triviaGames"),
	},
	handler: async (ctx, args) => {
		const participants = await ctx.db
			.query("triviaParticipants")
			.withIndex("by_game", (q) => q.eq("gameId", args.gameId))
			.collect()

		// Sort by score descending
		participants.sort((a, b) => b.score - a.score)

		return participants.map((p, index) => ({
			rank: index + 1,
			participantId: p._id,
			userId: p.userId,
			name: p.name,
			score: p.score,
		}))
	},
})

export const getMyGames = adminQuery({
	args: {},
	handler: async (ctx) => {
		return ctx.db
			.query("triviaGames")
			.withIndex("by_created_by", (q) => q.eq("createdBy", ctx.user._id))
			.collect()
	},
})

export const getMyStats = authedQuery({
	args: {
		gameId: v.id("triviaGames"),
	},
	handler: async (ctx, args) => {
		// Get participant record
		const participant = await ctx.db
			.query("triviaParticipants")
			.withIndex("by_game_and_user", (q) =>
				q.eq("gameId", args.gameId).eq("userId", ctx.user._id),
			)
			.first()

		if (!participant) {
			return null
		}

		// Get all answers by this participant
		const answers = await ctx.db
			.query("triviaAnswers")
			.withIndex("by_participant", (q) =>
				q.eq("participantId", participant._id),
			)
			.collect()

		// Get questions to check correctness
		let totalCorrect = 0
		for (const answer of answers) {
			const question = await ctx.db.get(answer.questionId)
			if (
				question?.isAnswerRevealed &&
				answer.selectedOption === question.correctOption
			) {
				totalCorrect++
			}
		}

		// Calculate rank
		const allParticipants = await ctx.db
			.query("triviaParticipants")
			.withIndex("by_game", (q) => q.eq("gameId", args.gameId))
			.collect()

		allParticipants.sort((a, b) => b.score - a.score)
		const rank =
			allParticipants.findIndex((p) => p._id === participant._id) + 1

		return {
			totalAnswered: answers.length,
			totalCorrect,
			score: participant.score,
			rank,
			totalParticipants: allParticipants.length,
		}
	},
})
