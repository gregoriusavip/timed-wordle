import Grid from "./game/Grid";
import "./App.css";
import Countdown from "react-countdown";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { mutateGuess, mutateTimeout } from "./services/utils";

function App() {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [hardMode, setHardMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now);
  const [multiplier, setMultiplier] = useState(1); // Countdown multiplier

  const submitGuess = (data) => {
    if (multiplier < 6) {
      setMultiplier((prevMultiplier) => prevMultiplier + 1);
      setCurrentTime(Date.now);
    }
    setAttempts((prevAttempts) => [
      ...prevAttempts,
      { guess: data.guess, result: data.result },
    ]);
    setGuess("");
  };

  // Random component
  const Completionist = () => <span>Random guess NOW!</span>;

  // Renderer callback with condition
  const renderer = ({ seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>{seconds}</span>;
    }
  };

  const guessMutation = useMutation({
    mutationFn: () => mutateGuess(attempts, guess, hardMode),
    onSuccess: (data) => {
      submitGuess(data);
      guessMutation.reset();
    },
  });

  const timeoutMutation = useMutation({
    mutationFn: () => mutateTimeout(attempts, hardMode),
    onSuccess: (data) => {
      if (guessMutation.isPending) return; // Ignore if they hit Enter just in time
      submitGuess(data);
      timeoutMutation.reset();
    },
  });

  useEffect(() => {
    if (gameStatus !== "playing") return;

    async function handleKeyDown(e) {
      if (e.key === "Enter") {
        guessMutation.mutate();
      } else if (e.key === "Backspace" || e.key === "Delete") {
        setGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < 5) {
        setGuess((prev) => prev + e.key.toUpperCase());
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStatus, guess, guessMutation]);

  return (
    <>
      <Countdown
        date={currentTime + 10000 * multiplier}
        key={multiplier}
        renderer={renderer}
        onComplete={() => {
          if (guessMutation.isPending) return; // Ignore if they hit Enter just in time
          timeoutMutation.mutate();
        }}
      />
      {guessMutation.isError ? <div>{guessMutation.error.message}</div> : null}
      <Grid attempts={attempts} currentGuess={guess} />
    </>
  );
}

export default App;
