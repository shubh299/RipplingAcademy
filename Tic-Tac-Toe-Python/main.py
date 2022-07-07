from TicTacToe import TicTacToeGame
from UserPlayer import TicTacToeUserPlayer

player_1 = TicTacToeUserPlayer('X', 'X')
player_2 = TicTacToeUserPlayer('O', 'O')
game1 = TicTacToeGame(player_1,player_2)

game1.play()

