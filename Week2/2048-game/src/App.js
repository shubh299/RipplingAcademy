import React from "react";
import GameMessage from "./GameMessage";
import ScoreField from "./ScoreField";
import Grid2048 from "./Grid2048";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { score: 0, new_game_bool: false, game_message: "" };
    // this.new_game_bool = false;
    this.updateScore = this.updateScore.bind(this);
    this.setMessage = this.setMessage.bind(this);
  }

  setMessage(message) {
    this.setState({ game_message: message });
  }

  new_game = () => {
    this.setState(
      { new_game_bool: true, score: 0, game_message: "" },
      function () {
        this.setState({ new_game_bool: false });
      }
    );
  };

  updateScore(change_in_score) {
    this.setState((prevState, props) => ({
      score: prevState.score + change_in_score,
    }));
  }

  render() {
    return (
      <div className="App">
        <div className="Game-logo">2048</div>
        <div className="Score-Board">
          <ScoreField is_high_score={true} cur_score={this.state.score} />
          <ScoreField is_high_score={false} cur_score={this.state.score} />
          <div className="Score-div Btn-div">
            <button className="New-Game-Btn" onClick={this.new_game}>
              New Game
            </button>
          </div>
        </div>
        <GameMessage message={this.state.game_message} />
        <div className="Grid-wrapper">
          <Grid2048
            scoreUpdater={this.updateScore}
            setMessage={this.setMessage}
            newGame={this.state.new_game_bool}
          />
        </div>
      </div>
    );
  }
}

export default App;
