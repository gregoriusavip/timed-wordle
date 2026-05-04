/**
 * A schema for user's guess
 * @typedef {Object} Guess
 * @property {string} curGuess - User's guess, must be length of 5 and only alphabets
 * @property {string} prevGuess - User previous round's guess, should be set if hard mode is on. Default to ""
 * @property {boolean} mode - Hard mode settings. Default to false
 * @property {string} curDate - Current date in string format: YYYY-MM-DD
 */

/**
 * A schema for getting a timeout guess
 * @typedef {Object} TimeoutGuess
 * @property {string} prevGuess - User previous round's guess, should be set if hard mode is on. Default to ""
 * @property {boolean} mode - Hard mode settings. Default to false
 * @property {string} curDate - Current date in string format: YYYY-MM-DD
 */

export const Types = {};
