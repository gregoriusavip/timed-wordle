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
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [hardMode, setHardMode] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      const data = {
        curGuess: guess,
        prevGuess: guesses.at(-1) ?? "",
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
      setGuesses((prevGuesses) => [...prevGuesses, guess]);
      setGuess("");
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
      <Grid guesses={guesses} currentGuess={guess}></Grid>
    </>
  );
}

export default App;
