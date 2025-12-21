import React from 'react';
import { keycodeToComponent } from './Piece';

class Square extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   isHighlighted: this.props.isHighlighted || false,
    //   isSelected: this.props.isSelected || false,
    // }
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleClick() {
    // this.setState(prevState => ({
    //   ...prevState,
    //   isSelected: !prevState.isSelected,
    // }));

    // if (this.props.keycode === "LP") {
    //   // alert("This is a pawn square, id: " + this.props.id);
    //   this.props.onPawnClick(this.props.id);
    // }

    this.props.onSquareClick(this.props.id);
  }

  handleRightClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    // pass both the event and the square id to the parent handler
    if (this.props.onContextMenu) this.props.onContextMenu(event, this.props.id);
  }

  testEvent() {
    alert("This is a test event from Square");
  }

  render() {
    return (
      <button 
        className={
            "square " + 
            this.props.color + 
            (this.props.isHighlighted ? " highlighted" : "") + 
            (this.props.isAltHighlighted ? " altHighlighted" : "") + 
            (this.props.isSelected || this.props.isAltSelected ? " selected" : "")
        } 
        // onClick={() => props.onClick(props.id)} // prop onClick 
        onClick={() => this.handleClick()} 
        data-square-id={this.props.id}
        onContextMenu={this.handleRightClick}
        // testevent={() => this.testEvent()}
        // testevent={this.testEvent}
        // onContextMenu={() => this.handleRightClick()}


        // key={this.props.id}
        // key={`${this.props.id}-${this.props.pieceCode}-0`} // update this key??? 
        // key={this.props.key} // key is stripped from props in React -- can't do this here 
      >
        {
            this.props.keycode && 
            this.props.keycode in keycodeToComponent && 
            React.createElement(keycodeToComponent[this.props.keycode], this.props)
        }
      </button>
    );
  }
}

// class LightSquare extends Square {
//   color = "light";
// }

// class DarkSquare extends Square {
//   color = "dark";
// }

export default Square;