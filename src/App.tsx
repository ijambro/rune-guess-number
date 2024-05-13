import "./styles.css";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { PlayerId } from "rune-games-sdk/multiplayer";

import selectSoundAudio from "./assets/select.wav";
import { GameState, GuessResponse } from "./logic.ts";
import PlayersSection from "./PlayersSection.tsx";
import GuessesSection from "./GuessesSection.tsx";

const selectSound = new Audio(selectSoundAudio);

export default function App() {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  const [guess, setGuess] = useState<string>();

  console.log(
    "App: Rendering: Game state correctNumber",
    game?.correctNumber,
    "num guesses",
    game?.playerGuesses.length
  );

  useEffect(() => {
    console.log("App: Initializing");

    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);
        setGuess(undefined);

        if (action && action.name === "submitGuess") selectSound.play();
      },
    });
  }, []);

  if (!game || !yourPlayerId) {
    return <div>Loading...</div>;
  }

  // Else, game is defined.  Let's render it!

  function handleGuessChange(event: ChangeEvent<HTMLInputElement>) {
    const guessStr = event.target.value;
    console.log("Changing guess!", guessStr);
    setGuess(guessStr);
  }

  function handleGuessSubmit(event: MouseEvent<HTMLButtonElement>) {
    console.log("Submitting guess!", guess);
    event.preventDefault();

    if (guess) {
      const guessInt = parseInt(guess);
      console.log("App: guessing", guessInt);
      Rune.actions.submitGuess(guessInt);
      setGuess("");
    }
  }

  return (
    <>
      <div id="board">
        <div id="title">Guess the Number!</div>

        <div>
          - Between {game.minNumber} and {game.maxNumber} -
        </div>

        <input
          type="number"
          min={0}
          max={99}
          value={guess}
          onChange={(evt) => handleGuessChange(evt)}
        />

        <button id="submitGuess" onClick={(evt) => handleGuessSubmit(evt)}>
          Guess!
        </button>
      </div>

      <GuessesSection game={game} yourPlayerId={yourPlayerId} />

      <PlayersSection game={game} yourPlayerId={yourPlayerId} />
    </>
  );
}
