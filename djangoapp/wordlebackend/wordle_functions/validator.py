def grade_guess(guess, target_data):
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

def validate_guess(guess, all_valid_guesses):
    if len(guess) != 5:
        return False, f"Guess must be a 5 letter word"
    if guess not in all_valid_guesses: 
        return False, f"Not a valid word"
    return True, ""

def validate_hard_mode(guess, correct_hints, present_hints):
    """
    Validates a guess against previous hints (Hard Mode rules).
    
    correct_hints: A dictionary of index (int) to character (str). 
                   Example: {0: 's', 3: 't'} means 1st letter must be 'S', 4th must be 'T'.
    present_hints: A frequency table (dict) of characters that MUST be included.
                   Example: {'e': 2} means guess must have AT LEAST two 'E' letters.
    """
    if not correct_hints and not present_hints:
        return True, ""

    # Validate green hints
    for index_str, char in correct_hints.items():
        index = int(index_str)
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
            return False, f"Guess must contain at least {required_count} {char.upper()}(s)"

    return True, ""