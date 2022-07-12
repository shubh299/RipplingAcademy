from abc import ABC, abstractmethod


class TicTacToePlayer(ABC):
    def __init__(self, player_id: str, player_name: str, initial_score: int = 0):
        self.player_id: str = player_id
        self.player_name: str = player_name
        self._player_score: int = initial_score

    def get_score(self):
        return self._player_score

    def update_score(self, change_in_score: int):
        self._player_score += change_in_score

    @abstractmethod
    def next_move(self, number_of_rows: int):
        pass
