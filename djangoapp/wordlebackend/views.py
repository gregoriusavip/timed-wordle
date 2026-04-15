import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from wordlebackend.wordle_functions.getters import get_word_sets, get_daily_target, get_timeout_guess
from wordlebackend.wordle_functions.validator import grade_guess, validate_guess, validate_hard_mode

@csrf_exempt
@require_POST
def guess_word(request):
    """
    Stateless endpoint to grade a Wordle guess.
    Handles manual guesses and Hard Mode validation.
    """
    try:
        body = json.loads(request.body)
        date_str = body.get('date')
        guess = body.get('guess', '').lower()
        hard_mode = body.get('hard_mode', False)
        correct_hints = body.get('correct_hints', {})
        present_hints = body.get('present_hints', {})
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
        
    if not date_str:
        return JsonResponse({"error": "Missing date"}, status=400)
        
    all_valid_guesses, solutions_list = get_word_sets()
    target_data = get_daily_target(date_str, solutions_list)
    
    if not target_data:
        return JsonResponse({"error": "Server error: No dictionary loaded"}, status=500)
        
    valid, reason = validate_guess(guess, all_valid_guesses)
    if not valid:
        return JsonResponse({"error": reason}, status=400)
        
    if hard_mode:
        valid, reason = validate_hard_mode(guess, correct_hints, present_hints)
        if not valid:
            return JsonResponse({"error": reason}, status=400)
                
    result = grade_guess(guess, target_data)
    
    return JsonResponse({"result": result})

@csrf_exempt
@require_POST
def timeout_guess(request):
    """
    Stateless endpoint to provide an auto-guess when a round timer expires.
    Optionally respects Hard Mode hints.
    """
    try:
        body = json.loads(request.body)
        date_str = body.get('date')
        hard_mode = body.get('hard_mode', False)
        correct_hints = body.get('correct_hints', {})
        present_hints = body.get('present_hints', {})
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
        
    if not date_str:
        return JsonResponse({"error": "Missing date"}, status=400)
        
    all_valid_guesses, solutions_list = get_word_sets()
    target_data = get_daily_target(date_str, solutions_list)
    
    if not target_data:
        return JsonResponse({"error": "Server error: No dictionary loaded"}, status=500)
    
    if hard_mode:
        guess = get_timeout_guess(all_valid_guesses, correct_hints, present_hints)
    else:
        guess = get_timeout_guess(all_valid_guesses)
    
    result = grade_guess(guess, target_data)
    
    return JsonResponse({
        "guess": guess,
        "result": result
    })
