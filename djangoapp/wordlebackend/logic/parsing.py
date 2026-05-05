import json
from datetime import datetime
from django.http import JsonResponse
from wordlebackend.logic.dictionary import get_daily_target, get_guesses
from wordlebackend.logic.engine import get_hints


def get_base_context(request):
    """
    Generic validator for all game-related requests.
    Checks JSON, Date type/format, and Target Word presence.
    Returns (body, target_data, error_response).
    """
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return None, None, JsonResponse({"error": "Invalid JSON"}, status=400)

    date_str = body.get("date")
    if not isinstance(date_str, str):
        return None, None, JsonResponse({"error": "Date must be a string"}, status=400)

    # Validate YYYY-MM-DD format
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return (
            None,
            None,
            JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400),
        )

    target_data = get_daily_target(date_str)
    if not target_data:
        return (
            None,
            None,
            JsonResponse({"error": "Server error: No dictionary loaded"}, status=500),
        )

    return body, target_data, None


def parse_game_request(request):
    """
    Helper for single-guess endpoints.
    Returns (context_dict, error_response).
    """
    body, target_data, error = get_base_context(request)
    if error:
        return None, error

    hard_mode = body.get("hard_mode", False)
    if not isinstance(hard_mode, bool):
        return None, JsonResponse({"error": "hard_mode must be a boolean"}, status=400)

    guess = body.get("guess", "")
    if not isinstance(guess, str):
        return None, JsonResponse({"error": "guess must be a string"}, status=400)
    guess = guess.lower()

    prev_guess = body.get("prev_guess", "")
    if not isinstance(prev_guess, str):
        return None, JsonResponse({"error": "prev_guess must be a string"}, status=400)
    prev_guess = prev_guess.lower()

    if hard_mode and len(prev_guess) not in [0, 5]:
        return None, JsonResponse(
            {"error": "Wrong length of previous guess"}, status=400
        )

    correct_hints, present_hints = [], {}
    if hard_mode:
        correct_hints, present_hints = get_hints(prev_guess, body.get("date"))

    return {
        "date_str": body.get("date"),
        "guess": guess,
        "hard_mode": hard_mode,
        "correct_hints": correct_hints,
        "present_hints": present_hints,
        "target_data": target_data,
        "all_valid_guesses": get_guesses(),
    }, None
