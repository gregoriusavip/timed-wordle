import { fetchGradedGuess, fetchSolution, fetchTimeoutGuess } from "./api";
import { GuessSchema, TimeoutGuessSchema, RevealWordSchema } from "./schema";
import { getCurrentDate } from "./utils";
import * as z from "zod";

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
