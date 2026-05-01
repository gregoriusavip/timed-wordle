/**
 * Get client's date based of their timezone and format it
 * @returns {String} Formatted date YYYY-MM-DD
 */
export function getCurrentDate() {
  let currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  currentDate = new Date(currentDate.getTime() - offset * 60 * 1000);

  return currentDate.toISOString().split("T")[0];
}
