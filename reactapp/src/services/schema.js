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
