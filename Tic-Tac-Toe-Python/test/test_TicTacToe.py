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

    def test__check_win(self):
        self.fail()

    def test__check_game_over(self):
        self.fail()
