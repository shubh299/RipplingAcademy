import React from "react";
import './GameMessage.css';

class GameMessage extends React.Component{
    constructor(props){
      super(props)
      this.state = {message: this.props.message};
    }
    render(){
        switch(this.props.message){
            case "You have completed 2048": this.className = "Game-Message Game-Complete"; break;
            case "No moves possible, start new game": this.className = "Game-Message Game-Over"; break;
            default: this.className = "Game-Message";
        }
        return(
            <div className={this.className}>
                {this.props.message}
            </div>
        );
    }
}

export default GameMessage;