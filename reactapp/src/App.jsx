import Grid from "./game/Grid";
import "./App.css";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { getGradedGuess } from "./services/api";
import { getCurrentDate } from "./services/utils";
import { GuessSchema } from "./services/schema";
import * as z from "zod";

function App() {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [hardMode, setHardMode] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      const prevGuess = attempts.length > 0 ? attempts.at(-1)[0] : "";
      const data = {
        curGuess: guess,
        prevGuess: prevGuess,
        mode: hardMode,
        curDate: getCurrentDate(),
      };
      try {
        const validGuess = GuessSchema.parse(data);
        return getGradedGuess(validGuess);
      } catch (e) {
        if (e instanceof z.ZodError) {
          // Schema validation error
          throw new Error(e.issues[0].message);
        }
        // API error
        throw new Error(e.message);
      }
    },
    onSuccess: (data) => {
      setAttempts((prevAttempts) => [...prevAttempts, [guess, data.result]]);
      setGuess("");
      mutation.reset();
    },
  });

  useEffect(() => {
    if (gameStatus !== "playing") return;

    async function handleKeyDown(e) {
      if (e.key === "Enter") {
        mutation.mutate();
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
  }, [gameStatus, guess, mutation]);

  return (
    <>
      {mutation.isError ? <div>{mutation.error.message}</div> : null}
      <Grid
        attempts={attempts}
        currentGuess={guess}
        currentResult={mutation.isSuccess ? mutation.data.result : null}
      />
    </>
  );
}

export default App;
