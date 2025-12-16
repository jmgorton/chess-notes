import React from 'react';
import Square from './Square.jsx';

class Board extends React.Component {

  render() {
    return (
        <div className="board-container">
            <div>
                {
                    Array.from({ length: this.props.boardSize }, (_, rankIndex) => (
                        <div className="board-row" key={rankIndex}>
                        {
                            this.props.squareProps.slice(
                                rankIndex * this.props.boardSize,
                                rankIndex * this.props.boardSize + this.props.boardSize
                            ).map((squareProp, fileIndex) => {
                                return (
                                    <Square 
                                        {...squareProp} 
                                        color={(rankIndex + fileIndex) % 2 === 0 ? "light" : "dark"} 
                                        onSquareClick={this.props.handleSquareClick}
                                        onContextMenu={this.props.handleSquareRightClick}
                                    />
                                )
                            })
                        }
                        </div>
                    ))
                }
            </div>
            <BoardControlPanel 
                onUndoClick={this.props.handleUndoClick} 
                onRedoClick={this.props.handleRedoClick} 
                onResetClick={this.props.handleResetClick} 
            />
        </div>
    )
  }
}

class BoardControlPanel extends React.Component {
  render() {
    return (
      <div className="board-control-panel">
        <button onClick={this.props.onUndoClick}>Undo</button>
        <button onClick={this.props.onRedoClick}>Redo</button>
        <button onClick={this.props.onResetClick}>Reset</button>
      </div>
    )
  }
}

export default Board;