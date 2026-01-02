import React from 'react';

import DraggableWrapper from './hoc/DraggableWrapper.tsx';

import Game from './Game.tsx';

import * as helpers from '../utils/helpers.ts';
import { PieceProps } from '../utils/types.ts'
import { useUniqueId } from '@dnd-kit/utilities';

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
  icon: string = '';
  alt: string = 'Generic Piece';

  constructor(props: PieceProps) {
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
    squareId: number,
    boardState: string[],
    directions: number[],
    {
      distance = 8,
      nextSquareValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeAttacksFrom = ['L','D'], // could even put '' to indicate includeNonCaptures as well... 
    }: {
      distance?: number;
      nextSquareValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((squareFrom: number, squareTo: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeAttacksFrom?: string[];
    } = {}
  ) => {
    const legalMoves: number[] = [];

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
      while (rangeRemaining > 0 && nextSquareValidators.every(validator => validator(checkedSquare, nextSquareToCheck))) {
        if (boardState[nextSquareToCheck] === "") {
          if (includeNonCaptures) {
            legalMoves.push(nextSquareToCheck);
          }
        } else {
          // eslint-disable-next-line no-loop-func
          if (captureValidators.some(validator => validator(squareId, nextSquareToCheck))) { 
            // at least one validator true means valid capture 
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

    // TODO unique id for pieces without relying on dnd-utilities ... EUGH
    return (
      <DraggableWrapper 
        id={`draggable-${useUniqueId}`} 
      > 
        {
          (attributes, listeners, setNodeRef, transform, isDragging) => (
          <img 
            src={this.icon} 
            // src={keycodeToIcon[this.state.playercode + this.state.piececode]}
            alt={this.alt} 
            // alt={this.state.playercode + this.state.piececode}
            className="piece" 
            onClick={this.handleClick} 
            zindex={transform ? '11' : '10'}
            style={{opacity: isDragging ? 0.5 : 1}}
            // onClick={() => props.onClick(props.id)} // commented out to avoid piece click interfering with square click for now ...
            // both Piece and Square have the same onClick prop passed down from Board via Square
            // onClick={props.onClick} // i think this would pass the event object, not the square id ...

            ref={setNodeRef}
            {...attributes}
            {...listeners}
            transform={transform ? `translate3d(${transform.x}px ${transform.y}px, 0)` : undefined}
          />
          )
        }
      </DraggableWrapper>
    );
  }
}

class Pawn extends Piece {
  static alt = "Pawn";
  static piececode = "P";

  constructor(props: PieceProps) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   hasMoved: false,
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L','D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {},
    // moveDirections?: number[], // = this.moveDirections,
    // captureDirections?: number[], // = this.captureDirections,
    // startingRank: number | null = null,
  ) => {
    // // Legal pawn moves   
    // const currRank = Math.floor(squareId / 8);
    let pawnMoves: number[] = [];

    // adding pawn moves (non-captures)
    if (includeNonCaptures) {
      // pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
      pawnMoves = pawnMoves.concat(Piece.generatePieceValidMoves(
        squareId,
        boardState,
        directions || [], // moveDirections 
        {
            distance: distance, // currRank === startingRank ? 2 : 1,
            // nextSquareValidators: this.nextSquareValidators,
            // captureValidators: captureValidators,
            includeNonCaptures: true, // includeNonCaptures,
            includeAttacksFrom: [], // includeCapturesOf,
        },
      ));
    }

    // how does this work if we reference boardState from this lambda and call it in a separate function? 
    // let captureValidators = [
    //   // this first one does not work ... 
    //   ((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)),
    //   // TODO we need to pass in the enPassantTargetSquare or something 
    // ];
    // helpers.isMoveEnPassant only works *after* the move's been played
    // captureValidators.push(((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)));
    // // We need to generate the option to play it. That means we need access to history or enPassantTargetSquare Game state
    // captureValidators.push((squareFrom: number, squareTo: number) => {

    // });
    let nextSquareValidators = [((squareFrom: number, squareTo: number) => Math.abs(squareFrom % 8 - squareTo % 8) === 1)];

    // adding more pawn moves (captures)
    // pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
    pawnMoves = pawnMoves.concat(Piece.generatePieceValidMoves(
      squareId,
      boardState,
      directions || [], // captureDirections 
      {
          distance: 1,
          nextSquareValidators: nextSquareValidators,
          captureValidators: captureValidators,
          includeNonCaptures: false,
          includeAttacksFrom: includeCapturesOf,
      },
    ));

    return pawnMoves;
  }
}

export class LightPawn extends Pawn {
  static alt = "Light Pawn";
  static playercode = "L";
  static keycode = "LP";
  icon = keycodeToIcon["LP"];

  static moveDirections = [-8];
  static captureDirections = [-7, -9];

  // moveDistance = 2; // depends on board state
  static startingRank = 6;

  constructor(props: PieceProps) {
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
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {},
    enPassantTargetSquare?: number,
  ) => {
    // return super.generatePieceValidMoves(
    // return Pawn.generatePieceValidMoves(
    //   squareId,
    //   boardState,
    //   directions, // null
    //   { // investigate: what happens if these are not named? No KVPs, just CSVs ...
    //     includeNonCaptures: includeNonCaptures, // Object literal may only specify known properties
    //     includeCapturesOf: includeCapturesOf, // So variable must be named like the key of the KVP 
    //   },
    //   // this.moveDirections,
    //   // this.captureDirections,
    //   // this.startingRank,
    // );

    // // Legal pawn moves   
    const currRank = Math.floor(squareId / 8);
    let pawnMoves: number[] = [];

    // adding pawn moves (non-captures)
    if (includeNonCaptures) {
      // pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
      pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoves(
        squareId,
        boardState,
        this.moveDirections || directions || [], // moveDirections 
        {
            distance: currRank === this.startingRank ? 2 : 1,
            // nextSquareValidators: this.nextSquareValidators,
            // captureValidators: captureValidators,
            includeNonCaptures: true, // includeNonCaptures,
            includeCapturesOf: [], // includeCapturesOf,
        },
      ));
    }

    // how does this work if we reference boardState from this lambda and call it in a separate function? 
    // let captureValidators = [
    //   ((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)),
    // ];

    // helpers.isMoveEnPassant only works *after* the move's been played
    // captureValidators.push(((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)));
    captureValidators.push((squareFrom: number, squareTo: number) => squareTo === enPassantTargetSquare);

    nextMoveValidators.push((squareFrom: number, squareTo: number) => Math.abs(squareFrom % 8 - squareTo % 8) === 1);

    // adding more pawn moves (captures)
    // pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
    pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoves(
      squareId,
      boardState,
      this.captureDirections || directions || [], // captureDirections 
      {
          distance: 1,
          nextMoveValidators: nextMoveValidators,
          captureValidators: captureValidators,
          includeNonCaptures: false,
          includeCapturesOf: includeCapturesOf,
      },
    ));

    return pawnMoves;
  }

  handleClick() {
    // // highlight two squares in front, if legal moves 
    // const squareId = this.props.id;
    // this.props.onPawnClick(squareId);
    super.handleClick();
  }
}

export class DarkPawn extends Pawn {
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

  constructor(props: PieceProps) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   playercode: "D",
    //   icon: keycodeToIcon["DP"],
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {},
    enPassantTargetSquare?: number,
  ) => {
    // // return super.generatePieceValidMoves(
    // return Pawn.generatePieceValidMoves(
    //   squareId,
    //   boardState,
    //   directions,
    //   {
    //     includeNonCaptures,
    //     includeCapturesOf,
    //   },
    //   // this.moveDirections,
    //   // this.captureDirections,
    //   // this.startingRank,
    // );

    // // Legal pawn moves   
    const currRank = Math.floor(squareId / 8);
    let pawnMoves: number[] = [];

    // adding pawn moves (non-captures)
    if (includeNonCaptures) {
      // pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
      pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoves(
        squareId,
        boardState,
        this.moveDirections || directions || [], // moveDirections 
        {
            distance: currRank === this.startingRank ? 2 : 1,
            // nextSquareValidators: this.nextSquareValidators,
            // captureValidators: captureValidators,
            includeNonCaptures: true, // includeNonCaptures,
            includeCapturesOf: [], // includeCapturesOf,
        },
      ));
    }

    // how does this work if we reference boardState from this lambda and call it in a separate function? 
    // let captureValidators = [
    //   ((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)),
    // ];

    // helpers.isMoveEnPassant only works *after* the move's been played
    // captureValidators.push(((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)));
    captureValidators.push((squareFrom: number, squareTo: number) => squareTo === enPassantTargetSquare);
    nextMoveValidators.push((squareFrom: number, squareTo: number) => Math.abs(squareFrom % 8 - squareTo % 8) === 1);

    // adding more pawn moves (captures)
    // pawnMoves = pawnMoves.concat(super.generatePieceValidMoves(
    pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoves(
      squareId,
      boardState,
      this.captureDirections || directions || [], // captureDirections 
      {
          distance: 1,
          nextMoveValidators: nextMoveValidators,
          captureValidators: captureValidators,
          includeNonCaptures: false,
          includeCapturesOf: includeCapturesOf,
      },
    ));

    return pawnMoves;
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
    (square: number, nextSquare: number) => Math.abs((square % 8) - (nextSquare % 8)) <= 2,
    (square: number, nextSquare: number) => Math.abs(Math.floor(square / 8) - Math.floor(nextSquare / 8)) <= 2,
    // could also add a validator to make sure delta-rank + delta-file add up to 3, and both are not 0
  ];

  constructor(props: PieceProps) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   alt: "Knight",
    //   piececode: "N",
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L','D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Piece.generatePieceValidMoves(
      squareId,
      boardState,
      this.directions, // directions || this.directions,
      {
          distance: this.distance,
          nextSquareValidators: this.nextSquareValidators,
          // captureValidators: [],
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
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    return Knight.generatePieceValidMoves(
      squareId,
      boardState,
      directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      }
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
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    return Knight.generatePieceValidMoves(
      squareId,
      boardState,
      directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      }
    );
  }
}

