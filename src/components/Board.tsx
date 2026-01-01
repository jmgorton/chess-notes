import React, { MouseEventHandler } from 'react';
import Square from './Square.tsx';
// import PawnPromotionPiecePicker from './PawnPromotionPiecePicker.tsx';

import {
  BoardProps,
  BoardState,
  SquareProp,
} from '../utils/types.ts';

import BoardControlPanel from './BoardControlPanel.tsx';

class Board extends React.Component<BoardProps, BoardState> {

  constructor(props: BoardProps) {
    super(props);

    this.state = {
      isFlipped: false,
    }

    // binding not necessary when using newer arrow notation 
    // this.handleGetFENClick = this.handleGetFENClick.bind(this);
    // this.handleUndoClick = this.handleUndoClick.bind(this);
    // this.handleRedoClick = this.handleRedoClick.bind(this);
    // this.handleResetClick = this.handleResetClick.bind(this);
  }

  handleSendGameClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    // if (this.props.handleUndoClick) this.props.handleUndoClick(); // this.props.handleUndoClick(event);
  }

  // handleRedoClick(event: Event) {
  handleUploadClick: MouseEventHandler<HTMLButtonElement> = (event) => {

  }

  handleDownloadClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    // console.log('Board#handleResetClick');

    // this.props.handleResetClick();
  }

  handleGetInfoClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.props.handleGetFENClick) this.props.handleGetFENClick(event); // , this.props.id); // add Event to type desc. 
  }

  flipBoard: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    // console.log("Flipping board...");
    this.setState({
      ...this.state,
      isFlipped: !this.state.isFlipped,
    })
  }

  render() {
    return (
        <div className="board-container">
            <div className="game-board">
                <div>
                    {
                        Array.from({ length: this.props.boardSize }, (_, rankIndex) => {
                          const sliceStart: number = !this.state.isFlipped ? 
                            rankIndex * this.props.boardSize :
                            64 - ((rankIndex + 1) * this.props.boardSize);
                          const sliceEnd: number = !this.state.isFlipped ?
                            (rankIndex + 1) * this.props.boardSize :
                            64 - (rankIndex * this.props.boardSize);
                          
                          const toRender: SquareProp[] = this.props.squareProps.slice(sliceStart, sliceEnd);
                          if (this.state.isFlipped) toRender.reverse();
                          return (
                            <div className="board-row" key={rankIndex}>
                            {
                                toRender.map((squareProp, fileIndex) => {
                                    return (
                                      <Square 
                                          {...squareProp} 
                                          color={(rankIndex + fileIndex) % 2 === 0 ? "light" : "dark"} 
                                          onSquareClick={this.props.handleSquareClick}
                                          onContextMenu={this.props.handleSquareRightClick}
                                          key={rankIndex * this.props.boardSize + fileIndex}
                                      />
                                    )
                                })
                            }
                            </div>
                        );
                      })
                    }
                </div>
            </div>
            <BoardControlPanel 
                onGetInfoClick={this.handleGetInfoClick} 
                onUploadClick={this.handleUploadClick} 
                onDownloadClick={this.handleDownloadClick} 
                onSendGameClick={this.handleSendGameClick}
                onFlipBoard={this.flipBoard}
            />
        </div>
    )
  }
}

export default Board;