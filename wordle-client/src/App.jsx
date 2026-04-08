import Grid from "./game/Grid";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");

  function validateWord() {
    // TODO: check if the word is valid
    return true;
  }

  function submitGuess() {
    if (validateWord()) {
      setGuesses([...guesses, guess]);
      setGuess("");
    } else {
      // Do some animation and show some pop up that the guess is invalid for x reason
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      submitGuess();
    } else if (e.key === "Backspace" || e.key === "Delete") {
      setGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < 5) {
      setGuess((prev) => prev + e.key.toUpperCase());
    }
  }

  useEffect(() => {
    if (gameStatus !== "playing") return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess, gameStatus]);

  return <Grid guesses={guesses} currentGuess={guess}></Grid>;
}

export default App;
