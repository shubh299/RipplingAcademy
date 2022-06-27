import React from "react";
import Cell from "./Cell";
import { random, generateInitialGrid } from "./utility_fn";
import "./styles/Grid2048.css";

class Grid2048 extends React.Component {
  constructor(props) {
    super(props);
    let temp_grid = new Array(16);
    //moves_possible up,down,left,right
    this.state = {
      grid: temp_grid,
      moves_possible: [true, true, true, true],
      new_game: true,
    };
    this.scoreUpdater = this.props.scoreUpdater;
    this.setMessageFn = this.props.setMessage;
  }

  // receive info about new game button click in props.newGame
  static getDerivedStateFromProps(props, state) {
    if (props.newGame) {
      let temp_grid = generateInitialGrid();
      return { new_game: props.newGame, grid: temp_grid };
    } else {
      return {};
    }
  }

  // a high order function to be called from checkmoves possible
  traversalForCheckMove(start_index_fn, next_index_fn) {
    let move_possible = false;
    // console.log("up moves possible");
    for (let i = 0; i < 4; i++) {
      let defined_value_found = false;
      let defined_value = undefined;
      let start = start_index_fn(i);

      for (let j = 0; j < 4; j++) {
        if (!defined_value_found) {
          if (this.state.grid[next_index_fn(start, j)]) {
            defined_value_found = true;
            defined_value = this.state.grid[next_index_fn(start, j)];
          }
        } else {
          if (!this.state.grid[next_index_fn(start, j)]) {
            move_possible = true;
            break;
          } else {
            if (this.state.grid[next_index_fn(start, j)] === defined_value) {
              move_possible = true;
              break;
            } else {
              defined_value = this.state.grid[next_index_fn(start, j)];
            }
          }
        }
      }
      if (move_possible) {
        break;
      }
    }
    return move_possible;
  }

  // updates the possible arrow moves in state
  checkMovesPossible() {
    // console.log(this.state.grid);
    //checking up move
    let upmove_possible = this.traversalForCheckMove(
      (i) => 12 + i,
      (a, b) => a - 4 * b
    );

    //checking down move
    let downmove_possible = this.traversalForCheckMove(
      (i) => i,
      (a, b) => a + 4 * b
    );

    //checking left move
    // console.log("left moves possible")
    let leftmove_possible = this.traversalForCheckMove(
      (i) => 4 * i + 3,
      (a, b) => a - b
    );

    //checking right move
    let rightmove_possible = this.traversalForCheckMove(
      (i) => 4 * i,
      (a, b) => a + b
    );

    this.setState({
      moves_possible: [
        upmove_possible,
        downmove_possible,
        leftmove_possible,
        rightmove_possible,
      ],
    });

    if (
      !(
        upmove_possible ||
        downmove_possible ||
        leftmove_possible ||
        rightmove_possible
      )
    ) {
      this.setMessageFn("No moves possible, start new game");
    }
  }

  // a high order function for updateGridOnKeyPress
  updateGridOnKeyPress(next_cell_fn) {
    let local_grid = new Array(4);
    let change_in_score = 0;
    for (let i = 0; i < 4; i++) {
      local_grid[i] = new Array(4);

      //copying to local grid
      for (let j = 0; j < 4; j++) {
        local_grid[i][j] = this.state.grid[next_cell_fn(j, i)];
      }

      //removing undefined elements
      for (let j = 3; j >= 0; j--) {
        if (!local_grid[i][j]) {
          local_grid[i].splice(j, 1);
        }
      }

      //adding same elements
      for (let j = 0; j < 3; j++) {
        if (local_grid[i][j] && local_grid[i][j] === local_grid[i][j + 1]) {
          local_grid[i][j] *= 2;
          change_in_score += local_grid[i][j];

          if (local_grid[i][j] === 2048)
            this.setMessageFn("You have completed 2048");
          
          local_grid[i][j + 1] = undefined;
        }
      }

      //removing undefined indexes
      for (let j = local_grid[i].length - 1; j > 0; j--) {
        if (!local_grid[i][j]) local_grid[i].splice(j, 1);
      }
    }

    //updating the state
    let updated_grid = new Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        updated_grid[next_cell_fn(j, i)] = local_grid[i][j];
      }
    }
    //new number addition here
    let empty_cell_count = updated_grid.filter(
      (cell) => cell === undefined
    ).length;
    let random_position = random(1, 0, empty_cell_count - 1);

    for (let i = 0; i < updated_grid.length; i++) {
      if (!updated_grid[i]) {
        if (!random_position--) {
          updated_grid[i] = 2;
          break;
        }
      }
    }

    this.setState({ grid: updated_grid }, function () {
      this.scoreUpdater(change_in_score);
      this.checkMovesPossible();
    });
  }

  // handle arrow keys input
  handleKeyPress = (event) => {
    if (this.state.new_game) {
      this.checkMovesPossible();
      this.setState({ new_game: false }, function () {
        this.handleKeyPress(event);
      });
    } else {
      if (event.key === "ArrowUp") {
        if (this.state.moves_possible[0]) {
          this.updateGridOnKeyPress((a, b) => 4 * a + b);
        }
      }
      if (event.key === "ArrowDown") {
        if (this.state.moves_possible[1]) {
          this.updateGridOnKeyPress((a, b) => 4 * (3 - a) + b);
        }
      }
      if (event.key === "ArrowLeft") {
        if (this.state.moves_possible[2]) {
          this.updateGridOnKeyPress((a, b) => 4 * b + a);
        }
      }
      if (event.key === "ArrowRight") {
        if (this.state.moves_possible[3]) {
          this.updateGridOnKeyPress((a, b) => 4 * (b + 1) - (a + 1));
        }
      }
    }
  };

  componentDidMount() {
    let temp_grid = generateInitialGrid();
    this.setState({ grid: temp_grid }, function () {
      this.checkMovesPossible();
      document.addEventListener("keydown", this.handleKeyPress);
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  render() {
    let display_grid = [];
    for (let i = 0; i < this.state.grid.length; i++) {
      display_grid.push(<Cell value={this.state.grid[i]} key={i} />);
    }
    return <div className="Play-Grid">{display_grid}</div>;
  }
}

export default Grid2048;
