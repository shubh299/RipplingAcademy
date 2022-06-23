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
    this.state = {value: this.props.value ? this.props.value : ' '}
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value
    };
  }

  render(){
    return(
      <div className="cell">{this.state.value}</div>
    );
  }
}

function gameOver(){} //TODO

class Grid2048 extends React.Component{
  constructor(props){
    super(props);
    let temp_grid = new Array(16);
    //moves_possible up,down,left,right
    this.state = {grid: temp_grid, moves_possible: [true,true,true,true]} 
    this.scoreUpdater = this.props.scoreUpdater
  }

  traversalForCheckMove(start_index_fn, next_index_fn){
    let move_possible = false;
    // console.log("up moves possible");
    for(let i = 0; i < 4; i++){
      let defined_value_found = false;
      let defined_value = undefined;
      let start = start_index_fn(i);

      // let local_row = [];

      // for(let j = 0; j < 4; j++){
      //   local_row.push(this.state.grid[next_index_fn(start,j)]);
      // }

      for(let j = 0; j < 4; j++){
        // console.log(start-4*j,this.state.grid[start - 4*j]);
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

    // console.log("moves_possible",this.state.moves_possible);
    this.setState({moves_possible: [upmove_possible,downmove_possible,leftmove_possible,rightmove_possible]},
      function(){console.log(this.state.moves_possible)});
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
    this.setState({grid: updated_grid},function(){
      this.checkMovesPossible();
      //call parent function here and pass change in score.
      this.scoreUpdater(change_in_score)
      if(!this.state.moves_possible.includes(true)){
        gameOver();
      }
      else{
        //new number addition here

      }
    });
  }

  handleKeyPress = (event) => {
    // console.log(event);
    if(event.key === "ArrowUp"){
      // console.log("Arrow UP pressed");
      if(this.state.moves_possible[0]){

        this.updateGridOnKeyPress((a,b)=>4*a+b);

        //copying the column data to row representation for easy handling
        // let local_grid = new Array(4);
        // for(let i = 0; i < 4; i++){
        //   local_grid[i] = new Array(4);
        // }
        
        // for(let i = 0; i < 4; i++){
        //   //copying to local grid
        //   for(let j = 0; j < 4; j++){
        //     local_grid[i][j] = this.state.grid[4*j + i];
        //   }
        //   //removed lines from here and moved to handleMoves function
        // }
        // console.log("copying to local grid");
        // local_grid = this.handleMoves(local_grid);

        // //updating the state
        // let updated_grid = new Array(16);
        // for(let i = 0; i < 4; i++){
        //   for(let j = 0; j < 4; j++){
        //     updated_grid[4*j + i] = local_grid[i][j];
        //   }
        // }
        // console.log("local_grid",local_grid);
        // console.log("updated_grid",updated_grid);
        // this.setState({grid: updated_grid},function(){
        //   this.checkMextMove();
        // });
      }
    }
    if(event.key === "ArrowDown"){
      // console.log("Arrow Down pressed");
      if(this.state.moves_possible[1]){
        this.updateGridOnKeyPress((a,b)=>4*(3-a)+b);
        //copying the column data to row representation for easy handling
        // let local_grid = new Array(4);
        // for(let i = 0; i < 4; i++){
        //   local_grid[i] = new Array(4);
        // }
        
        // for(let i = 0; i < 4; i++){
        //   //copying to local grid
        //   for(let j = 0; j < 4; j++){
        //     local_grid[i][j] = this.state.grid[4*(3-j) + i];
        //   }
        // }
        // console.log(local_grid);
        // console.log("copying to local grid");
        // local_grid = this.handleMoves(local_grid);

        // //updating the state
        // let updated_grid = new Array(16);
        // for(let i = 0; i < 4; i++){
        //   for(let j = 0; j < 4; j++){
        //     updated_grid[4*(3-j) + i] = local_grid[i][j];
        //   }
        // }
        // console.log("local_grid",local_grid);
        // console.log("updated_grid",updated_grid);
        // this.setState({grid: updated_grid},function(){
        //   this.checkMextMove();
        // });
      }
    }
    if(event.key === "ArrowLeft"){
      // console.log("Arrow Left pressed");
      if(this.state.moves_possible[2]){
        this.updateGridOnKeyPress((a,b)=>4*b+a);
        // let local_grid = new Array(4);
        // for(let i = 0; i < 4; i++){
        //   local_grid[i] = new Array(4);
        // }
        
        // for(let i = 0; i < 4; i++){
        //   //copying to local grid
        //   for(let j = 0; j < 4; j++){
        //     local_grid[i][j] = this.state.grid[4*i + j];
        //   }
        // }
        // console.log("copying to local grid");
        // local_grid = this.handleMoves(local_grid);

        // //updating the state
        // let updated_grid = new Array(16);
        // for(let i = 0; i < 4; i++){
        //   for(let j = 0; j < 4; j++){
        //     updated_grid[4*i + j] = local_grid[i][j];
        //   }
        // }
        // console.log("local_grid",local_grid);
        // console.log("updated_grid",updated_grid);
        // this.setState({grid: updated_grid},function(){
        //   this.checkMextMove();
        // });
      }
    }
    if(event.key === "ArrowRight"){
      // console.log("Arrow Right pressed");
      if(this.state.moves_possible[3]){
        this.updateGridOnKeyPress((a,b)=>4*(b+1)-(a+1));
        //copying the column data to row representation for easy handling
        // let local_grid = new Array(4);
        // for(let i = 0; i < 4; i++){
        //   local_grid[i] = new Array(4);
        // }
        
        // for(let i = 0; i < 4; i++){
        //   //copying to local grid
        //   for(let j = 0; j < 4; j++){
        //     local_grid[i][j] = this.state.grid[ 4*(i+1) - (j+1)];
        //   }
        // }
        // console.log(local_grid);
        // console.log("copying to local grid");
        // local_grid = this.handleMoves(local_grid);

        // //updating the state
        // let updated_grid = new Array(16);
        // for(let i = 0; i < 4; i++){
        //   for(let j = 0; j < 4; j++){
        //     updated_grid[4*(i+1) - (j+1)] = local_grid[i][j];
        //   }
        // }
        // console.log("local_grid",local_grid);
        // console.log("updated_grid",updated_grid);
        // this.setState({grid: updated_grid},function(){
        //   this.checkMextMove();
        // });
      }
    }
  }

  componentDidMount(){
    console.log("GRID mounted");
    let random_places = random(2,0,15);
    // random_places = [6,7];
    let temp_grid = [...this.state.grid];
    for(let i = 0; i < random_places.length; i++){
      temp_grid[ random_places[i] ] = 2;
    }
    
    this.setState({grid: temp_grid},function(){
      this.checkMovesPossible();
      document.addEventListener("keydown", this.handleKeyPress);
    });
    // this.checkMovesPossible();
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
    this.state = {score: 0}
    this.updateScore = this.updateScore.bind(this)
  }

  // TO DO
  new_game = () => {
    console.log("new game"); 
    // this.render();
    // this.setState({score:2});
  }

  // TO DO
  updateScore(change_in_score){
    // console.log("change in score",change_in_score)
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
          <Grid2048 scoreUpdater={this.updateScore}/>
        </div>
      </div>
    );
  }
}

export default App;
