from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from wordlebackend.logic.engine import get_timeout_guess, get_graded_guess
from wordlebackend.logic.rules import validate_guess, validate_hard_mode
from wordlebackend.logic.parsing import get_base_context, parse_game_request

@csrf_exempt
@require_POST
def guess_word(request):
    """
    Stateless endpoint to grade a Wordle guess.
    Handles manual guesses and Hard Mode validation.
    """
    context, error = parse_game_request(request)
    if error:
        return error

    valid, reason = validate_guess(context["guess"], context["all_valid_guesses"])
    if not valid:
        return JsonResponse({"error": reason}, status=400)

    if context["hard_mode"]:
        valid, reason = validate_hard_mode(
            context["guess"], context["correct_hints"], context["present_hints"]
        )
        if not valid:
            return JsonResponse({"error": reason}, status=400)

    result = get_graded_guess(context["guess"], context["target_data"])

    return JsonResponse({"guess": context["guess"], "result": result})


@csrf_exempt
@require_POST
def timeout_guess(request):
    """
    Stateless endpoint to provide an auto-guess when a round timer expires.
    Optionally respects Hard Mode hints.
    """
    context, error = parse_game_request(request)
    if error:
        return error

    if context["hard_mode"]:
        guess = get_timeout_guess(
            context["all_valid_guesses"],
            context["correct_hints"],
            context["present_hints"],
        )
    else:
        guess = get_timeout_guess(context["all_valid_guesses"])

    result = get_graded_guess(guess, context["target_data"])

    return JsonResponse({"guess": guess, "result": result})


@csrf_exempt
@require_POST
def restore_session(request):
    """
    Stateless endpoint to grade an array of guesses for UI hydration.
    """
    body, target_data, error = get_base_context(request)
    if error:
        return error

    guesses = body.get("guesses", [])
    if not isinstance(guesses, list):
        return JsonResponse({"error": "guesses must be a list"}, status=400)

    # Validation: Ensure all items are 5-letter strings
    for i, g in enumerate(guesses):
        if not isinstance(g, str) or len(g) != 5:
            return JsonResponse(
                {"error": f"Invalid guess at index {i}: must be a 5-letter string"},
                status=400,
            )

    results = [get_graded_guess(g.lower(), target_data) for g in guesses]

    return JsonResponse({"results": results})

@csrf_exempt
@require_POST
def reveal_word(request):
    """
    Verify if a client has finished the game.
    Returns the solution.
    """
    body, target_data, error = get_base_context(request)
    if error:
        return error
    
    attempts = body.get("attempts")
    if not isinstance(attempts, list):
        return JsonResponse({"error": "failed to verify"}, status=400)
    
    if len(attempts) != 6:
        return JsonResponse({"error": "failed to verify"}, status=400)

    # Validation: Ensure all items are 5-letter strings
    for attempt in attempts:
        word_string = attempt["guess"]
        letter_results = attempt["result"]

        # Validation: Is it a 5-letter string and a list of 5 results?
        if not isinstance(word_string, str) or len(word_string) != 5:
            return JsonResponse({"error": "Word format invalid"}, status=400)
        
        if not isinstance(letter_results, list) or len(letter_results) != 5:
            return JsonResponse({"error": "Result format invalid"}, status=400)
        
        for i in range(5):
            char_data = letter_results[i]
            
            if char_data['letter'] != word_string[i]:
                return JsonResponse({"error": "Letter mismatch"}, status=400)
            
            if char_data['status'] not in ["present", "absent", "correct"]:
                return JsonResponse({"error": "Invalid status value"}, status=400)
        
    return JsonResponse({"results": target_data["word"]})
