from typing import List, Optional

from Player import TicTacToePlayer
from UserPlayer import TicTacToeUserPlayer


class TicTacToeGame:
    def __init__(self, player1: TicTacToePlayer, player2: TicTacToePlayer, number_of_rows: Optional[int] = 3):
        self._NUMBER_OF_ROWS: int = number_of_rows
        self._NUMBER_OF_COLUMNS: int = number_of_rows
        self._grid: List[List[str]] = [[' '] * self._NUMBER_OF_COLUMNS for _ in
                                       range(self._NUMBER_OF_ROWS)]  # initializing grid with empty string

        self._player_1 = player1
        self._player_2 = player2
        self._is_current_player_1: bool = True

    def _show_scores(self) -> None:
        print(
            f"Scores: \n {self._player_1.player_id}: {self._player_1.get_score()}\n {self._player_2.player_id}: {self._player_2.get_score()}")

    def _show_grid(self) -> None:
        for i in range(self._NUMBER_OF_ROWS):
            print(' ', end='')
            for j in range(self._NUMBER_OF_COLUMNS):
                print('---', end=' ')
            print('\n| ', end='')
            print(' | '.join(self._grid[i]), end=' |\n')

        print(' ', end='')

        for j in range(self._NUMBER_OF_COLUMNS):
            print('---', end=' ')
        print('\n', end='')

    def _new_game(self) -> None:
        """
        Sets grid to empty and current player to 1
        :return:
        """
        self._grid: List[list] = [[' '] * self._NUMBER_OF_COLUMNS for _ in
                                  range(self._NUMBER_OF_ROWS)]
        self._is_current_player_1: bool = True

    def _get_current_player(self) -> TicTacToeUserPlayer:
        return self._player_1 if self._is_current_player_1 else self._player_2

    def _check_win(self) -> bool:
        """
        Returns if the current player has won
        """
        main_diagonal = list()
        alternate_diagonal = list()

        for i in range(self._NUMBER_OF_ROWS):
            # checking row
            if self._grid[i].count(self._player_2.player_id) == self._NUMBER_OF_COLUMNS:
                return True

            if self._grid[i].count(self._player_1.player_id) == self._NUMBER_OF_COLUMNS:
                return True

            # checking ith column
            ith_column = [self._grid[j][i] for j in range(self._NUMBER_OF_ROWS)]

            if ith_column.count(self._player_1.player_id) == self._NUMBER_OF_COLUMNS:
                return True

            if ith_column.count(self._player_2.player_id) == self._NUMBER_OF_COLUMNS:
                return True

            main_diagonal.append(self._grid[i][i])
            alternate_diagonal.append(self._grid[i][self._NUMBER_OF_ROWS - i - 1])

        if main_diagonal.count(self._player_1.player_id) == self._NUMBER_OF_COLUMNS:
            return True

        if main_diagonal.count(self._player_2.player_id) == self._NUMBER_OF_COLUMNS:
            return True

        if alternate_diagonal.count(self._player_1.player_id) == self._NUMBER_OF_COLUMNS:
            return True

        if alternate_diagonal.count(self._player_2.player_id) == self._NUMBER_OF_COLUMNS:
            return True

        return False

    def _check_game_over(self, move_count: int, total_moves: int) -> bool:
        return move_count < total_moves

    def play(self) -> None:
        """
        The method to be called for starting the game.
        """
        total_moves = self._NUMBER_OF_ROWS * self._NUMBER_OF_COLUMNS
        start_new_game = True
        while start_new_game:
            self._new_game()
            moves_count = 0
            while self._check_game_over(moves_count, total_moves):
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

                    moves_count += 1
                    self._is_current_player_1 = not self._is_current_player_1

                except ValueError as error:
                    print(error)

            if moves_count == total_moves:
                print("No moves possible, game draw")

            self._show_scores()

            print("Start new game(Enter 'y' to start a new game): ")
            new_game_input = input()
            if new_game_input == 'y':
                start_new_game = True
            else:
                start_new_game = False
