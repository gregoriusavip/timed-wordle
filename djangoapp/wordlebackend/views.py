import os
import logging
import hashlib
import re
import random
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)
CACHE_TIMEOUT_INFINITE = 60 * 60 * 24 * 30

def _load_word_file(file_path):
    try:
        with open(file_path, 'r') as f:
            return {line.strip().lower() for line in f if len(line.strip()) == 5}
    except FileNotFoundError:
        logger.error(f"Dataset file not found: {file_path}")
        return set()
    except Exception as e:
        logger.error(f"Error loading dataset {file_path}: {e}")
        return set()

def get_word_sets():
    solutions = cache.get('wordle_solutions')
    guesses = cache.get('wordle_guesses')
    solutions_list = cache.get('wordle_solutions_list')
    
    if solutions is None or guesses is None or solutions_list is None:
        dataset_dir = os.path.join(settings.BASE_DIR.parent, 'Dataset')
        solutions_path = os.path.join(dataset_dir, 'valid_solutions.txt')
        guesses_path = os.path.join(dataset_dir, 'valid_guesses.txt')
        
        solutions = _load_word_file(solutions_path)
        guesses = _load_word_file(guesses_path)
        solutions_list = list(solutions)
            
        cache.set('wordle_solutions', solutions, CACHE_TIMEOUT_INFINITE)
        cache.set('wordle_guesses', guesses, CACHE_TIMEOUT_INFINITE)
        cache.set('wordle_solutions_list', solutions_list, CACHE_TIMEOUT_INFINITE)
        
    return solutions, guesses, solutions_list

def get_daily_target(date_str, solutions_list):
    if not solutions_list:
        return None
        
    cache_key = f"daily_target_{date_str}"
    target_data = cache.get(cache_key)
    
    if not target_data:
        hash_obj = hashlib.md5(date_str.encode('utf-8'))
        hash_int = int(hash_obj.hexdigest(), 16)
        index = hash_int % len(solutions_list)
        word = solutions_list[index]
        
        # Create character frequency table
        freq = {}
        for c in word:
            freq[c] = freq.get(c, 0) + 1
            
        target_data = {"word": word, "freq": freq}
        # Cache for 24 hours to save compute
        cache.set(cache_key, target_data, 60 * 60 * 24)
        
    return target_data

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

    # 1. Validate Green Hints (Exact positions)
    for index, char in correct_hints.items():
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

def get_timeout_guess(all_valid_words, correct_hints, present_hints):
    """
    Quickly selects a random valid word that satisfies current Hard Mode hints.
    Uses Regex for high-performance dictionary filtering.
    """
    if not correct_hints and not present_hints:
        return random.choice(list(all_valid_words))

    # Construct the Regex pattern
    # 1. Positional Green hints (e.g., ^A..E.$)
    pattern_parts = ["."] * 5
    for idx, char in correct_hints.items():
        pattern_parts[idx] = char
    
    # 2. Positive Lookaheads for Yellow frequency hints
    # e.g., (?=(.*E){2})
    lookaheads = ""
    for char, count in present_hints.items():
        lookaheads += f"(?=(.*{char}){{{count}}})"
    
    full_pattern = f"^{lookaheads}{''.join(pattern_parts)}$"
    regex = re.compile(full_pattern)
    
    # Filter the word list
    filtered_words = [word for word in all_valid_words if regex.match(word)]
    
    if not filtered_words:
        # Fallback if somehow no words fit (should not happen with valid hints)
        return random.choice(list(all_valid_words))
        
    return random.choice(filtered_words)
