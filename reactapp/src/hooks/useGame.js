import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { mutateGuess, mutateSolution, mutateTimeout } from "../services/utils";
import { checkWin } from "../services/utils";

export function useGame() {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [hardMode, setHardMode] = useState(false);
  const [targetTime, setTargetTime] = useState(() => Date.now() + 10000);
  const [multiplier, setMultiplier] = useState(1); // Countdown multiplier
  const [solution, setSolution] = useState("");

  const solutionMutation = useMutation({
    mutationFn: (curAttempts) => mutateSolution(curAttempts),
    onSuccess: (data) => {
      setSolution(data.result);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const guessMutation = useMutation({
    mutationFn: () => mutateGuess(attempts, guess, hardMode),
    onSuccess: (data) => {
      submitGuess(data.guess, data.result);
      guessMutation.reset();
    },
  });

  const timeoutMutation = useMutation({
    mutationFn: () => mutateTimeout(attempts, hardMode),
    onSuccess: (data) => {
      if (guessMutation.isPending) return; // Ignore if they hit Enter just in time
      submitGuess(data.guess, data.result);
      timeoutMutation.reset();
    },
  });

  const handleTimeout = () => {
    if (guessMutation.isPending) return; // Ignore if they hit Enter just in time
    timeoutMutation.mutate();
  };

  const submitGuess = (guess, result) => {
    if (gameStatus !== "playing") return;

    if (multiplier < 6) {
      const nextMultiplier = multiplier + 1;

      setMultiplier(nextMultiplier);
      setTargetTime(() => Date.now() + 10000 * nextMultiplier);
    }

    const newAttempt = { guess: guess, result: result };
    const nextAttempts = [...attempts, newAttempt];

    if (checkWin(result)) {
      setGameStatus("gameWon");
      setSolution(guess);
    } else if (nextAttempts.length > 5) {
      setGameStatus("gameOver");
      solutionMutation.mutate(nextAttempts);
    }

    setAttempts(nextAttempts);
    setGuess("");
  };

  const handleInput = useCallback(
    (key) => {
      if (gameStatus !== "playing") return;

      if (key === "Enter") {
        if (guess.length === 5) {
          guessMutation.mutate();
        }
      } else if (key === "Backspace" || key === "Delete") {
        setGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(key) && guess.length < 5) {
        setGuess((prev) => prev + key.toUpperCase());
      }
    },
    [guess, gameStatus, guessMutation],
  );

  useEffect(() => {
    const onKeyDown = (e) => handleInput(e.key);

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleInput]);

  return {
    // State for rendering
    guess,
    attempts,
    gameStatus,
    solution,
    targetTime,
    multiplier,
    error: guessMutation.error?.message,

    // Actions
    handleInput,
    handleTimeout,
  };
}
