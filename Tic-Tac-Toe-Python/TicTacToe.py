from typing import List, Optional
from utility_functions import check_all_elements_are_same
from Player import TicTacToePlayer


class TicTacToeGame:
    def __init__(self, player1: TicTacToePlayer, player2: TicTacToePlayer, number_of_rows: Optional[int] = 3):
        self._NUMBER_OF_ROWS: int = number_of_rows
        self._grid: List[List[str]] = [[' '] * self._NUMBER_OF_ROWS for _ in
                                       range(self._NUMBER_OF_ROWS)]  # initializing grid with empty string

        self._player_1 = player1
        self._player_2 = player2
        self._is_current_player_1: bool = True

    def _show_grid(self) -> None:
        for i in range(self._NUMBER_OF_ROWS):
            print(' ', end='')
            for j in range(self._NUMBER_OF_ROWS):
                print('---', end=' ')
            print('\n| ', end='')
            print(' | '.join(self._grid[i]), end=' |\n')

        print(' ', end='')

        for j in range(self._NUMBER_OF_ROWS):
            print('---', end=' ')
        print('\n', end='')

    @classmethod
    def new_game(cls, player1: TicTacToePlayer, player2: TicTacToePlayer, number_of_rows: int):
        """
        Returns a new object of TicTacToe.
        :return:
        """
        return TicTacToeGame(player1, player2, number_of_rows)

    def _get_current_player(self) -> TicTacToePlayer:
        return self._player_1 if self._is_current_player_1 else self._player_2

    def _check_win(self) -> bool:
        """
        Returns True if the current player has won
        """
        main_diagonal = list()
        alternate_diagonal = list()

        for i in range(self._NUMBER_OF_ROWS):
            # checking row
            if check_all_elements_are_same(self._grid[i], self._player_1.player_id) or \
                    check_all_elements_are_same(self._grid[i], self._player_2.player_id):
                return True

            # checking ith column
            ith_column = [self._grid[j][i] for j in range(self._NUMBER_OF_ROWS)]

            if check_all_elements_are_same(ith_column, self._player_1.player_id) or \
                    check_all_elements_are_same(ith_column, self._player_2.player_id):
                return True

            main_diagonal.append(self._grid[i][i])
            alternate_diagonal.append(self._grid[i][self._NUMBER_OF_ROWS - i - 1])

        if check_all_elements_are_same(main_diagonal, self._player_1.player_id) or \
                check_all_elements_are_same(main_diagonal, self._player_2.player_id):
            return True

        if check_all_elements_are_same(alternate_diagonal, self._player_1.player_id) or \
                check_all_elements_are_same(alternate_diagonal, self._player_2.player_id):
            return True

        return False

    def _check_game_over(self) -> bool:
        """
        Current way to check is the most basic way, checks if ' ' is present in grid. Needs to be updated.
        :return: True if game is over (draw), False otherwise.
        """
        grid_set = set([value for row in self._grid for value in row])
        return ' ' not in grid_set

    def play(self) -> None:
        """
        The method to be called for starting the game.
        """
        while self._check_game_over():
            self._show_grid()
            print("Current player:", self._get_current_player().player_id)
            print("Enter new position for next move (in row,column format): ", end='')
            try:
                new_row, new_col = self._get_current_player().next_move(self._NUMBER_OF_ROWS)

                if new_row == -1:
                    raise ValueError("Invalid Input")

                if self._grid[new_row][new_col] == self._player_1.player_id \
                        or self._grid[new_row][new_col] == self._player_2.player_id:
                    raise ValueError("Position already filled")

                self._grid[new_row][new_col] = self._get_current_player().player_id

                player_won = self._check_win()

                if player_won:
                    print(f"Player {self._get_current_player().player_id} wins")
                    self._get_current_player().update_score(1)
                    break

                self._is_current_player_1 = not self._is_current_player_1

            except ValueError as error:
                print(error)

        print("No moves possible, game draw")
