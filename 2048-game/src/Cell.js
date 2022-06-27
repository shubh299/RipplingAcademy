import React from "react";
import "./styles/Cell.css";

/**
 * Cell component is the cell of 2048 grid. Based on the value in cell the HTML Class for the cell changes.
 */
const Cell = (props) => {
  let className = "cell";
  switch (props.value) {
    case undefined:
      className = "cell";
      break;
    case 2:
      className = "cell cell2";
      break;
    case 4:
      className = "cell cell4";
      break;
    case 8:
      className = "cell cell8";
      break;
    case 16:
      className = "cell cell16";
      break;
    case 32:
      className = "cell cell32";
      break;
    case 64:
      className = "cell cell64";
      break;
    case 128:
      className = "cell cell128";
      break;
    case 256:
      className = "cell cell256";
      break;
    case 512:
      className = "cell cell512";
      break;
    case 1024:
      className = "cell cell1024";
      break;
    case 2048:
      className = "cell cell2048";
      break;
    default:
      className = "cell cell2048";
  }
  return <div className={className}>{props.value}</div>;
};

export default Cell;