class Bishop extends Piece {
  static alt = "Bishop";
  static piececode = "B";

  static directions = [-9, -7, 7, 9];
  // static moveDistance = 7; // or length of board
  static nextSquareValidators = [
    (square: number, nextSquare: number) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) === 1,
    (square: number, nextSquare: number) => Math.abs(square % 8 - nextSquare % 8) === 1,
  ]

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "Bishop",
  //   //   piececode: "B",
  //   // }
  // }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L','D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Piece.generatePieceValidMoves(
      squareId,
      boardState,
      directions || this.directions,
      {
          // distance: this.distance,
          nextSquareValidators: this.nextSquareValidators, // nextMoveValidators || this.nextSquareValidators,
          // captureValidators: [],
          includeNonCaptures: includeNonCaptures,
          includeAttacksFrom: includeCapturesOf,
      },
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Bishop.generatePieceValidMoves(
      squareId,
      boardState,
      directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Bishop.generatePieceValidMoves(
      squareId,
      boardState,
      directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    );
  }
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
    (square: number, nextSquare: number) => (Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) ^ Math.abs(square % 8 - nextSquare % 8)) === 0b1,
    (square: number, nextSquare: number) => (Math.floor(nextSquare / 8) === Math.floor(square / 8)) !== (square % 8 === nextSquare % 8),
  ];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "Rook",
  //   //   piececode: "R",
  //   // }
  // }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L','D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Piece.generatePieceValidMoves(
      squareId,
      boardState,
      directions || this.directions,
      {
          // distance: this.distance,
          nextSquareValidators: this.nextSquareValidators, // nextMoveValidators || this.nextSquareValidators,
          // captureValidators: [],
          includeNonCaptures: includeNonCaptures,
          includeAttacksFrom: includeCapturesOf,
      },
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Rook.generatePieceValidMoves(
      squareId,
      boardState,
      directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    // return super.generatePieceValidMoves(
    // return this.generatePieceValidMoves(
    return Rook.generatePieceValidMoves(
      squareId,
      boardState,
      directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L','D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    return Bishop.generatePieceValidMoves(
      squareId, 
      boardState, 
      Bishop.directions,
      { 
        includeNonCaptures: includeNonCaptures, 
        includeCapturesOf: includeCapturesOf 
      })
      .concat(Rook.generatePieceValidMoves(
        squareId, 
        boardState, 
        Rook.directions,
        {
          includeNonCaptures: includeNonCaptures, 
          includeCapturesOf: includeCapturesOf,
        }
      )
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    return LightBishop.generatePieceValidMoves(
      squareId, 
      boardState, 
      LightBishop.directions,
      {
        includeNonCaptures, 
        includeCapturesOf,
      }
    ).concat(LightRook.generatePieceValidMoves(
      squareId, 
      boardState, 
      LightRook.directions,
      {
        includeNonCaptures, 
        includeCapturesOf,
      })
    );
  }
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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 8,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
  ) => {
    return DarkBishop.generatePieceValidMoves(
      squareId, 
      boardState, 
      DarkBishop.directions, 
      {
        includeNonCaptures, 
        includeCapturesOf,
      }
    ).concat(DarkRook.generatePieceValidMoves(
        squareId, 
        boardState, 
        DarkRook.directions, 
        {
          includeNonCaptures, 
          includeCapturesOf
        }
      )
    );
  }
}

