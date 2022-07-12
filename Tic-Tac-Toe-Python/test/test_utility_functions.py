from unittest import TestCase
from utility_functions import check_all_elements_are_same


class Test(TestCase):
    def test_check_all_elements_are_same(self):
        inputs = [[1, 1, 2], [2, 2, 2, 2], ['A', 'A', 'A', ' '], ['A', 'A', 'A', 'A']]
        expected_outputs = [False, True, False, True]
        for i in range(len(inputs)):
            elements_same = check_all_elements_are_same(inputs[i], inputs[i][0])
            self.assertEqual(elements_same, expected_outputs[i])
