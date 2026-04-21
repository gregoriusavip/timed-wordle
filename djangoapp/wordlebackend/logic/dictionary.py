import os
import logging
import hashlib
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

def get_solutions():
    solutions = cache.get('wordle_solutions')
    solutions_list = cache.get('wordle_solutions_list')
    dataset_dir = os.path.join(settings.BASE_DIR.parent, 'Dataset')

    if solutions is None:
        solutions_path = os.path.join(dataset_dir, 'valid_solutions.txt')
        solutions = _load_word_file(solutions_path)
        cache.set('wordle_solutions', solutions)
    
    if solutions_list is None:
        solutions_list = list(solutions)
        solutions_list.sort()
        cache.set('wordle_solutions_list', solutions_list)
        
    return solutions_list

def get_guesses():
    guesses = cache.get('wordle_guesses')

    if guesses is None:
        dataset_dir = os.path.join(settings.BASE_DIR.parent, 'Dataset')
        guesses_path = os.path.join(dataset_dir, 'valid_guesses.txt')
        guesses = _load_word_file(guesses_path)
        cache.set('wordle_guesses', guesses)
    
    return guesses

def get_daily_target(date_str):
    solutions_list = get_solutions()

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