export class King extends Piece {
  static alt = "King";
  static piececode = "K";

  static directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  static distance = 1;
  static nextSquareValidators = [
    (oldSquare: number, newSquare: number) => Math.abs(Math.floor(newSquare / 8) - Math.floor(oldSquare / 8)) <= 1,
    (oldSquare: number, newSquare: number) => Math.abs(newSquare % 8 - oldSquare % 8) <= 1,
  ];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "King",
  //   //   piececode: "K",
  //   // }
  // }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L','D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {}
    // includeCastling = false,
    // currentGameState = null,
    // startingSquare = null,
    // hasCastlingRights = {
    //   qs = true,
    //   ks = true,
    // } = {},
  ) => {
    // // Legal king moves   
    let kingMoves: number[] = [];

    // adding regular king moves 
    // kingMoves = kingMoves.concat(super.generatePieceValidMoves(
    kingMoves = kingMoves.concat(Piece.generatePieceValidMoves(
      squareId,
      boardState,
      this.directions,
      {
          distance: this.distance,
          nextSquareValidators: this.nextSquareValidators,
          includeNonCaptures: includeNonCaptures,
          includeAttacksFrom: includeCapturesOf,
      },
    ));

    return kingMoves;
  }
}

export class LightKing extends King {
  static alt = "Light King";
  static playercode = "L";
  static keycode = "LK";
  icon = keycodeToIcon["LK"];

