/**
 * A schema for user's guess
 * @typedef {Object} Guess
 * @property {string} curGuess - User's guess, must be length of 5 and only alphabets
 * @property {string} prevGuess - User previous round's guess,
 * @property {boolean} mode - Hard mode settings
 * @property {string} curDate - Current date in format: YYYY-MM-DD
 */

const BASE_URL = "";

/**
 * @param {...Guess} data - {@link Guess}'s schema
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
    throw new Error(errorResult.error);
  }

  const result = await response.json();
  return result;
}

export { getGradedGuess };
