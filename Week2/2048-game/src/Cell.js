import React from "react";
import './Cell.css'

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

export default Cell;