  static startingSquare = 60;

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LK"],
  //   // }
  // }

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['D'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {},
    includeCastling: boolean = false,
    currentGameState?: Game,
    // startingSquare = null,
    // hasCastlingRights = {
    //   qs = true,
    //   ks = true,
    // } = {},
  ) => {
    // let kingMoves = super.generatePieceValidMoves(
    let kingMoves = King.generatePieceValidMoves(
      squareId,
      boardState,
      this.directions, // directions || this.directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    )

    // console.log(`In LightKing#generatePieceValidMoves\n\tFound regular moves valid: ${kingMoves}\n\tincludeCastling: ${includeCastling}\n\tcurrentGameState: ${currentGameState}`);

    if (includeCastling && currentGameState) {
      kingMoves = kingMoves.concat(helpers.getCastlingOptions(this.playercode, currentGameState));
    }

    return kingMoves;
  }
}

export class DarkKing extends King {
  static alt = "Dark King";
  static playercode = "D";
  static keycode = "DK";
  icon = keycodeToIcon["DK"];

  static startingSquare = 4;

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

  static generatePieceValidMoves = (
    squareId: number,
    boardState: string[], // = this.state.pieceKeys,
    directions?: number[], // can modify directions of the knight with input 
    {
      distance = 1,
      nextMoveValidators = [],
      captureValidators = [],
      includeNonCaptures = true,
      includeCapturesOf = ['L'],
    }: {
      distance?: number;
      nextMoveValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      captureValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
      includeNonCaptures?: boolean;
      includeCapturesOf?: string[];
    } = {},
    includeCastling: boolean = false,
    currentGameState?: Game,
    // startingSquare = null,
    // hasCastlingRights = {
    //   qs = true,
    //   ks = true,
    // } = {},
  ) => {
    // let kingMoves = super.generatePieceValidMoves(
    let kingMoves = King.generatePieceValidMoves(
      squareId,
      boardState,
      this.directions, // directions || this.directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    )

    // console.log(`In DarkKing#generatePieceValidMoves\n\tFound regular moves valid: ${kingMoves}\n\tincludeCastling: ${includeCastling}\n\tcurrentGameState: ${currentGameState}`);

    if (includeCastling && currentGameState) {
      kingMoves = kingMoves.concat(helpers.getCastlingOptions(this.playercode, currentGameState));
    }

    return kingMoves;
  }
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