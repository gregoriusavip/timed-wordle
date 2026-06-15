// COMPONENTS
import Grid from "../game/Grid";
import Keyboard from "../ui/Keyboard";
import Timer from "../ui/Timer";

// HOOKS
import Countdown from "react-countdown";
import { useGame } from "../../hooks/useGame";

export default function Game() {
  const {
    guess,
    attempts,
    gameStatus,
    solution,
    targetTime,
    multiplier,
    error,
    keyboardStatus,
    showCountdown,
    handleInput,
    handleTimeout,
  } = useGame();

  // Random component
  const Completionist = () => <span>Random guess NOW!</span>;

  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }) => {
    if (gameStatus !== "playing") {
      return null;
    }
    if (completed) {
      return <Completionist />;
    } else {
      // Render a countdown timer
      return <Timer minutes={minutes} seconds={seconds} />;
    }
  };

  return (
    <>
      {gameStatus === "gameWon"
        ? `You Won. The word is: ${solution}`
        : gameStatus === "gameOver"
          ? `You Lost. The word is: ${solution}`
          : null}
      {showCountdown ? (
        <Countdown
          date={targetTime}
          key={multiplier}
          renderer={renderer}
          onComplete={handleTimeout}
        />
      ) : null}
      {error}
      <Grid attempts={attempts} currentGuess={guess} />
      <Keyboard keyboardStatus={keyboardStatus} handleInput={handleInput} />
    </>
  );
}
