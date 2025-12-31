import React, { MouseEventHandler } from 'react';
import Square from './Square.tsx';
// import PawnPromotionPiecePicker from './PawnPromotionPiecePicker.tsx';

import {
  BoardProps,
  BoardState,
} from '../utils/types.ts';

import BoardControlPanel from './BoardControlPanel.tsx';

class Board extends React.Component<BoardProps, BoardState> {

  constructor(props: BoardProps) {
    super(props);

    // TODO explain this in more depth 
    this.handleGetFENClick = this.handleGetFENClick.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.handleRedoClick = this.handleRedoClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  handleUndoClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.props.handleUndoClick) this.props.handleUndoClick(); // this.props.handleUndoClick(event);
  }

  // handleRedoClick(event: Event) {
  handleRedoClick: MouseEventHandler<HTMLButtonElement> = (event) => {

  }

  handleResetClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    // console.log('Board#handleResetClick');

    this.props.handleResetClick();
  }

  handleGetFENClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.props.handleGetFENClick) this.props.handleGetFENClick(event); // , this.props.id); // add Event to type desc. 
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
                                        {/* {
                                          squareProp.isPromoting && (
                                            <PawnPromotionPiecePicker
                                              onSelectPiece={() => console.log('Pawn promoted')}
                                              position={{top: 100, left: 100}}
                                            />
                                          )
                                        } */}
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

export default Board;