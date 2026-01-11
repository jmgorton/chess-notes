import React, { useState } from 'react';

import { withDraggable } from './hoc/DraggableWrapper.tsx';

import Game from './Game.tsx';

import * as helpers from '../utils/helpers.ts';
import { PieceProps, PieceState, PlayerKey } from '../utils/types.ts'
// import { withDraggable } from './hoc/DraggableWrapper.tsx';

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

// implements DraggableDroppableChild<HTMLImageElement> ?? 
class Piece extends React.Component<PieceProps, PieceState> {
  icon: string = ''; // TODO put something here to avoid console and rendering errors on unexpected behavior, render something silly goofy 
  alt: string = 'Generic Piece';

  constructor(props: PieceProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoveTargets = (
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
    // only the knight can possibly change two files in one step of a move, every other piece should be 1
    nextSquareValidators.push((oldSquare, newSquare) => Math.abs((oldSquare % 8) - (newSquare % 8)) <= 2); 
    // same here for rows, make sure we don't wrap around the board
    nextSquareValidators.push((oldSquare, newSquare) => Math.abs(Math.floor(oldSquare / 8) - Math.floor(newSquare / 8)) <= 2); 

    captureValidators.push((squareFrom, squareTo) => includeAttacksFrom?.includes(boardState[squareTo]?.charAt(0)) || false);
    // captureValidators.push((squareFrom, squareTo) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState));
    // if (squareId === 27) console.log(`In Pawn#generatePieceValidMoveTargets: captureValidators: ${captureValidators}`);

    directions.forEach((direction) => {
      let checkedSquare = squareId;
      let nextSquareToCheck = checkedSquare + direction;
      let rangeRemaining = distance;
      // TODO refactor this, less duplication 
      // eslint-disable-next-line no-loop-func
      while (rangeRemaining > 0 && nextSquareValidators.every(validator => validator(checkedSquare, nextSquareToCheck))) {
        if (boardState[nextSquareToCheck] === "") {
          if (includeNonCaptures) {
            legalMoves.push(nextSquareToCheck);
          }
          // eslint-disable-next-line no-loop-func
          if (captureValidators.some(validator => validator(squareId, nextSquareToCheck))) {
            // THIS IS ONLY FOR EN PASSANT
            legalMoves.push(nextSquareToCheck);
            break;
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

  render() {
    // Render a plain image for the non-draggable Piece.
    // Draggable behavior is applied by the `withDraggable` HOC which
    // will pass `forwardedRef`, `transform`, `style`, and event listeners
    // as props onto this component.
    const { forwardedRef, transform, style, droppableId, enableDragAndDrop, ...rest } = this.props as any;

    const mergedStyle = {
      ...(style || {}),
      ...(transform ? { transform } : {}),
    };

    return (
      <img
        src={this.icon}
        alt={this.alt}
        className="piece"
        onClick={this.handleClick}
        ref={forwardedRef} // as any?? 
        style={mergedStyle}
        {...rest}
      />
    );
  }
}

// const DraggablePiece = withDraggable(Piece); 

class Pawn extends Piece {
  static alt = "Pawn";
  static piececode = "P";

  constructor(props: PieceProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
  ) => {
    // // Legal pawn moves   
    let pawnMoves: number[] = [];

    // adding pawn moves (non-captures)
    if (includeNonCaptures) {
      // pawnMoves = pawnMoves.concat(super.generatePieceValidMoveTargets(
      pawnMoves = pawnMoves.concat(Piece.generatePieceValidMoveTargets(
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
    // ts/js creates a closure and retains a reference to the variable's state, not lost as long as a reference to the lambda is retained 
    // helpers.isMoveEnPassant only works *after* the move's been played
    // captureValidators.push(((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)));

    let nextSquareValidators = [((squareFrom: number, squareTo: number) => Math.abs(squareFrom % 8 - squareTo % 8) === 1)];

    // adding more pawn moves (captures) 
    // // TODO is this necessary if we're always calling this from LightPawn/DarkPawn which already calls 2x 
    // pawnMoves = pawnMoves.concat(super.generatePieceValidMoveTargets(
    pawnMoves = pawnMoves.concat(Piece.generatePieceValidMoveTargets(
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

class LightPawn extends Pawn {
  static alt = "Light Pawn";
  static playercode = "L";
  static keycode = "LP";
  icon = keycodeToIcon["LP"];

  static moveDirections = [-8];
  static captureDirections = [-7, -9];

  static startingRank = 6;

  constructor(props: PieceProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return Pawn.generatePieceValidMoveTargets(
    //   squareId,
    //   boardState,
    //   directions, // null
    //   { // what happens if these are not named? No KVPs, just CSVs ...
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
      // pawnMoves = pawnMoves.concat(super.generatePieceValidMoveTargets(
      pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoveTargets(
        squareId,
        boardState,
        this.moveDirections, // || directions || [], // moveDirections 
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
    // ts/js creates a closure with a reference to the variable, it still has access to it as long as the lambda is accessible and the closure exists 
    // let captureValidators = [
    //   ((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)),
    // ];

    // helpers.isMoveEnPassant only works *after* the move's been played
    // captureValidators.push(((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)));
    captureValidators.push((squareFrom: number, squareTo: number) => squareTo === enPassantTargetSquare);
    // if (squareId === 27) console.log(`In Pawn#generatePieceValidMoveTargets: captureValidators: ${captureValidators}`);
    // make sure any captures don't go between a/h files ... nvm, added a guard like this in base Piece class 
    // nextMoveValidators.push((squareFrom: number, squareTo: number) => Math.abs(squareFrom % 8 - squareTo % 8) === 1);

    // adding more pawn moves (captures) // TODO remove the duplicate calls in parent Pawn class ...? 
    // pawnMoves = pawnMoves.concat(super.generatePieceValidMoveTargets(
    pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoveTargets(
      squareId,
      boardState,
      this.captureDirections, // || directions || [], // captureDirections 
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

  static startingRank = 1;

  // unlike nextSquareValidators, which require all conditions to be true, 
  // captureValidators only require at least one condition to be true 
  // captureValidators always rely on the state of the board, so don't include them 

  constructor(props: PieceProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // // Legal pawn moves   
    const currRank = Math.floor(squareId / 8);
    let pawnMoves: number[] = [];

    // adding pawn moves (non-captures)
    if (includeNonCaptures) {
      // pawnMoves = pawnMoves.concat(super.generatePieceValidMoveTargets(
      pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoveTargets(
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

    // helpers.isMoveEnPassant only works *after* the move's been played
    // captureValidators.push(((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState)));
    captureValidators.push((squareFrom: number, squareTo: number) => squareTo === enPassantTargetSquare);
    // nextMoveValidators.push((squareFrom: number, squareTo: number) => Math.abs(squareFrom % 8 - squareTo % 8) === 1);

    // adding more pawn moves (captures)
    // pawnMoves = pawnMoves.concat(super.generatePieceValidMoveTargets(
    pawnMoves = pawnMoves.concat(Pawn.generatePieceValidMoveTargets(
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

    this.handleClick = this.handleClick.bind(this);
  }

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Piece.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    return Knight.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    return Knight.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Piece.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Bishop.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Bishop.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Piece.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Rook.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    // return super.generatePieceValidMoveTargets(
    // return this.generatePieceValidMoveTargets(
    return Rook.generatePieceValidMoveTargets(
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
  static distance = 7;

  // TODO validate this
  // nextSquareValidators require all conditions to be true, so this doesn't work 
  // static nextSquareValidators = Rook.nextSquareValidators | Bishop.nextSquareValidators;

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    return Bishop.generatePieceValidMoveTargets(
      squareId, 
      boardState, 
      Bishop.directions,
      { 
        includeNonCaptures: includeNonCaptures, 
        includeCapturesOf: includeCapturesOf 
      })
      .concat(Rook.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    return LightBishop.generatePieceValidMoveTargets(
      squareId, 
      boardState, 
      LightBishop.directions,
      {
        includeNonCaptures, 
        includeCapturesOf,
      }
    ).concat(LightRook.generatePieceValidMoveTargets(
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

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    } = {},
  ) => {
    return DarkBishop.generatePieceValidMoveTargets(
      squareId, 
      boardState, 
      DarkBishop.directions, 
      {
        includeNonCaptures, 
        includeCapturesOf,
      }
    ).concat(DarkRook.generatePieceValidMoveTargets(
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

class King extends Piece {
  static alt = "King";
  static piececode = "K";

  static directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  static distance = 1;
  static nextSquareValidators = [
    (oldSquare: number, newSquare: number) => Math.abs(Math.floor(newSquare / 8) - Math.floor(oldSquare / 8)) <= 1,
    (oldSquare: number, newSquare: number) => Math.abs(newSquare % 8 - oldSquare % 8) <= 1,
  ];

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[], 
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
  ) => {
    // // Legal king moves   
    let kingMoves: number[] = [];

    // adding regular king moves 
    // kingMoves = kingMoves.concat(super.generatePieceValidMoveTargets(
    kingMoves = kingMoves.concat(Piece.generatePieceValidMoveTargets(
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

class LightKing extends King {
  static alt = "Light King";
  static playercode = "L";
  static keycode = "LK";
  icon = keycodeToIcon["LK"];

  static startingSquare = 60;

  static generatePieceValidMoveTargets = (
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
  ) => {
    // let kingMoves = super.generatePieceValidMoveTargets(
    let kingMoves = King.generatePieceValidMoveTargets(
      squareId,
      boardState,
      this.directions, // directions || this.directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    )

    if (includeCastling && currentGameState) {
      kingMoves = kingMoves.concat(helpers.getCastlingOptions(this.playercode as PlayerKey, currentGameState));
    }

    return kingMoves;
  }
}

class DarkKing extends King {
  static alt = "Dark King";
  static playercode = "D";
  static keycode = "DK";
  icon = keycodeToIcon["DK"];

  static startingSquare = 4;

  static generatePieceValidMoveTargets = (
    squareId: number,
    boardState: string[],
    directions?: number[],
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
    currentGameState?: Game, // just need castlingRights, refactor getCastlingOptions, remove this large argument 
  ) => {
    // let kingMoves = super.generatePieceValidMoveTargets(
    let kingMoves = King.generatePieceValidMoveTargets(
      squareId,
      boardState,
      this.directions, // directions || this.directions,
      {
        includeNonCaptures,
        includeCapturesOf,
      },
    )

    if (includeCastling && currentGameState) {
      // from currentGameState, require castlingRights and pieceKeys (we already have boardState here)
      kingMoves = kingMoves.concat(helpers.getCastlingOptions(this.playercode as PlayerKey, currentGameState));
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

// export const DraggablePiece<T extends Piece> = withDraggable(T);
export const DraggablePiece = withDraggable(Piece); // This works here, but can't get it to work in Square... 

// // Define the type for the class constructor
// // new (...args: any[]) => T means it's a constructor function that returns an instance of T
// type PieceConstructor<T extends Piece> = new (...args: any[]) => T;

// // HOC that takes a class constructor as an argument
// // eslint-disable-next-line 
// const withClassInstance = <T extends Piece>( // no-unused-vars 
//   WrappedComponent: React.ElementType<{ instance: T } & PieceProps>, // The component to wrap 
//   // // TODO what to put here? // ComponentType<{ instance: T } & any>
//   // Piece is not generic... for now just put React.ElementType, most generic i can find 
//   // React.ElementType<{ instance: T } & any>
//   ClassType: PieceConstructor<T> // The class constructor argument
// ) => {
//   return (props: Omit<any, 'instance'>) => {
//     // Inside the HOC, you can create and use an instance of the class
//     const [instance] = useState(() => new ClassType('Dynamic Instance')); // TODO fix this? 

//     // // You can also perform operations with the instance
//     // React.useEffect(() => {
//     //   instance.greet();
//     // }, [instance]);

//     // Pass the instance as a prop to the wrapped component
//     return <WrappedComponent instance={instance} {...props} />;
//   };
// };


// // A component designed to receive an 'instance' prop of a generic type that extends BaseClass
// // eslint-disable-next-line 
// const DraggableGenericPiece = ({ instance, ...props }: { instance: Piece }) => { // no-unused-vars
//   return (
//     <DraggableWrapper 
//       // id={`draggable-${useUniqueId('', String(Math.random() * 100))}`} 
//       id={`draggable-${Math.random() * 100}`}
//     > 
//       {
//         (attributes, listeners, setNodeRef, transform, isDragging) => (
//           <img 
//             src={instance.icon} 
//             alt={instance.alt} 
//             className="piece" 
//             // onClick={instance.handleClick} 
//             // zindex={10}

//             // DRAGGABLE attributes
//             zindex={transform ? '11' : '10'}
//             style={{opacity: isDragging ? 0.5 : 1}}
//             ref={setNodeRef}
//             {...attributes}
//             {...listeners}
//             transform={transform ? `translate3d(${transform.x}px ${transform.y}px, 0)` : undefined}
//             // ref={instance.props.forwardedRef}
//           />
//         )
//       }
//     </DraggableWrapper>
//   );
// };

export function getPieceTypeByKeycode(keycode: keyof typeof keycodeToComponent): typeof Piece {
  return keycodeToComponent[keycode as keyof typeof keycodeToComponent];
}

export function getPieceElementByKeycode(keycode: string, getDraggablePiece: boolean = false, draggableId?: string): React.ReactElement<any, any> { // | ((props: any) => React.JSX.Element) {
  if (!(keycode in keycodeToComponent)) {
    return <></>
  }

  const componentTypeToReturn = keycodeToComponent[keycode as keyof typeof keycodeToComponent];
  if (getDraggablePiece) {
    // Return the `WrappedComponent` wrapped with the `withDraggable` HOC.
    // We create the wrapped component type and return an element instance.
    const Wrapped = withDraggable(componentTypeToReturn);
    const props = draggableId ? { id: draggableId } : undefined;
    return React.createElement(Wrapped, props);
  } else {
    return React.createElement(componentTypeToReturn);
  }
}

export default Piece;