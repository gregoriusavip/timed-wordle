from django.test import TestCase
from wordlebackend.views import get_daily_target, grade_guess, validate_hard_mode, get_timeout_guess

class DailyWordTests(TestCase):
    def test_daily_target_is_deterministic_and_has_freq(self):
        test_list = ["apple", "grape", "melon", "peach"]
        target1 = get_daily_target("2026-04-12", test_list)
        target2 = get_daily_target("2026-04-12", test_list)
        target3 = get_daily_target("2026-04-13", test_list)
        self.assertEqual(target1["word"], target2["word"])
        self.assertNotEqual(target1["word"], target3["word"])
        if target1["word"] == "apple":
            self.assertEqual(target1["freq"]["a"], 1)
            self.assertEqual(target1["freq"]["p"], 2)

class GradingAndHardModeTests(TestCase):
    def test_grading_logic_with_freq(self):
        target_data = {"word": "apple", "freq": {"a": 1, "p": 2, "l": 1, "e": 1}}
        result = grade_guess("paper", target_data)
        self.assertEqual(result[2]["status"], "correct")
        self.assertEqual(result[0]["status"], "present")
        self.assertEqual(result[1]["status"], "present")
        self.assertEqual(result[3]["status"], "present")
        self.assertEqual(result[4]["status"], "absent")
        
    def test_validate_hard_mode(self):
        correct = {4: 'e'}
        present = {'a': 1, 'p': 1}
        self.assertTrue(validate_hard_mode("apple", correct, present)[0])
        self.assertFalse(validate_hard_mode("slate", correct, present)[0])
        self.assertFalse(validate_hard_mode("phone", correct, present)[0])

class TimeoutGuessTests(TestCase):
    def test_timeout_guess_filters_correctly(self):
        # A pool of words where only 'apple' and 'grape' fit the hints
        valid_words = ["apple", "grape", "slate", "train", "crane", "phone"]
        correct = {4: 'e'}
        present = {'a': 1, 'p': 1}
        
        # Run multiple times to ensure randomness still picks valid options
        for _ in range(20):
            guess = get_timeout_guess(valid_words, correct, present)
            self.assertIn(guess, ["apple", "grape"])
            self.assertTrue(guess.endswith('e'))
            self.assertIn('a', guess)
            self.assertIn('p', guess)

    def test_timeout_guess_no_hints(self):
        valid_words = ["apple", "grape"]
        guess = get_timeout_guess(valid_words, {}, {})
        self.assertIn(guess, valid_words)
