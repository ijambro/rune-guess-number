import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer";

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

export enum GuessResponse {
  TOO_LOW = -1,
  CORRECT,
  TOO_HIGH,
}

export interface Guess {
  playerId: PlayerId;
  value: number;
  response: GuessResponse;
}

// export interface PlayerGuesses {
//   [playerId: PlayerId]: Guess[];
// }

export interface GameState {
  lastMovePlayerId?: PlayerId;
  lastMovePlayerIndex?: number;
  playerIds: PlayerId[];
  playerGuesses: Guess[];

  minNumber: number;
  maxNumber: number;
  correctNumber: number;
}

function determineGuessResponse(guessValue: number, correctValue: number) {
  if (guessValue === correctValue) return GuessResponse.CORRECT;
  if (guessValue < correctValue) return GuessResponse.TOO_LOW;
  return GuessResponse.TOO_HIGH;
}

type GameActions = {
  submitGuess: (guess: number) => void;
};

const MIN_NUMBER = 15;
const MAX_NUMBER = 45;

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,

  setup: (allPlayerIds) => {
    const rand = Math.random();
    const correctNumber =
      Math.round(rand * (MAX_NUMBER - MIN_NUMBER)) + MIN_NUMBER;

    return {
      lastMovePlayerId: undefined,
      lastMovePlayerIndex: undefined,
      playerIds: allPlayerIds,
      playerGuesses: [],

      minNumber: MIN_NUMBER,
      maxNumber: MAX_NUMBER,
      correctNumber,
    };
  },
  actions: {
    submitGuess: (guess, { game, playerId, allPlayerIds }) => {
      console.log("Logic: submitGuess: player", playerId, "guessed", guess);

      // Make sure it is their turn
      if (playerId === game.lastMovePlayerId) {
        throw Rune.invalidAction();
      }

      // Determine which user submitted this guess
      game.lastMovePlayerId = playerId;
      // TODO: Also set lastMovePlayerIndex

      const response = determineGuessResponse(guess, game.correctNumber);
      console.log("Guess response", response);
      game.playerGuesses.push({ playerId, value: guess, response });

      // if (response === GuessResponse.CORRECT) {
      // TODO: Fill this in for multiplayer, not just 1 and 2:
      //  Init all to LOST, then set lastMovePlayerId to WON
      // const [player1, player2] = allPlayerIds;
      // Rune.gameOver({
      //   players: {
      //     [player1]: game.lastMovePlayerId === player1 ? "WON" : "LOST",
      //     [player2]: game.lastMovePlayerId === player2 ? "WON" : "LOST",
      //   },
      // });
      // }
    },
  },
});
