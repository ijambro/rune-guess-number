import { GameState } from "./logic";
import { PlayerId } from "rune-games-sdk";

interface Props {
  game: GameState;
  yourPlayerId: PlayerId;
}

export default function PlayersSection(props: Props) {
  const { game, yourPlayerId } = props;

  return (
    <ul id="playersSection">
      {game.playerIds.map((playerId, index) => {
        const player = Rune.getPlayerInfo(playerId);

        return (
          <li
            key={playerId}
            data-player={index.toString()}
            data-your-turn={String(
              game.playerIds[index] !== game.lastMovePlayerId
            )}
          >
            <img src={player.avatarUrl} />
            <span>
              {player.displayName}
              {player.playerId === yourPlayerId && (
                <span>
                  <br />
                  (You)
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
