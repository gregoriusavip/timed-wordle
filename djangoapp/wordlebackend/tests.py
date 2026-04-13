from django.test import TestCase
from wordlebackend.views import get_daily_word

class DailyWordTests(TestCase):
    def test_daily_word_is_deterministic(self):
        # Assuming solutions_list is passed or patched for testing
        test_list = ["apple", "grape", "melon", "peach"]
        
        word1 = get_daily_word("2026-04-12", test_list)
        word2 = get_daily_word("2026-04-12", test_list)
        word3 = get_daily_word("2026-04-13", test_list)
        
        self.assertEqual(word1, word2) # Same date, same word
        self.assertNotEqual(word1, word3) # Different date, likely different word
