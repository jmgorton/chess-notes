import React from 'react';

import * as helpers from '../utils/helpers.ts';

// Use public resources so filenames remain predictable in production.
// Put the PNGs in `public/resources` and reference them via PUBLIC_URL.
const PUBLIC = process.env.PUBLIC_URL || '';

const keycodeToIcon = {
  'LR': PUBLIC + '/resources/rlt60.png',
  'LP': PUBLIC + '/resources/plt60.png',
  'LB': PUBLIC + '/resources/blt60.png',
  'LN': PUBLIC + '/resources/nlt60.png',
  'LQ': PUBLIC + '/resources/qlt60.png',
  'LK': PUBLIC + '/resources/klt60.png',
  'DR': PUBLIC + '/resources/rdt60.png',
  'DP': PUBLIC + '/resources/pdt60.png',
  'DB': PUBLIC + '/resources/bdt60.png',
  'DN': PUBLIC + '/resources/ndt60.png',
  'DQ': PUBLIC + '/resources/qdt60.png',
  'DK': PUBLIC + '/resources/kdt60.png',
}

class Piece extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    // }
    this.handleClick = this.handleClick.bind(this);
    // if (this.state.piececode === 'Q') alert("Piece constructor"); 
  }

  // in order to allow generatePawnValidMoves to call this method, we also have to include a captureValidator input function
  // all other pieces' captureValidator inputs will be the same, what exists: the piece at the target is not the same color as the piece at the source 
  // the existing nextSquareValidators input is more like a validPieceMovenextSquareValidators input 
  // it would be nice if I could access the Piece objects and use their internal properties to store/call these methods, but whatever 

  // TODO refactoring includeCaptures and includeSelfCaptures to instead be contained in one includeAttacksFrom (or rename to includeCapturesOf or smth) 
  static generatePieceValidMoves = (
    squareId,
    boardState,
    directions,
    {
      distance = 8,
      nextSquareValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeAttacksFrom = ['L','D'], // could even put '' to indicate includeNonCaptures as well... 
    } = {},
  ) => {
    const legalMoves = [];

    // if (!directions) return legalMoves; // not necessary 

    nextSquareValidators.push((oldSquare, newSquare) => oldSquare >= 0 && newSquare >= 0);
    nextSquareValidators.push((oldSquare, newSquare) => oldSquare < 64 && newSquare < 64);

    captureValidators.push((squareFrom, squareTo) => includeAttacksFrom?.includes(boardState[squareTo]?.charAt(0)) || false);
    // captureValidators.push((squareFrom, squareTo) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState));

    // selfCaptureValidators.push((squareFrom: number, squareTo: number) => boardState[squareFrom]?.charAt(0) === boardState[squareTo]?.charAt(0));
    // selfCaptureValidators.push((squareFrom: number, squareTo: number) => squareTo === squareToImagineFriendly);


    directions.forEach((direction) => {
      let checkedSquare = squareId;
      let nextSquareToCheck = checkedSquare + direction;
      let rangeRemaining = distance;
      // eslint-disable-next-line no-loop-func
      while (rangeRemaining > 0 && nextSquareValidators.every(validator => validator(checkedSquare, nextSquareToCheck))) { // (checkedSquare: number, nextSquareToCheck: number) => boolean:
        if (boardState[nextSquareToCheck] === "") {
          if (includeNonCaptures) {
            legalMoves.push(nextSquareToCheck);
          }
        } else {
          // eslint-disable-next-line no-loop-func
          if (captureValidators.some(validator => validator(squareId, nextSquareToCheck))) { // at least one validator true means valid capture 
            legalMoves.push(nextSquareToCheck);
          }
          break;
        }
        checkedSquare = nextSquareToCheck;
        nextSquareToCheck = checkedSquare + direction;
        rangeRemaining -= 1;
      }
    })

    return legalMoves;
  }

  handleClick() {
    // alert("Clicked on a piece: " + this.state.playercode + this.state.piececode + 
    //   " (icon: " + this.state.icon + " | " + keycodeToIcon[this.state.playercode + this.state.piececode]);
  }

  testEvent() {
    alert("This is a test event from Piece");
  }

  render() {
    return (
      <img 
        src={this.icon} 
        // src={keycodeToIcon[this.state.playercode + this.state.piececode]}
        alt={this.alt} 
        // alt={this.state.playercode + this.state.piececode}
        className="piece" 
        onClick={this.handleClick} 
        zindex="10"
        // onClick={() => props.onClick(props.id)} // commented out to avoid piece click interfering with square click for now ...
        // both Piece and Square have the same onClick prop passed down from Board via Square
        // onClick={props.onClick} // i think this would pass the event object, not the square id ...
      />
    );
  }
}

