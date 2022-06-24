import React from "react";
import './App.css';

class ScoreField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { score: props.cur_score, is_high_score: props.is_high_score };
  }

  componentDidMount() {
    this.setState(
      this.state.is_high_score
        ? {
            score: window.localStorage.getItem("high-score")
              ? window.localStorage.getItem("high-score")
              : 0,
          }
        : {
            score: 0,
          }
    );
  }

  componentDidUpdate() {
    if (this.state.is_high_score) {
      window.localStorage.setItem("high-score", this.state.score);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.is_high_score) {
      return {
        score: props.cur_score > state.score ? props.cur_score : state.score,
      };
    }
    return {
      score: props.cur_score,
    };
  }

  render() {
    if (this.state.is_high_score) {
      return (
        <div className="Score-div">
          High Score <br></br>
          {this.state.score}
        </div>
      );
    } else {
      return (
        <div className="Score-div">
          Current Score <br></br>
          {this.state.score}
        </div>
      );
    }
  }
}

export default ScoreField;
