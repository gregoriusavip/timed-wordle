import * as Types from "../types";

const BASE_URL = "/api";

/**
 * A template to fetch data from the backend
 * @param {string} body - A stringify JSON of the data that is going to be sent to the backend
 * @param {string} targetURL - Backend url
 * @throws - Throws an error if response is not OK (status code != 200-299)
 * @returns {Promise<Object>} - Returns the JSON of the data result
 */
async function fetchAPI(body, targetURL) {
  const response = await fetch(targetURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.error || "Server Error");
  }

  const result = await response.json();
  return result;
}

/**
 * @param {Types.Guess} data - {@link Types.Guess} object schema
 * @throws - Throws an error if fetchAPI gets a bad response
 * @returns {Promise<Object>} - Returns the JSON with hints based of the guess
 */
export async function fetchGradedGuess(data) {
  const url = `${BASE_URL}/guess`;
  const body = JSON.stringify({
    guess: data.curGuess,
    date: data.curDate,
    hard_mode: data.mode,
    prev_guess: data.prevGuess,
  });
  return fetchAPI(body, url);
}

/**
 * Call the backend to get a random valid guess
 * @param {Types.TimeoutGuess} data - {@link Types.TimeoutGuess} object schema
 * @throws - Throws an error if fetchAPI gets a bad response
 * @returns {Promise<Object>} - Returns the JSON with the random guess
 */
export async function fetchTimeoutGuess(data) {
  const url = `${BASE_URL}/timeout`;
  const body = JSON.stringify({
    date: data.curDate,
    hard_mode: data.mode,
    prev_guess: data.prevGuess,
  });
  return fetchAPI(body, url);
}
