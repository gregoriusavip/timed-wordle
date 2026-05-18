import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { mutateGuess, mutateSolution, mutateTimeout } from "../services/utils";
import { checkWin } from "../services/utils";

const STATUS_PRIO = {
  unread: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export function useGame() {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [hardMode, setHardMode] = useState(false);
  const [targetTime, setTargetTime] = useState(() => Date.now() + 10000);
  const [multiplier, setMultiplier] = useState(1); // Countdown multiplier
  const [solution, setSolution] = useState("");
  const [showCountdown, setShowCountdown] = useState(true);
  const [keyboardStatus, setKeyboardStatus] = useState(() =>
    Array(26).fill("unread"),
  );

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
    if (guessMutation.isPending || gameStatus !== "playing") return; // Ignore if they hit Enter just in time
    timeoutMutation.mutate();
  };

  const updateKeyboardStatus = (attempt) => {
    const guess = attempt.guess.toLowerCase();
    const result = attempt.result;

    const nextStatus = [...keyboardStatus];
    for (let i = 0; i < 5; i++) {
      const index = guess.charCodeAt(i) - 97;
      const prevResult = nextStatus[index];
      const nextResult = result[i].status;
      if (STATUS_PRIO[prevResult] < STATUS_PRIO[nextResult]) {
        nextStatus[index] = nextResult;
      }
    }

    setKeyboardStatus(nextStatus);
  };

  const updateGameStatus = (guess, result, nextAttempts) => {
    const isWin = checkWin(result);
    const isLoss = nextAttempts.length > 5;

    if (isWin) {
      setGameStatus("gameWon");
      setSolution(guess);
    } else if (isLoss) {
      setGameStatus("gameOver");
      solutionMutation.mutate(nextAttempts);
    }

    if (isWin || isLoss) {
      setShowCountdown(false);
    }
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

    updateKeyboardStatus(newAttempt);
    updateGameStatus(guess, result, nextAttempts);

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
    keyboardStatus,
    showCountdown,
    // Actions
    handleInput,
    handleTimeout,
  };
}
