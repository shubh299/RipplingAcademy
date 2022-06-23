import React from 'react';
import './App.css';

/**
 * utility functions
 */

//to generate n random integers in the range provided, start and stop both inclusive
function random(n,start,stop){
  let random_set = new Set();
  while(random_set.size < n){
    random_set.add(start + Math.floor(Math.random() * (stop - start + 1)));
  }
  return [...random_set];
}

class ScoreField extends React.Component{
  constructor(props){
    super(props);
    this.state = {score: props.cur_score, is_high_score: props.is_high_score};
  }

  componentDidMount(){
    this.setState(this.state.is_high_score ? {
      score: window.localStorage.getItem("high-score") ? window.localStorage.getItem("high-score") : 0
    }:{
      score: 0
    } );
  }

  componentDidUpdate(){
    if(this.state.is_high_score){
      window.localStorage.setItem("high-score",this.state.score);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(state.is_high_score){
      return {
        score: props.cur_score > state.score ? props.cur_score : state.score
      };
    }
    return {
      score: props.cur_score
    };
  }

  render(){
    return(
      this.state.score
    );
  }
}

class Cell extends React.Component{
  constructor(props){
    super(props);
    this.state = {value: this.props.value ? this.props.value : ''}
    this.className = "cell";
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value ? props.value : ''
    };
  }

  render(){
    switch(this.state.value){
      case '': this.className = "cell"; break;
      case 2: this.className = "cell cell2"; break;
      case 4: this.className = "cell cell4"; break;
      case 8: this.className = "cell cell8"; break;
      case 16: this.className = "cell cell16"; break;
      case 32: this.className = "cell cell32"; break;
      case 64: this.className = "cell cell64"; break;
      case 128: this.className = "cell cell128"; break;
      case 256: this.className = "cell cell256"; break;
      case 512: this.className = "cell cell512"; break;
      case 1024: this.className = "cell cell1024"; break;
      case 2048: this.className = "cell cell2048"; break;
      default: this.className = "cell cell2048";
    }
    return(
      <div className={this.className}>{this.state.value}</div>
    );
  }
}


function gameWon(){} //TODO

function gameOver(){} //TODO

class Grid2048 extends React.Component{
  constructor(props){
    super(props);
    let temp_grid = new Array(16);
    //moves_possible up,down,left,right
    this.state = {grid: temp_grid, moves_possible: [true,true,true,true], new_game:true};
    this.scoreUpdater = this.props.scoreUpdater;
  }

  static getDerivedStateFromProps(props, state){
    if(props.newGame){
      let random_places = random(2,0,15);
      // random_places = [6,7];
      let temp_grid = new Array(16);
      for(let i = 0; i < random_places.length; i++){
        temp_grid[ random_places[i] ] = 2;
      }
      return {new_game: props.newGame, grid: temp_grid};
    }
    else{
      return {};
    }
  }

  traversalForCheckMove(start_index_fn, next_index_fn){
    let move_possible = false;
    // console.log("up moves possible");
    for(let i = 0; i < 4; i++){
      let defined_value_found = false;
      let defined_value = undefined;
      let start = start_index_fn(i);

      for(let j = 0; j < 4; j++){
        if(!defined_value_found){
          if(this.state.grid[next_index_fn(start,j)]){
            defined_value_found = true;
            defined_value = this.state.grid[next_index_fn(start,j)];
          }
        }
        else{
          if(!this.state.grid[next_index_fn(start,j)]){
            move_possible = true;
            break;
          }
          else{
            if(this.state.grid[next_index_fn(start,j)] === defined_value){
              move_possible = true;
              break;
            }
            else{
              defined_value = this.state.grid[next_index_fn(start,j)];
            }
          }
        }
      }
      if(move_possible){
        break;
      }
    }
    return move_possible;
  }

  checkMovesPossible(){
    // console.log(this.state.grid);
    //checking up move
    let upmove_possible = this.traversalForCheckMove((i) => 12+i,(a,b) => a-4*b);

    //checking down move
    let downmove_possible = this.traversalForCheckMove((i) => i,(a,b) => a+4*b);

    //checking left move
    // console.log("left moves possible")
    let leftmove_possible = this.traversalForCheckMove((i) => 4*i+3,(a,b) => a-b);

    //checking right move
    let rightmove_possible = this.traversalForCheckMove((i) => 4*i,(a,b) => a+b);

    this.setState({moves_possible: [upmove_possible,downmove_possible,leftmove_possible,rightmove_possible]});
  }

