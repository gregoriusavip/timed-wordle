import Grid from "./components/game/Grid";
import { Keyboard } from "./components/ui/Keyboard";
import "./App.css";
import Countdown from "react-countdown";
import { useGame } from "./hooks/useGame";

function App() {
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
  const renderer = ({ seconds, completed }) => {
    if (gameStatus !== "playing") {
      return null;
    }
    if (completed) {
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>{seconds}</span>;
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

export default App;
