from Player import Player


class TicTacToeUserPlayer(Player):
    def __init__(self, player_id: str, player_name: str, initial_score: int = 0):
        super().__init__(player_id, player_name, initial_score)

    def next_move(self):
        pass

