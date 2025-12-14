import React from 'react';

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squareComponents: this.props.squares.map((square, index) => {
  //       // keycodeToComponent[square]
  //       const rank = Math.floor(index / 8);
  //       const file = index % 8; 

  //       let squareProps = {
  //         keycode: square,
  //         id: index,
  //         key: index,
  //         // onPawnClick: this.handlePawnClick,
  //         onSquareClick: this.handleSquareClick, 
  //         // onPawnClick: this.handlePawnClick.bind(this),
  //         // include props to a square about the squares it can move to or might find relevant?? or all squares??? 
  //       }

  //       return ((rank + file) % 2 === 0) ? <LightSquare {...squareProps} /> : <DarkSquare {...squareProps} />;
  //     }),
  //     boardSize: Math.sqrt(this.props.squares.length),
  //     squareSelected: null,
  //   }
  // }

  render() {
    return (
      <div>
        {
          Array.from({ length: this.props.boardSize }, (_, rankIndex) => (
            <div className="board-row" key={rankIndex}>
              {
                this.props.squareComponents.slice(
                  rankIndex * this.props.boardSize, // start
                  rankIndex * this.props.boardSize + this.props.boardSize // end
                )// .map((squareComponent) => squareComponent)
                // .map((squareComponent) => {
                //   // squareComponent.children = this.props.children;
                //   return React.cloneElement(squareComponent, { ...squareComponent.props, children: this.props.children }); // , key: `${squareComponent.props.keycode}` });
                // })
              }
            </div>
          ))
        }
      </div>
    )
  }
}

export default Board;