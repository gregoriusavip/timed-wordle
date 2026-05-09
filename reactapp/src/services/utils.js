import { GuessSchema, TimeoutGuessSchema, RevealWordSchema } from "./schema";
import { fetchGradedGuess, fetchSolution, fetchTimeoutGuess } from "./api";
import * as z from "zod";

/**
 * Get client's date based of their timezone and format it
 * @returns {String} Formatted date YYYY-MM-DD
 */
function getCurrentDate() {
  let currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  currentDate = new Date(currentDate.getTime() - offset * 60 * 1000);

  return currentDate.toISOString().split("T")[0];
}

export function mutateGuess(attempts, guess, hardMode) {
  const prevGuess = attempts.length > 0 ? attempts.at(-1)[0] : "";
  const body = {
    curGuess: guess,
    prevGuess: prevGuess,
    mode: hardMode,
    curDate: getCurrentDate(),
  };
  try {
    const validGuess = GuessSchema.parse(body);
    return fetchGradedGuess(validGuess);
  } catch (e) {
    if (e instanceof z.ZodError) {
      // Schema validation error
      throw new Error(e.issues[0].message);
    }
    // API error
    throw new Error(e.message);
  }
}

export function mutateTimeout(attempts, hardMode) {
  const prevGuess = attempts.length > 0 ? attempts.at(-1)[0] : "";
  const body = {
    prevGuess: prevGuess,
    mode: hardMode,
    curDate: getCurrentDate(),
  };
  try {
    const validTimeout = TimeoutGuessSchema.parse(body);
    return fetchTimeoutGuess(validTimeout);
  } catch (e) {
    if (e instanceof z.ZodError) {
      // Schema validation error
      throw new Error(e.issues[0].message);
    }
    // API error
    throw new Error(e.message);
  }
}

export function mutateSolution(attempts) {
  const body = {
    attempts: attempts,
    curDate: getCurrentDate(),
  };
  try {
    const validReveal = RevealWordSchema.parse(body);
    return fetchSolution(validReveal);
  } catch (e) {
    if (e instanceof z.ZodError) {
      // Schema validation error
      throw new Error(e.issues[0].message);
    }
    // API error
    throw new Error(e.message);
  }
}

export function checkWin(results) {
  for (const result of results) {
    if (result.status !== "correct") return false;
  }
  return true;
}
