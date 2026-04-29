const BASE_URL = "";

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

/**
 * @param {String} curGuess 5 length word of the current guess
 * @param {Boolean} [hardMode=false]
 * @param {String} [prevGuess=""] 5 length word of the previous guess, could be an empty string
 * @throws Throws an error if response is not OK (status code != 200-299)
 * @returns {Promise<Object>} Returns the JSON with hints based of the guess
 */
async function getGradedGuess(curGuess, hardMode = false, prevGuess = "") {
  const url = `${BASE_URL}/api/guess`;
  const currentDate = getCurrentDate();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guess: curGuess,
      date: currentDate,
      hard_mode: hardMode,
      prev_guess: prevGuess,
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