class Pawn extends Piece {
  static alt = "Pawn";
  static piececode = "P";

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   hasMoved: false,
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId,
    boardState,
    includeNonCaptures = true,
    includeCapturesOf = ['L','D'],
    moveDirections = this.moveDirections,
    captureDirections = this.captureDirections,
    startingRank = null,
  ) => {
    // // Legal pawn moves   
    const currRank = Math.floor(squareId / 8);
    let pawnMoves = [];

    // adding pawn moves (non-captures)
    if (includeNonCaptures) {
      pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
        squareId,
        boardState,
        moveDirections,
        {
            distance: currRank === startingRank ? 2 : 1,
            // nextSquareValidators: this.nextSquareValidators,
            // captureValidators: captureValidators,
            includeNonCaptures: true, // includeNonCaptures,
            includeAttacksFrom: [], // includeCapturesOf,
        },
      ));
    }

    // if (includeNonCaptures) {
    //   pawnMoves = pawnMoves.concat(
    //     this.generatePieceValidNonCaptureMoves(
    //       squareId,
    //       // playerCode === 'L' ? [-8] : [8],
    //       this.moveDirections,
    //       {
    //         distance: (currRank === (playerCode === 'L' ? 6 : 1)) ? 2 : 1,
    //       },
    //       boardState
    //     )
    //   );
    // }

    // how does this work if we reference boardState from this lambda and call it in a separate function? 
    let captureValidators = [((squareFrom, squareTo) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState))];
    let nextSquareValidators = [((squareFrom, squareTo) => Math.abs(squareFrom % 8 - squareTo % 8) === 1)];

    // adding more pawn moves (captures)
    pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
      squareId,
      boardState,
      captureDirections,
      {
          distance: 1,
          nextSquareValidators: nextSquareValidators,
          captureValidators: captureValidators,
          includeNonCaptures: false,
          includeAttacksFrom: includeCapturesOf,
      },
    ));

    // pawnMoves = pawnMoves.concat(
    //   this.generatePieceValidCaptureMoves(
    //     squareId,
    //     playerCode === 'L' ? [-7, -9] : [7, 9],
    //     1,
    //     {
    //       // distance: 1,
    //       captureValidators: [
    //         (squareFrom, squareTo) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState),
    //       ],
    //     },
    //     boardState,
    //   )
    // )

    // if (includeAttacksFrom.includes(playerCode)) {
    //   pawnMoves = pawnMoves.concat(
    //     this.generatePieceValidSelfCaptureMoves(
    //       squareId,
    //       playerCode === 'L' ? [-7, -9] : [7, 9],
    //       {
    //         distance: 1,
    //       },
    //       boardState,
    //     )
    //   )
    // }

    return pawnMoves;
  }

  // handleClick() {
  //   const squareId = this.props.id;
  //   this.props.onPawnClick(squareId);
  // }
}

class LightPawn extends Pawn {
  static alt = "Light Pawn";
  static playercode = "L";
  static keycode = "LP";
  icon = keycodeToIcon["LP"];

  static moveDirections = [-8];
  static captureDirections = [-7, -9];

  // moveDistance = 2; // depends on board state
  static startingRank = 6;

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   // hasMoved: false,
    //   // moveDistance: 2,
    //   moves: [-8],
    //   // playercode: "L",
    //   // keycode: "LP",
    //   // icon: keycodeToIcon["LP"],
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId,
    boardState,
    includeNonCaptures = true,
    includeCapturesOf = ['D'],
  ) => {
    return super.generatePieceValidMoves(
      squareId,
      boardState,
      includeNonCaptures,
      includeCapturesOf,
      this.moveDirections,
      this.captureDirections,
      this.startingRank,
    );
  }

  handleClick() {
    // // highlight two squares in front, if legal moves 
    // const squareId = this.props.id;
    // this.props.onPawnClick(squareId);
    super.handleClick();
  }
}

