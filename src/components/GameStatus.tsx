import React, { MouseEventHandler } from 'react';

import {
  GameStatusProps,
  GameStatusState,
} from '../utils/types.ts';

import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

class GameStatus extends React.Component<GameStatusProps, GameStatusState> {
  //   constructor(props) {
  //     super(props);
  //   }

  // gameHistory = this.props.history;
  // const current = history[this.state.stepNumber];
  // const squares = current.squares;

  // moves = this.props.history.map((step, move) => {
  //   const desc = move ? 'Go to move #' + move : 'Go to game start';
  //   return (
  //     <li key={move}>
  //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
  //     </li>
  //   );
  // });

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

  render() {
    // const winner = null; //calculateWinner(current.squares);

    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.props.whiteToPlay ? 'White' : 'Black');
    // }

    return (
      <div className="game-info">
        {/* <div>{status}</div> */}
        {/* <ol>{this.moves}</ol> */}
        <ol>
          {
            this.props.history.filter((_, moveNumber) => moveNumber % 2 === 0)
              .map((whiteMoveHistoryPly, moveNumber) => {
                const plyNumber = moveNumber * 2;
                // let correspondingBlackMoveHistoryPlyINN = null;
                let correspondingBlackMoveHistoryPlyAN = null;
                if (this.props.history.length > plyNumber + 1) {
                  // correspondingBlackMoveHistoryPlyINN = this.props.history[moveNumber * 2 + 1].INN;
                  correspondingBlackMoveHistoryPlyAN = this.props.history[moveNumber * 2 + 1].AN;
                }
                return (
                  <li key={plyNumber}>
                    <div className="move-row">
                      <span className="white-move">{whiteMoveHistoryPly.AN}</span><span className="black-move">{correspondingBlackMoveHistoryPlyAN}</span>
                    </div>
                  </li>
                )
              })
          }
        </ol>
        <div className="game-controls">
          <IconButton
            color="inherit"
            aria-label="undo move"
            onClick={this.props.handleUndoClick}
          // edge="start"
          // sx={[
          //   {
          //     marginRight: 5,
          //   },
          // ]}
          >
            <NavigateBeforeIcon fontSize='small' />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="reset board"
            onClick={this.props.handleResetClick}
          // sx={[
          //   {
          //     marginRight: 5,
          //   },
          // ]}
          >
            <RestartAltIcon fontSize='small' />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="redo move"
            onClick={this.props.handleRedoClick}
          // edge="end"
          // sx={[
          //   {
          //     marginRight: 5,
          //   },
          // ]}
          >
            <NavigateNextIcon fontSize='small' />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default GameStatus;