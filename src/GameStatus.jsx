import React from 'react';

class GameStatus extends React.Component {
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

  render() {
    const winner = null; //calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.props.whiteToPlay ? 'White' : 'Black');
    }

    return (
      <div className="game-info">
        <div>{status}</div>
        {/* <ol>{this.moves}</ol> */}
        <ol>
          {
            this.props.history.filter((_, moveNumber) => moveNumber % 2 === 0)
              .map((whiteMoveHistoryPly, moveNumber) => {
                const plyNumber = moveNumber * 2;
                let correspondingBlackMoveHistoryPlyINN = null;
                if (this.props.history.length > plyNumber + 1) correspondingBlackMoveHistoryPlyINN = this.props.history[moveNumber * 2 + 1].INN;
                return (
                  <li key={plyNumber}>
                    {whiteMoveHistoryPly.INN} {correspondingBlackMoveHistoryPlyINN}
                  </li> 
                )
              })
          }
        </ol>
      </div>
    )
  }
}

export default GameStatus;