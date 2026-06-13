import * as z from "zod";
import * as Types from "../types";

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
  .refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date value" },
  );

/** @type {Types.Guess} - {@link Types.Guess}'s schema */
export const GuessSchema = z.object({
  curGuess: z
    .string("Guess has to be a letter")
    .length(5, "Not enough letters"),
  mode: z.boolean().default(false),
  curDate: DateSchema,
  prevGuess: z.string().default(""),
});

/** @type {Types.TimeoutGuess} - {@link Types.TimeoutGuess}'s schema */
export const TimeoutGuessSchema = z.object({
  mode: z.boolean().default(false),
  curDate: DateSchema,
  prevGuess: z.string().default(""),
});

const StatusSchema = z.enum(["absent", "correct", "present"]);

const LetterObjectSchema = z.object({
  letter: z.string().length(1), // exactly 1 character
  status: StatusSchema,
});

const AttemptSchema = z.object({
  guess: z.string().length(5),
  result: z.array(LetterObjectSchema).length(5),
});

/** @type {Types.RevealWord} - {@link Types.RevealWord}'s schema */
export const RevealWordSchema = z.object({
  attempts: z.array(AttemptSchema).length(6),
  curDate: DateSchema,
});
