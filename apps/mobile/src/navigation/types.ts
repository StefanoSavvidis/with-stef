import type { Id } from "@with-stef/backend/convex/_generated/dataModel"

export type TriviaStackParamList = {
	Home: undefined
	Game: { gameId: Id<"triviaGames"> }
}

export type RootTabParamList = {
	Trivia: undefined
	Account: undefined
	Admin: undefined
}
