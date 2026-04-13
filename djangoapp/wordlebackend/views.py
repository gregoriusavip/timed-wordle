import os
import logging
import hashlib
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

def get_daily_word(date_str, solutions_list):
    if not solutions_list:
        return None
    hash_obj = hashlib.md5(date_str.encode('utf-8'))
    hash_int = int(hash_obj.hexdigest(), 16)
    index = hash_int % len(solutions_list)
    return solutions_list[index]
