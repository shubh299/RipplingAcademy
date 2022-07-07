from typing import Tuple

from Player import TicTacToePlayer


class TicTacToeUserPlayer(TicTacToePlayer):
    def __init__(self, player_id: str, player_name: str, initial_score: int = 0):
        super().__init__(player_id, player_name, initial_score)

    def next_move(self, number_of_rows: int) -> Tuple[int, int]:
        new_coordinate = input().split(',')
        try:
            if len(new_coordinate) != 2:
                raise ValueError("Invalid format for next move")
            new_row = int(new_coordinate[0]) - 1
            new_col = int(new_coordinate[1]) - 1
            if (new_row < 0 or new_row >= number_of_rows) or (
                    new_col < 0 or new_col >= number_of_rows):
                raise ValueError("Invalid position")
            return new_row, new_col

        except ValueError:
            return -1, -1