class DarkPawn extends Pawn {
  static alt = "Dark Pawn";
  static playercode = "D";
  static keycode = "DP";
  icon = keycodeToIcon["DP"];

  static moveDirections = [8];
  static captureDirections = [7, 9];

  // moveDistance = 2; // put in state and alter after first move 
  static startingRank = 1;

  // unlike nextSquareValidators, which require all conditions to be true, 
  // captureValidators only require at least one condition to be true 
  // captureValidators always rely on the state of the board, so don't include them 

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   playercode: "D",
    //   icon: keycodeToIcon["DP"],
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId,
    boardState,
    includeNonCaptures = true,
    includeCapturesOf = ['L'],
  ) => {
    return super.generatePieceValidMoves(
      squareId,
      boardState,
      includeNonCaptures,
      includeCapturesOf,
      this.moveDirections,
      this.captureDirections,
      this.startingRank,
    );
  }

  handleClick() {
    // highlight two squares in front, if legal moves, considering orientation of board 
    // get id of this piece
    // set isHighlighted state of pieces with id+8, id+16 to true
    super.handleClick();
  }
}

class Knight extends Piece {
  static alt = "Knight";
  static piececode = "N";

  static directions = [-17, -15, -10, -6, 6, 10, 15, 17];
  static distance = 1;
  static nextSquareValidators = [
    (square, nextSquare) => Math.abs((square % 8) - (nextSquare % 8)) <= 2,
    (square, nextSquare) => Math.abs(Math.floor(square / 8) - Math.floor(nextSquare / 8)) <= 2,
    // could also add a validator to make sure delta-rank + delta-file add up to 3, and both are not 0
  ];

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   alt: "Knight",
    //   piececode: "N",
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId,
    boardState, // = this.state.pieceKeys,
    includeNonCaptures = true,
    includeCapturesOf = ['L','D'],
  ) => {
    return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
      squareId,
      boardState,
      this.directions,
      {
          distance: this.distance,
          nextSquareValidators: this.nextSquareValidators,
          includeNonCaptures: includeNonCaptures,
          includeAttacksFrom: includeCapturesOf,
      },
    );
  }

  handleClick() {
    super.handleClick();
    // alert("Clicked on a Knight");
  }
}

class LightKnight extends Knight {
  static alt = "Light Knight";
  static playercode = "L";
  static keycode = "LN";
  icon = keycodeToIcon["LN"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LN"],
  //   // }
  // }

  static generatePieceValidMoves = (
    squareId,
    boardState, // = this.state.pieceKeys,
    includeNonCaptures = true,
    includeCapturesOf = ['D'],
  ) => {
    return super.generatePieceValidMoves(
      squareId,
      boardState,
      includeNonCaptures,
      includeCapturesOf,
    );
  }
}

class DarkKnight extends Knight {
  static alt = "Dark Knight";
  static playercode = "D";
  static keycode = "DN";
  icon = keycodeToIcon["DN"];
  
  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DN"],
  //   // }
  // }

  static generatePieceValidMoves = (
    squareId,
    boardState, // = this.state.pieceKeys,
    includeNonCaptures = true,
    includeCapturesOf = ['L'],
  ) => {
    return super.generatePieceValidMoves(
      squareId,
      boardState,
      includeNonCaptures,
      includeCapturesOf,
    );
  }
}

class Bishop extends Piece {
  static alt = "Bishop";
  static piececode = "B";

  static directions = [-9, -7, 7, 9];
  // static moveDistance = 7; // or length of board
  static nextSquareValidators = [
    (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) === 1,
    (square, nextSquare) => Math.abs(square % 8 - nextSquare % 8) === 1,
  ]

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "Bishop",
  //   //   piececode: "B",
  //   // }
  // }
}

class LightBishop extends Bishop {
  static alt = "Light Bishop";
  static playercode = "L";
  static keycode = "LB";
  icon = keycodeToIcon["LB"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LB"],
  //   // }
  // }
}

class DarkBishop extends Bishop {
  static alt = "Dark Bishop";
  static playercode = "D";
  static keycode = "DP";
  icon = keycodeToIcon["DB"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DB"],
  //   // }
  // }
}

class Rook extends Piece {
  static alt = "Rook";
  static piececode = "R";

