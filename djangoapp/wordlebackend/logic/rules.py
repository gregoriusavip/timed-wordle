def validate_guess(guess, all_valid_guesses):
    if len(guess) != 5:
        return False, f"Guess must be a 5 letter word"
    if guess not in all_valid_guesses:
        return False, f"Not a valid word"
    return True, ""


def validate_hard_mode(guess, correct_hints, present_hints):
    """
    Validates a guess against previous hints (Hard Mode rules).

    correct_hints: A list of tuples. Index 0 of the tuple is the letter, and index 1 is the location
                   Example: [('s', 0), ('t', 3)] means 1st letter must be 'S', 4th must be 'T'.
    present_hints: A frequency table (dict) of characters that MUST be included.
                   Example: {'e': 2} means guess must have AT LEAST two 'E' letters.
    """
    if not correct_hints and not present_hints:
        return True, ""

    # Validate green hints
    for char, index in correct_hints:
        if guess[index] != char:
            return False, f"Position {index + 1} must be {char.upper()}"

    # 2. Validate Yellow Hints (Required frequency)
    # Count letters in the current guess to check against required minimums
    guess_freq = {}
    for char in guess:
        guess_freq[char] = guess_freq.get(char, 0) + 1

    for char, required_count in present_hints.items():
        current_count = guess_freq.get(char, 0)
        if current_count < required_count:
            return (
                False,
                f"Guess must contain at least {required_count} {char.upper()}(s)",
            )

    return True, ""
