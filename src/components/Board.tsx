import React from 'react';

import { withDndContext } from './hoc/DragDropContextWrapper.tsx';
import Square, { DroppableSquare } from './Square.tsx';

import {
  BoardProps,
  BoardState,
  SquareProp,
} from '../utils/types.ts';

class Board extends React.Component<BoardProps, BoardState> {

  constructor(props: BoardProps) {
    super(props);

    this.state = {
      // isBoardFlipped: props.isBoardFlipped,
    }

    // binding not necessary when using newer arrow notation 
    // this.handleGetFENClick = this.handleGetFENClick.bind(this);
    // this.handleUndoClick = this.handleUndoClick.bind(this);
    // this.handleRedoClick = this.handleRedoClick.bind(this);
    // this.handleResetClick = this.handleResetClick.bind(this);
  }

  render() {
    return (
        <div className="game-board">
          <div>
              {
                Array.from({ length: this.props.boardSize }, (_, rankIndex) => {
                  const sliceStart: number = !this.props.isBoardFlipped ?
                    rankIndex * this.props.boardSize :
                    64 - ((rankIndex + 1) * this.props.boardSize);
                  const sliceEnd: number = !this.props.isBoardFlipped ?
                    (rankIndex + 1) * this.props.boardSize :
                    64 - (rankIndex * this.props.boardSize);

                  const toRender: SquareProp[] = this.props.squareProps.slice(sliceStart, sliceEnd);
                  if (this.props.isBoardFlipped) toRender.reverse();
                  return (
                    <div className="board-row" key={rankIndex}>
                      {
                        toRender.map((squareProp, fileIndex) => {
                          return (
                            (this.props.enableDragAndDrop) ? 
                            <DroppableSquare 
                              {...squareProp}
                              // droppableId={`droppable-${rankIndex * this.props.boardSize + fileIndex}`}
                              enableDragAndDrop={this.props.enableDragAndDrop}
                              color={(rankIndex + fileIndex) % 2 === 0 ? "light" : "dark"}
                              onSquareClick={this.props.handleSquareClick}
                              onContextMenu={this.props.handleSquareRightClick}
                              key={rankIndex * this.props.boardSize + fileIndex}
                            /> 
                            :
                            <Square
                              {...squareProp}
                              enableDragAndDrop={this.props.enableDragAndDrop}
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
    );
  }
}

export default Board;

export const DraggableDroppableBoard = withDndContext(Board); 