  updateGridOnKeyPress(next_cell_fn){
    let local_grid = new Array(4);
    let change_in_score = 0;
    for(let i = 0; i < 4; i++){
      local_grid[i] = new Array(4);

      //copying to local grid
      for(let j = 0; j < 4; j++){
        local_grid[i][j] = this.state.grid[next_cell_fn(j,i)];
      }

      //removing undefined elements 
      for(let j = 3; j >= 0; j--){
        if(!local_grid[i][j]){
          local_grid[i].splice(j,1);
        }
      }

      //adding same elements
      for(let j = 0; j < 3; j++){
        if(local_grid[i][j] && local_grid[i][j] === local_grid[i][j+1]){
          local_grid[i][j] *= 2;
          change_in_score += local_grid[i][j];
          local_grid[i][j+1] = undefined;
        }
      }

      //removing undefined indexes
      for(let j = local_grid[i].length-1; j > 0; j--){
        if(!local_grid[i][j])
          local_grid[i].splice(j,1);
      }
    }

    //updating the state
    let updated_grid = new Array(16);
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 4; j++){
        updated_grid[next_cell_fn(j,i)] = local_grid[i][j];
      }
    }
    //new number addition here
    let empty_cell_count = (updated_grid.filter(cell => cell === undefined)).length;
    let random_position = random(1,0,empty_cell_count-1);
    
    for(let i = 0; i < updated_grid.length; i++){
      if(!updated_grid[i]){
        if(!(random_position--)){
          updated_grid[i] = 2;
          break;
        }
      }
    }

    this.setState({grid: updated_grid},function(){
      this.checkMovesPossible();
      this.scoreUpdater(change_in_score)
      if(!this.state.moves_possible.includes(true)){
        gameOver();
      }
    });
  }

  handleKeyPress = (event) => {
    if(this.state.new_game){
      this.checkMovesPossible();
      this.setState({new_game: false},function(){
        this.handleKeyPress(event);
      });
    }
    else{
      if(event.key === "ArrowUp"){
        if(this.state.moves_possible[0]){
          this.updateGridOnKeyPress((a,b)=>4*a+b);
        }
      }
      if(event.key === "ArrowDown"){
        if(this.state.moves_possible[1]){
          this.updateGridOnKeyPress((a,b)=>4*(3-a)+b);
        }
      }
      if(event.key === "ArrowLeft"){
        if(this.state.moves_possible[2]){
          this.updateGridOnKeyPress((a,b)=>4*b+a);
        }
      }
      if(event.key === "ArrowRight"){
        if(this.state.moves_possible[3]){
          this.updateGridOnKeyPress((a,b)=>4*(b+1)-(a+1));
        }
      }
    }
  }

  componentDidMount(){
    
    let random_places = random(2,0,15);
    // random_places = [6,7];
    let temp_grid = new Array(16);
    for(let i = 0; i < random_places.length; i++){
      temp_grid[ random_places[i] ] = 2;
    }

    this.setState({grid: temp_grid},function(){
      this.checkMovesPossible();
      document.addEventListener("keydown", this.handleKeyPress);
    });
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  render(){
    let display_grid = [];
    for(let i = 0; i < this.state.grid.length; i++){
      display_grid.push(<Cell value={this.state.grid[i]} key={i}/>)
    }
    return (
      <div className='play-grid'>
        {display_grid}
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {score: 0, new_game_bool: false}
    // this.new_game_bool = false;
    this.updateScore = this.updateScore.bind(this)
  }

  // TODO
  new_game = () => {
    this.setState({new_game_bool: true, score: 0},function(){
      this.setState({new_game_bool: false})
    })
  }

  updateScore(change_in_score){
    this.setState((prevState,props) => ({
      score: prevState.score + change_in_score
    }));
  }

  render(){
    return (
      <div className="App">
        <div className='Game-logo'>
          2048
        </div>
        <div className='score-board'>
          <div className="score-div">
            High Score <br></br>
            <ScoreField is_high_score={true} cur_score={this.state.score}/>
          </div>
          <div className="score-div">
            Current Score <br></br>
            <ScoreField is_high_score={false} cur_score={this.state.score}/>
          </div>
          <div className='score-div btn-div'>
            <button className='new-game-btn' onClick={this.new_game}>
              New Game
            </button>
          </div>
        </div>
        <div className='grid'>
          <Grid2048 scoreUpdater={this.updateScore} newGame={this.state.new_game_bool}/>
        </div>
      </div>
    );
  }
}

export default App;
