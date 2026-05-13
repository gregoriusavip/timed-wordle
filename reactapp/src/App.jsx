import Grid from "./components/game/Grid";
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
    handleInput,
    handleTimeout,
  } = useGame();
  // Random component
  const Completionist = () => <span>Random guess NOW!</span>;

  // Renderer callback with condition
  const renderer = ({ seconds, completed }) => {
    if (gameStatus !== "playing") return null; // Remove timer
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
      <Countdown
        date={targetTime}
        key={multiplier}
        renderer={renderer}
        onComplete={handleTimeout}
      />
      {error}
      <Grid attempts={attempts} currentGuess={guess} />
    </>
  );
}

export default App;
