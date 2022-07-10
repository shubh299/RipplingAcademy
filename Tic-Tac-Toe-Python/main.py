from TicTacToe import TicTacToeGame
from UserPlayer import TicTacToeUserPlayer

player_1 = TicTacToeUserPlayer('X', 'X')
player_2 = TicTacToeUserPlayer('O', 'O')

start_new_game = True
while start_new_game:
    print("Number of rows for new game:", end=' ')
    rows = int(input())
    game = TicTacToeGame.new_game(player_1, player_2, rows)
    game.play()
    print(f"Scores: \n{player_1.player_id}: {player_1.get_score()} \n{player_2.player_id}: {player_2.get_score()}")
    print("Enter 'y' to start new game:", end=' ')
    start_new_game = input() == 'y'


