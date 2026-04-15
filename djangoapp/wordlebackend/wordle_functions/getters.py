import os
import logging
import hashlib
import re
import random
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

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

    dataset_dir = os.path.join(settings.BASE_DIR.parent, 'Dataset')
    solutions_path = os.path.join(dataset_dir, 'valid_solutions.txt')
    guesses_path = os.path.join(dataset_dir, 'valid_guesses.txt')

    if solutions is None:
        solutions = _load_word_file(solutions_path)
        cache.set('wordle_solutions', solutions)
    
    if guesses is None:
        guesses = _load_word_file(guesses_path)
        cache.set('wordle_guesses', guesses)
    
    if solutions_list is None:
        solutions_list = list(solutions)
        solutions_list.sort()
        cache.set('wordle_solutions_list', solutions_list)
        
    return guesses, solutions_list

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
    for idx_str, char in correct_hints.items():
        pattern_parts[int(idx_str)] = char.lower()
    
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