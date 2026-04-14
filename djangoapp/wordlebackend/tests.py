from django.test import TestCase
from wordlebackend.views import get_daily_target, grade_guess, validate_hard_mode

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
        
        # Valid: 'apple'
        is_valid, reason = validate_hard_mode("apple", correct, present)
        self.assertTrue(is_valid)
        
        # Invalid: missing P
        is_valid, reason = validate_hard_mode("slate", correct, present)
        self.assertFalse(is_valid)
        self.assertIn("at least 1 P", reason)
        
        # Invalid: missing A
        is_valid, reason = validate_hard_mode("phone", correct, present)
        self.assertFalse(is_valid)
        self.assertIn("at least 1 A", reason)
