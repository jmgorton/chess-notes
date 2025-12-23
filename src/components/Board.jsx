import React from 'react';
import Square from './Square.jsx';
import PawnPromotionPiecePicker from './PawnPromotionPiecePicker.tsx';

class Board extends React.Component {

  constructor(props) {
    super(props);

    // TODO explain this in more depth 
    this.handleGetFENClick = this.handleGetFENClick.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.handleRedoClick = this.handleRedoClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  handleUndoClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.props.handleUndoClick) this.props.handleUndoClick(event);
  }

  handleRedoClick(event) {

  }

  handleResetClick(event) {

  }

  handleGetFENClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.props.handleGetFENClick) this.props.handleGetFENClick(event); // , this.props.id);
  }

  render() {
    return (
        <div className="board-container">
            <div className="game-board">
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
                                          key={rankIndex * this.props.boardSize + fileIndex}
                                      >
                                        {
                                          squareProp.isPromoting && (
                                            <PawnPromotionPiecePicker
                                              onSelectPiece={() => console.log('Pawn promoted')}
                                              position={{top: 100, left: 100}}
                                            />
                                          )
                                        }
                                      </Square>
                                    )
                                })
                            }
                            </div>
                        ))
                    }
                </div>
            </div>
            <BoardControlPanel 
                onUndoClick={this.handleUndoClick} 
                onRedoClick={this.handleRedoClick} 
                onResetClick={this.handleResetClick} 
                onGetFENClick={this.handleGetFENClick}
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
        <button onClick={this.props.onGetFENClick}>Get FEN</button>
      </div>
    )
  }
}

export default Board;