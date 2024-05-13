import { PlayerId } from "rune-games-sdk";
import { GameState, Guess, GuessResponse } from "./logic";

interface Props {
  game: GameState;
  yourPlayerId: PlayerId;
}

export default function GuessesSection(props: Props) {
  const { game, yourPlayerId } = props;

  function showLastGuess() {
    if (game?.playerGuesses?.length > 0) {
      const lastGuess = game.playerGuesses[game.playerGuesses.length - 1];
      return showGuess(lastGuess);
    }
  }

  function showAllGuesses() {
    return game.playerGuesses.map(showGuess);
  }

  function showGuess(g: Guess) {
    let playerDisplayName = "You";
    if (g.playerId !== yourPlayerId) {
      const player = Rune.getPlayerInfo(g.playerId);
      playerDisplayName = player.displayName;
    }

    const desc = `${playerDisplayName} guessed ${
      g?.value
    } ${guessResponseToEmoji(g?.response)}`;

    return <div>{desc}</div>;
  }

  return <div id="guessesSection">{showAllGuesses()}</div>;
}

function guessResponseToEmoji(r?: GuessResponse): string {
  switch (r) {
    case GuessResponse.CORRECT:
      return "✅ 🎉";
    case GuessResponse.TOO_LOW:
      return "👆";
    case GuessResponse.TOO_HIGH:
      return "👇";
    default:
      return "❌";
  }
}
