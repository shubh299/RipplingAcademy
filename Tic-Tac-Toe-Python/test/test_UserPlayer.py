from unittest import TestCase, mock

from UserPlayer import TicTacToeUserPlayer


class TestTicTacToeUserPlayer(TestCase):
    def setUp(self) -> None:
        self.user_player = TicTacToeUserPlayer('X', 'X')

    def test_next_move(self, number_of_rows=3):
        mock_inputs = ['1,1', '0,1', '1,4', ',1', '1,', 'a,x']
        expected_outputs = [(0, 0), (-1, -1), (-1, -1), (-1, -1), (-1, -1), (-1, -1)]
        for i in range(len(mock_inputs)):
            with mock.patch('builtins.input', return_value=mock_inputs[i]):
                new_row, new_col = self.user_player.next_move(number_of_rows)
                self.assertEqual((new_row, new_col), expected_outputs[i])

    def test_update_score(self):
        mock_changes = [1, 2, -1, 0]
        for i in range(len(mock_changes)):
            with mock.patch('builtins.input', return_value=mock_changes[i]):
                prev_score = self.user_player.get_score()
                self.user_player.update_score(mock_changes[i])
                self.assertEqual(prev_score+mock_changes[i], self.user_player.get_score())