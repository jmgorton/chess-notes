import React, { MouseEventHandler } from 'react';
// import { DndContext, useSensors, useSensor, MouseSensor } from '@dnd-kit/core';
import { withDndContext } from './hoc/DragDropContextWrapper.tsx';

// import BoardControlPanel from './BoardControlPanel.tsx';
import Square, { DroppableSquare } from './Square.tsx';
// import PawnPromotionPiecePicker from './PawnPromotionPiecePicker.tsx';

import {
  BoardProps,
  BoardState,
  SquareProp,
} from '../utils/types.ts';

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

  // handleDragEnd(event: any) { // React.SyntheticEvent? 
  //   console.log(`Board#handleDragEnd(${event})`);
  //   const {over} = event;

  //   // if the item is dropped over a Droppable container, set it as the parent;
  //   //   otherwise, set it back to XX~~null~~XX what it was before, not null ... 
  //   //   we have multiple Draggables and multiple Droppables on the board 
  //   // it almost might be preferable to use the sorted packages

  //   if (over) {
  //     console.log(over.id);
  //     this.props.handleSquareClick(over.id);
  //   }
  // }

  // handleDragStart(event: any) {
  //   // determine which squares to enable as legal Droppables 
  //   console.log(`Board#handleDragStart(${event})`);
  //   const {over} = event;

  //   if (over) {
  //     console.log(over.id);
  //     this.props.handleSquareClick(over.id); // just imagine it as a click??? is it that easy? 
  //   }
  // }

  render() {
    return (
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
                            // (this.props.enableDragAndDrop) ? 
                            <DroppableSquare 
                              {...squareProp}
                              droppableId={`droppable-${rankIndex * this.props.boardSize + fileIndex}`}
                              enableDragAndDrop={this.props.enableDragAndDrop}
                              color={(rankIndex + fileIndex) % 2 === 0 ? "light" : "dark"}
                              onSquareClick={this.props.handleSquareClick}
                              onContextMenu={this.props.handleSquareRightClick}
                              key={rankIndex * this.props.boardSize + fileIndex}
                            /> 
                            // :
                            // <Square
                            //   {...squareProp}
                            //   // enableDragAndDrop={this.props.enableDragAndDrop}
                            //   // droppableId={`droppable-${rankIndex * this.props.boardSize + fileIndex}`}
                            //   color={(rankIndex + fileIndex) % 2 === 0 ? "light" : "dark"}
                            //   onSquareClick={this.props.handleSquareClick}
                            //   onContextMenu={this.props.handleSquareRightClick}
                            //   key={rankIndex * this.props.boardSize + fileIndex}
                            // />
                          )
                        })
                      }
                    </div>
                  );
                })
              }
          </div>
        </div>
    );
  }
}

// Board is 'drag-and-drop'able by default 
export default Board;

export const DraggableDroppableBoard = withDndContext(Board); // TODO enable via settings/toggle 