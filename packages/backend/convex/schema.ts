import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	triviaGames: defineTable({
		name: v.string(),
		status: v.union(
			v.literal("draft"),
			v.literal("live"),
			v.literal("ended"),
		),
		createdBy: v.string(), // user ID from Better Auth component (string due to component boundary)
	})
		.index("by_status", ["status"])
		.index("by_created_by", ["createdBy"]),

	triviaQuestions: defineTable({
		gameId: v.id("triviaGames"),
		text: v.string(),
		options: v.array(v.string()),
		status: v.union(
			v.literal("draft"),
			v.literal("live"),
			v.literal("closed"),
		),
		correctOption: v.optional(v.number()),
		isAnswerRevealed: v.boolean(),
		baseScore: v.number(),
		multiplier: v.number(),
	})
		.index("by_game", ["gameId"])
		.index("by_game_and_status", ["gameId", "status"]),

	triviaParticipants: defineTable({
		gameId: v.id("triviaGames"),
		userId: v.string(), // user ID from Better Auth component (string due to component boundary)
		name: v.string(), // denormalized from user for leaderboard display
		score: v.number(),
	})
		.index("by_game", ["gameId"])
		.index("by_user", ["userId"])
		.index("by_game_and_user", ["gameId", "userId"])
		.index("by_game_and_score", ["gameId", "score"]),

	triviaAnswers: defineTable({
		questionId: v.id("triviaQuestions"),
		participantId: v.id("triviaParticipants"),
		selectedOption: v.number(),
	})
		.index("by_question", ["questionId"])
		.index("by_participant", ["participantId"])
		.index("by_question_and_participant", ["questionId", "participantId"]),
})