  static directions = [-8, -1, 1, 8];
  // static moveDistance = 7; // or length of board 
  // making property static adds property to component class (constructor)
  //   as opposed to an instance field 
  //   alt method : relax typing to `any` -- i.e. (keycodeToComponent["R"] as any).nextSquareValidators 
  // nextSquareValidators compare a possible move at distance n >= 0 to the next possible move at distance n + 1
  // and make sure that nothing wraps around the board 
  static nextSquareValidators = [
    (square, nextSquare) => (Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) ^ Math.abs(square % 8 - nextSquare % 8)) === 0b1,
    (square, nextSquare) => (Math.floor(nextSquare / 8) === Math.floor(square / 8)) !== (square % 8 === nextSquare % 8),
  ];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "Rook",
  //   //   piececode: "R",
  //   // }
  // }
}

class LightRook extends Rook {
  static alt = "Light Rook";
  static playercode = "L";
  static keycode = "LR";
  icon = keycodeToIcon["LR"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LR"],
  //   // }
  // }
}

class DarkRook extends Rook {
  static alt = "Dark Rook";
  static playercode = "D";
  static keycode = "DR";
  icon = keycodeToIcon["DR"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DR"],
  //   // }
  // }
}

class Queen extends Piece {
  static alt = "Queen";
  static piececode = "Q";

  static directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  static distance = 7; // or length of board 

  // TODO validate this
  // nextSquareValidators require all conditions to be true, so this doesn't work 
  // static nextSquareValidators = Rook.nextSquareValidators | Bishop.nextSquareValidators;

  // possibleMoves = [-63, -56, -54, -49, -45, -36, -35, -28, -27, -21, -18, -14, -9, -7, 7, ]
  // possibleMoves = [
  //   [-63, -54, -45, -36, -27, -18, -9],
  //   [-56, -48, -40, -32, -24, -16, -8],
  //   [-49, -42, -35, -28, -21, -14, -7],
  // ]

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   isSelected: false, // this.props.isSelected || false,
  //   // }
  // }
}

class LightQueen extends Queen {
  static alt = "Light Queen";
  static playercode = "L";
  static keycode = "LQ";
  icon = keycodeToIcon["LQ"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   // }
  // }
}

class DarkQueen extends Queen {
  static alt = "Dark Queen";
  static playercode = "D";
  static keycode = "DQ";
  icon = keycodeToIcon["DQ"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DQ"],
  //   //   alt: "Dark Queen",
  //   // }
  // }
}

class King extends Piece {
  static alt = "King";
  static piececode = "K";

  static directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  static distance = 1;
  static nextSquareValidators = [
    (oldSquare, newSquare) => Math.abs(Math.floor(newSquare / 8) - Math.floor(oldSquare / 8)) <= 1,
    (oldSquare, newSquare) => Math.abs(newSquare % 8 - oldSquare % 8) <= 1,
  ];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "King",
  //   //   piececode: "K",
  //   // }
  // }
}

class LightKing extends King {
  static alt = "Light King";
  static playercode = "L";
  static keycode = "LK";
  icon = keycodeToIcon["LK"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LK"],
  //   // }
  // }
}

class DarkKing extends King {
  static alt = "Dark King";
  static playercode = "D";
  static keycode = "DK";
  icon = keycodeToIcon["DK"];

  // possibleMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
  // hmm... some of the validators need to know the layout of the other pieces on the board 
  // moveValidators = [
  //   (target) => target >= 0 && target < 64, // on board
  // ];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DK"],
  //   // }
  // }
}

export const keycodeToComponent = {
  // '': div => <div></div>,
  // '': null, // <></>, // NullPiece 
  // ' ': <></>,
  'R': Rook,
  'N': Knight,
  'B': Bishop,
  'Q': Queen,
  'K': King,
  'P': Pawn,
  'LP': LightPawn,
  'LN': LightKnight,
  'LB': LightBishop,
  'LR': LightRook,
  'LQ': LightQueen,
  'LK': LightKing,
  'DP': DarkPawn,
  'DN': DarkKnight,
  'DB': DarkBishop,
  'DR': DarkRook,
  'DQ': DarkQueen,
  'DK': DarkKing,
};

export default Piece;