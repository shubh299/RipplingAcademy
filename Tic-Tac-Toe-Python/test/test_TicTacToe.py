from unittest import TestCase

from TicTacToe import TicTacToeGame
from UserPlayer import TicTacToeUserPlayer


class TestTicTacToeGame(TestCase):
    def setUp(self) -> None:
        self.player1 = TicTacToeUserPlayer('X', 'X', 0)
        self.player2 = TicTacToeUserPlayer('O', 'O', 0)
        self.tic_tac_toe = TicTacToeGame.new_game(self.player1, self.player2, 3)

    def test__get_current_player(self):
        current_player = self.tic_tac_toe._get_current_player()
        self.assertEqual(current_player, self.player1)
        self.tic_tac_toe._is_current_player_1 = not self.tic_tac_toe._is_current_player_1
        current_player = self.tic_tac_toe._get_current_player()
        self.assertEqual(current_player, self.player2)

    def test__check_win(self):
        grids = list()
        grids.append([[' ']*3 for _ in range(3)])
        grids.append([['X', 'X', 'X'], ['O', 'O', 'X'], ['O', ' ', ' ']])
        grids.append([['X', 'O', 'X'], ['O', 'O', 'O'], ['X', 'X', ' ']])

        expected_outputs = [False, True, True]
        for index, grid in enumerate(grids):
            self.tic_tac_toe._grid = grid
            actual_output = self.tic_tac_toe._check_win()
            self.assertEqual(actual_output, expected_outputs[index])

    def test__check_game_over(self):
        grids = list()
        grids.append([[' ']*3 for _ in range(3)])
        grids.append([['X', 'X', 'X'], ['O', 'O', 'X'], ['O', ' ', ' ']])
        grids.append([['X', 'O', 'X'], ['O', 'O', 'X'], ['X', 'X', 'O']])

        expected_outputs = [False, False, True]
        for index, grid in enumerate(grids):
            self.tic_tac_toe._grid = grid
            actual_output = self.tic_tac_toe._check_game_over()
            self.assertEqual(actual_output, expected_outputs[index])
