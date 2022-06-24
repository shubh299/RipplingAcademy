import React from "react";
import "./GameMessage.css";

const GameMessage = (props) => {
    let className = "Game-Message";
    switch (props.message) {
      case "You have completed 2048":
        className = "Game-Message Game-Complete";
        break;
      case "No moves possible, start new game":
        className = "Game-Message Game-Over";
        break;
      default:
        className = "Game-Message";
    }
    return <div className={className}>{props.message}</div>;
}

export default GameMessage;
