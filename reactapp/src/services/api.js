import * as Types from "../types";

const BASE_URL = "";

/**
 * @param {...Types.Guess} data - {@link Types.Guess} object schema
 * @throws - Throws an error if response is not OK (status code != 200-299)
 * @returns {Promise<Object>} - Returns the JSON with hints based of the guess
 */
async function getGradedGuess(data) {
  const url = `${BASE_URL}/api/guess`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guess: data.curGuess,
      date: data.curDate,
      hard_mode: data.mode,
      prev_guess: data.prevGuess,
    }),
  });
  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.error || "Server Error");
  }

  const result = await response.json();
  return result;
}

export { getGradedGuess };
