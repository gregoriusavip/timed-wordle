import re
import random
from wordlebackend.logic.dictionary import get_daily_target


def get_graded_guess(guess, target_data):
    """
    Grades a guess against the target word using a two-pass algorithm.
    target_data: Dictionary containing 'word' and 'freq' (char frequency table).
    """
    target_word = target_data["word"]
    # Copy frequency table so we don't mutate the cached version
    target_freq = target_data["freq"].copy()

    result = [{"letter": c, "status": "absent"} for c in guess]

    # Pass 1: exact matches (Green)
    for i in range(5):
        if guess[i] == target_word[i]:
            result[i]["status"] = "correct"
            target_freq[guess[i]] -= 1

    # Pass 2: misplaced matches (Yellow) using frequency table
    for i in range(5):
        if result[i]["status"] == "correct":
            continue

        # If the letter exists in the target and hasn't been fully accounted for
        if target_freq.get(guess[i], 0) > 0:
            result[i]["status"] = "present"
            target_freq[guess[i]] -= 1

    return result


def get_hints(guess, date_str):
    # Use for hard mode. Guess could be empty but MUST be 5 letter word otherwise.
    correct_hints, present_hints = [], {}
    if guess:
        target_data = get_daily_target(date_str)
        if not target_data:
            return [], {}
        graded_guess = get_graded_guess(guess, target_data)

        for idx, char_item in enumerate(graded_guess):
            if char_item["status"] == "present":
                present_hints[char_item["letter"]] = (
                    present_hints.get(char_item["letter"], 0) + 1
                )
            elif char_item["status"] == "correct":
                correct_hints.append((char_item["letter"], idx))

    return correct_hints, present_hints


def get_timeout_guess(all_valid_words, correct_hints=None, present_hints=None):
    """
    Quickly selects a random valid word that satisfies current Hard Mode hints.
    Uses Regex for high-performance dictionary filtering.
    """
    if not correct_hints and not present_hints:
        return random.choice(list(all_valid_words))

    # Construct the Regex pattern
    # Green hints
    pattern_parts = ["."] * 5
    for hint in correct_hints:
        pattern_parts[hint[1]] = hint[0]

    # Yellow hints
    lookaheads = ""
    for char, count in present_hints.items():
        lookaheads += f"(?=(.*{char.lower()}){{{count}}})"

    full_pattern = f"^{lookaheads}{''.join(pattern_parts)}$"
    regex = re.compile(full_pattern)

    # Filter the word list
    filtered_words = [word for word in all_valid_words if regex.match(word)]

    if not filtered_words:
        return random.choice(list(all_valid_words))

    return random.choice(filtered_words)
