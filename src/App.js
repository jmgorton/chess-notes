import React from 'react';
import './App.css';

import GameStatus from './GameStatus.jsx';
// import { keycodeToComponent } from './Piece.jsx';
// import Square from './Square.jsx';
import Board from './Board.jsx';

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

const DIR = {
  N: -8,
  S: 8,
  E: 1,
  W: -1,
  NW: -9,
  NE: -7,
  SW: 7,
  SE: 9,
}

// const validPieces = ['R','N','B','Q','K','P'];
// const validPlayers = ['L','D'];

class Game extends React.Component {
  backrankStartingPositions = ['R','N','B','Q','K','B','N','R']; // can make chess960 later 
  boardSize = this.backrankStartingPositions.length;
  numSquares = this.boardSize ** 2;

  constructor(props) {
    // move the board state up here to more easily track history and handle moves like en passant, castling, etc. 
    super(props);

    let startingConfig = Array(64).fill("");
    startingConfig.fill("DP", 8, 16);
    startingConfig.splice(0, 8, ...this.backrankStartingPositions.map((piece) => "D" + piece));

    startingConfig.fill("LP", 48, 56);
    startingConfig.splice(56, 8, ...this.backrankStartingPositions.map((piece) => "L" + piece));

    // const squareProps = {
    //   // keycode: square,
    //   // id: index,
    //   // key: index,
    //   // onPawnClick: this.handlePawnClick,
    //   onSquareClick: this.handleSquareClick, 
    //   // onPawnClick: this.handlePawnClick.bind(this),
    //   // include props to a square about the squares it can move to or might find relevant?? or all squares??? 
    // }

    this.state = {
      pieceKeys: startingConfig, // we could get rid of this state entirely as well
      squareProps: startingConfig.map((pieceKey, squareId) => {
        return {
          keycode: pieceKey, // pieceId 
          id: squareId, // squareId
          key: `${squareId}-${pieceKey}-0`, // element key, must be unique, and change to force re-render 
          // TODO  don't use the reserved React keyword `key` as it gets stripped from component props. Use another name
          isHighlighted: false,
          isSelected: false,
        }
      }),
      // props:
      //   color: not necessary, doesn't change, just use rank + file data in Board render method 
      //   keycode: the pieceKey ... if you think about it, this is not necessary either, data already in the pieceKeys state
      //   id: squareId [0-63] ... same with this one, data already stored in pieceKeys state by definition of their locations
      //   key: `${squareId}-${pieceKey}-${changeKey}`
      //     squareId is the id from 0-63 of the square
      //     pieceKey is the piece id, e.g. "LK" or "DP" ... it's also not necessary to make this a part of the key since we have the changeCode/changeKey
      //     changeKey is the number of times the square has been re-rendered, increments throughout the game 
      //       (each re-render also may or may not change the pieceKey)
      //   onSquareClick: the callback function for when the square is clicked
      //   children: not necessary? we don't need to access the piece's props or inner state up here...? 
      //   isHighlighted: is the square highlighted (valid moves from squareSelected, if any) 
      //   isSelected: the square selected after the last click 

      // TODO refactor this state again, don't store components in state, just store full data context 
      //   and generate components in render method 
      // squareComponents: startingConfig.map((square, index) => {
      //   // keycodeToComponent[square]
      //   const rank = Math.floor(index / 8);
      //   const file = index % 8;
      //   const squareProps = {
      //     color: ((rank + file) % 2 === 0) ? "light" : "dark",
      //     keycode: square,
      //     id: index,
      //     key: `${index}-${square}-0`,
      //     onSquareClick: this.handleSquareClick,
      //     // children: null,
      //   }
      //   let children = null;
      //   if (square !== "") children = React.createElement(keycodeToComponent[square], squareProps);
      //   // return ((rank + file) % 2 === 0) 
      //   //   ? <LightSquare {...squareProps} children={children} /> 
      //   //   : <DarkSquare {...squareProps} children={children} /> 
      //   return <Square {...squareProps} children={children} />
      // }),


      // boardSize: this.boardSize,
      squareSelected: null,
      whiteToPlay: true,
      history: [], // don't store the initial state 
      // history: [{
      //   // squares: Array(64).fill(null),
      //   pieceKeys: startingConfig, // full state of keycodes on board at this move
      //   AN: null, // Algebraic Notation
      //   INN: null, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
      //          // TODO just realized i'm doing INN wrong... using the square id of the board, not mapping first number to the file and second to rank
      // }],
      stepNumber: 0,
    }
  }

  generatePawnLegalMoves = (squareId) => {

    // // Legal pawn moves 

    // let pawnMoves = [-8, -7, -9];
    // // let pawnMoves = piece.state.moves;
    // if (playerCode === 'L' && Math.floor(squareId / 8) === 6 || playerCode === 'D' && Math.floor(squareId / 8) === 1) pawnMoves.push(-16); // two-square opening move
    // if (playerCode === 'D') pawnMoves = pawnMoves.map(move => -move);
    // let pawnValidators = [
    //   (target) => target >= 0 && target < 64, // on board
    //   (target) => ![8, 16].includes(Math.abs(squareId - target)) || this.state.pieceKeys[target] === "", // not occupied
    //   (target) => ![7, 9].includes(Math.abs(squareId - target)) 
    //     || (this.state.pieceKeys[target] !== "" && this.state.pieceKeys[target]?.charAt(0) !== this.state.pieceKeys[squareId].charAt(0))
    //     // || (this.state.history[-1].INN === `${squareId-17}${squareId-1}` || this.state.history[-1].INN === `${squareId-15}${squareId+1}`),
    // ];
    // // let legalMoves = [];
    // // pawnMoves.forEach(move => {
    // //   const targetSquare = squareId + move;
    // //   const legalMove = pawnValidators.every(validator => validator(targetSquare));
    // //   if (legalMove) {
    // //     legalMoves.push(targetSquare);
    // //   }
    // // })
    // // return legalMoves;
    // return pawnMoves
    //   .map((move) => move + squareId)
    //   .filter((target) => pawnValidators.every(validator => validator(target)));

    if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") return [];
    const [playerCode, pieceCode] = this.state.pieceKeys[squareId].split('');
    if (this.state.whiteToPlay && playerCode !== 'L') return []; // not this player's turn
    if (pieceCode !== 'P') return []; // not a pawn 

    const pawnMultiplier = playerCode === 'L' ? 1 : -1;
    const pawnStartingRank = playerCode === 'L' ? 6 : 1;
    const currRank = Math.floor(squareId / 8);
    const currFile = squareId % 8;
    let pawnMoves = [];

    if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier] === "") {
      pawnMoves.push(squareId + DIR.N * pawnMultiplier); // one square forward
      if (currRank === pawnStartingRank && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier * 2] === "") 
        pawnMoves.push(squareId + DIR.N * pawnMultiplier * 2); // two squares forward from starting position
    }
    if (currFile !== 0) { // pawn is not on a file
      if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.W] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.W].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // capture to the north/south west
      if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].INN === `${squareId + DIR.N * pawnMultiplier * 2 + DIR.W}${squareId + DIR.W}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // en passant capture to the north/sout west
    }
    if (currFile !== 7) { // pawn is not on h file 
      if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // capture to the north/south east
      if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].INN === `${squareId + DIR.N * pawnMultiplier * 2 + DIR.E}${squareId + DIR.E}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // en passant capture to the north/south east
    }

    // TODO check if any of these moves would result in another piece being able to capture the king ... need to do this for every piece move 

    return pawnMoves;
  }

  generatePieceLegalMoves = (squareId, directions, {distance=8, validators=[]} = {}) => {
    const legalMoves = [];
    if (!directions) return legalMoves;
    directions.forEach((direction) => {
      let checkedSquare = squareId;
      let nextSquareToCheck = checkedSquare + direction;
      let rangeRemaining = distance;
      while (nextSquareToCheck >= 0 
        && nextSquareToCheck < 64 
        && rangeRemaining > 0
        // eslint-disable-next-line no-loop-func
        && validators.every(validator => validator(nextSquareToCheck, checkedSquare))
      ) {
        if (this.state.pieceKeys[nextSquareToCheck] === "") {
          legalMoves.push(nextSquareToCheck);
        } else {
          if (this.state.pieceKeys[nextSquareToCheck].charAt(0) !== this.state.pieceKeys[squareId].charAt(0)) {
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

  generateKnightLegalMoves = (squareId) => {
    const validators = [
      (square, nextSquare) => Math.abs((square % 8) - (nextSquare % 8)) <= 2,
      (square, nextSquare) => Math.abs(Math.floor(square / 8) - Math.floor(nextSquare / 8)) <= 2,
    ];
    const directions = [-17, -15, -10, -6, 6, 10, 15, 17];
    return this.generatePieceLegalMoves(squareId, directions, {distance: 1, validators: validators});
    // // Legal knight moves
    // const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
    // const knightValidators = [
    //   (target) => target >= 0 && target < 64, // on board
    //   (target) => Math.abs((target % 8) - (squareId % 8)) <= 2, // file difference <= 2
    //   (target) => Math.abs(Math.floor(target / 8) - Math.floor(squareId / 8)) <= 2, // rank difference <= 2
    //   (target) => this.state.pieceKeys[target] === "" || this.state.pieceKeys[target]?.charAt(0) !== this.state.pieceKeys[squareId].charAt(0),
    // ];
    // let knightLegalMoves = [];
    // knightMoves.forEach(move => {
    //   const targetSquare = squareId + move;
    //   const legalMove = knightValidators.every(validator => validator(targetSquare));
    //   if (legalMove) {
    //     knightLegalMoves.push(targetSquare);
    //   }
    // });
    // return knightLegalMoves;
  }

  generateBishopLegalMoves = (squareId) => {
    const validators = [
      (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) === 1,
      (square, nextSquare) => Math.abs(square % 8 - nextSquare % 8) === 1
    ];
    const directions = [-9, -7, 7, 9];
    return this.generatePieceLegalMoves(squareId, directions, {validators: validators});
  }

  generateRookLegalMoves = (squareId) => {
    const validators = [
      (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) ^ Math.abs(square % 8 - nextSquare % 8) === 0b1,
      (square, nextSquare) => Math.floor(nextSquare / 8) === Math.floor(square / 8) || square % 8 === nextSquare % 8,
    ];
    const directions = [-8, -1, 1, 8];
    return this.generatePieceLegalMoves(squareId, directions, {validators: validators});
    // const legalMoves = [];
    // const rookDirections = [-8, -1, 1, 8];
    // rookDirections.forEach((direction) => {
    //   let checkedSquare = squareId;
    //   let nextSquareToCheck = checkedSquare + direction;
    //   while (nextSquareToCheck >= 0 
    //     && nextSquareToCheck < 64 
    //     // && Math.abs(Math.floor(nextSquareToCheck / this.state.boardSize) - Math.floor(checkedSquare / this.state.boardSize)) === 1
    //     && Math.abs((nextSquareToCheck % 8) - (checkedSquare % 8) + Math.floor(nextSquareToCheck / 8) - Math.floor(checkedSquare / 8)) === 1
    //   ) {
    //     if (this.state.pieceKeys[nextSquareToCheck] === "") {
    //       legalMoves.push(nextSquareToCheck);
    //     } else {
    //       if (this.state.pieceKeys[nextSquareToCheck].charAt(0) !== this.state.pieceKeys[squareId].charAt(0)) {
    //         legalMoves.push(nextSquareToCheck);
    //       }
    //       break;
    //     }
    //     checkedSquare = nextSquareToCheck;
    //     nextSquareToCheck = checkedSquare + direction;
    //   }
    // })

    // return legalMoves;
  }

  generateQueenLegalMoves = (squareId) => {
    // there's a bug here somehow, queen was on d5 and a highlighted move was b4, or even a4 
    return this.generateBishopLegalMoves(squareId).concat(this.generateRookLegalMoves(squareId));
  }

  generateKingLegalMoves = (squareId) => {
    // TODO king validators are more complicated, have to analyze other pieces next move for possible checks...
    //   or apply, from the king's square, all possible types of piece moves and see if a piece that can make that move is on any of those squares 
    //   also have to calculate castling separately 
    const validators = [
    ];
    const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
    const legalMoves = this.generatePieceLegalMoves(squareId, directions, {distance: 1, validators: validators});
    // check for castling ... start by verifying that the king never moved, could store this info in state for a minor speedup 
    const kingStartingSquare = this.state.whiteToPlay ? 60 : 4;
    if (this.state.history.every(pastMove => !pastMove.INN.startsWith(kingStartingSquare.toString()))) {
      // check short and long castling 
      // need to verify for each side that the rook also never moved, that we have no pieces in between the king and rook, and
      // that none of the opponent's pieces can target either square that the rook or king will land on 
      //   (in short castling, this means none of the squares that are between the king and rook; in long castling, the square
      //    next to the rook *can* be targeted) 
      const shortCastleRookStartingSquare = this.state.whiteToPlay ? 63 : 7;
      const shortCastleKRLandingSquares = this.state.whiteToPlay ? [61, 62] : [5, 6];
      if (this.state.pieceKeys.slice(kingStartingSquare + 1, shortCastleRookStartingSquare).every(pieceKey => pieceKey === '')
        && this.state.history.every(pastMove => !pastMove.INN.startsWith(shortCastleRookStartingSquare.toString()))
      ) {
        if (shortCastleKRLandingSquares.every(square => this.getSquaresWithPiecesThatCanAttackThisSquare(square).length === 0)) {
          legalMoves.push(shortCastleRookStartingSquare);
        }
      }
      const longCastleRookStartingSquare = this.state.whiteToPlay ? 56 : 0;
      const longCastleKRLandingSquares = this.state.whiteToPlay ? [59, 58] : [3, 2];
      if (this.state.pieceKeys.slice(longCastleRookStartingSquare + 1, kingStartingSquare).every(pieceKey => pieceKey === '')
        && this.state.history.every(pastMove => !pastMove.INN.startsWith(longCastleRookStartingSquare.toString()))
      ) {
        if (longCastleKRLandingSquares.every(square => this.getSquaresWithPiecesThatCanAttackThisSquare(square).length === 0)) {
          legalMoves.push(longCastleRookStartingSquare);
        }
      }
    }
    return legalMoves;
  }

  legalMoveMap = {
    'P': this.generatePawnLegalMoves,
    'N': this.generateKnightLegalMoves,
    'B': this.generateBishopLegalMoves,
    'R': this.generateRookLegalMoves,
    'Q': this.generateQueenLegalMoves,
    'K': this.generateKingLegalMoves,
  }

  getLegalMoves = (squareId) => {
    if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") return [];
    if (this.state.whiteToPlay && this.state.pieceKeys[squareId]?.charAt(0) !== 'L') return []; // not this player's turn 

    // TODO first, if we're in check, we have three options:
    //   1. capture the checking piece if possible
    //   2. block the checking piece if possible
    //   3. move the king if possible
    // If none of these are possible, it's checkmate
    // If we are in a *double* check, we *must* move the king. 

    // const square = this.state.squareComponents[squareId];
    // const piece = square.props.children;
    // alert(`Square: ${JSON.stringify(square)}\nPiece: ${JSON.stringify(piece)}`);
    // const playerCode = this.state.pieceKeys[squareId].charAt(0);
    const pieceCode = this.state.pieceKeys[squareId].charAt(1);
    return pieceCode in this.legalMoveMap ? this.legalMoveMap[pieceCode](squareId) : [];

    // switch (pieceCode) {
    //   case 'P':
    //     return this.generatePawnLegalMoves(squareId);
    //   case 'N':
    //     return this.generateKnightLegalMoves(squareId);
    //   case 'B':
    //     return this.generateBishopLegalMoves(squareId);
    //   case 'R':
    //     return this.generateRookLegalMoves(squareId);
    //   case 'Q':
    //     return this.generateQueenLegalMoves(squareId);
    //   case 'K':
    //     return this.generateKingLegalMoves(squareId);
    //   default:
    //     return [];
    // }
  }

  getSquaresWithPiecesThatCanAttackThisSquare = (squareId) => {
    let squaresTargetingThisOne = [];
    return squaresTargetingThisOne;
  }

  handleSquareClick = (squareId) => {
    const squareToSelect = squareId;
    // clicking on a square for the first time (no square selected yet) 
    if (this.state.squareSelected === null || this.state.squareSelected !== squareToSelect) { // disallow multi-piece selection for now 
      // if (this.state.squareComponents[squareToSelect].props.isHighlighted) {
      if (this.state.squareProps[squareToSelect].isHighlighted) {
        // Move piece to clicked square
        // TODO here we also need to handle en passant captures, where the piece being captured is not on the square
        //   that the pawn ends up on ... 
        const squareMovedFrom = this.state.squareSelected;
        const squareMovedTo = squareToSelect;
        const pieceMoving = this.state.pieceKeys[squareMovedFrom];
        let squareIdOfPawnCapturedViaEnPassant = null;
        let squareIdOfKingAfterCastling = null;
        let squareIdOfRookAfterCastling = null;
        let castlingRook = null;
        // copy the array before mutating so React sees a new reference
        let newPieceKeys = this.state.pieceKeys.slice();

        // newPieceKeys[squareMovedFrom] = "";
        // newPieceKeys[squareMovedTo] = pieceMoving;
        // alert(`piece moving: ${pieceMoving}\nsquare moved from: ${squareMovedFrom}\nsquare moved to: ${squareMovedTo}\npiece key in state: ${this.state.pieceKeys[squareMovedTo]}`)
        if (pieceMoving.charAt(1) === 'P' // piece moving is a pawn
          && squareMovedFrom % 8 !== squareMovedTo % 8 // signifies that the pawn performed a capture (changed files) 
          && this.state.pieceKeys[squareMovedTo] === '' // signifies that the capture was an en passant 
        ) {
          // alert("An en passant occurred...");
          squareIdOfPawnCapturedViaEnPassant = squareMovedTo + DIR.N * (pieceMoving.charAt(0) === 'L' ? -1 : 1);
          newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
          newPieceKeys[squareMovedFrom] = "";
          newPieceKeys[squareMovedTo] = pieceMoving;
        } else if (pieceMoving.charAt(1) === 'K'
          && [60, 4].includes(squareMovedFrom) && [63, 56, 7, 0].includes(squareMovedTo)
        ) {
          // indicates that the king is castling 
          let directionFromKing = 1;
          if (squareMovedTo < squareMovedFrom) directionFromKing = -1;
          castlingRook = this.state.pieceKeys[squareMovedTo];
          squareIdOfKingAfterCastling = squareMovedFrom + directionFromKing * 2;
          squareIdOfRookAfterCastling = squareMovedFrom + directionFromKing;
          newPieceKeys[squareMovedFrom] = "";
          newPieceKeys[squareMovedTo] = "";
          newPieceKeys[squareIdOfRookAfterCastling] = castlingRook;
          newPieceKeys[squareIdOfKingAfterCastling] = pieceMoving;
        } else {
          newPieceKeys[squareMovedFrom] = "";
          newPieceKeys[squareMovedTo] = pieceMoving;
        }
        // if (squareIdOfPawnCapturedViaEnPassant) alert(`Square ID of pawn to remove after en passant: ${squareIdOfPawnCapturedViaEnPassant}`);
        this.setState({
          ...this.state,
          squareSelected: null,
          whiteToPlay: !this.state.whiteToPlay,


          // squareComponents: this.state.squareComponents.map((el, idx) => {
          //   // let children = null;
          //   // if (newPie !== "") children = React.createElement(keycodeToComponent[square], squareProps);
          //   // let newKeycode = el.keycode;

          //   // XXX not necessary eslint-disable-next-line no-unused-vars
          //   const [oldSquareId, oldPieceId, oldChangeCode] = el.key?.split('-');
          //   // console.log(`oldSquareId: ${oldSquareId}\toldPieceId: ${oldPieceId}\t${oldChangeCode}\n`);
          //   // let newChildren = el.children; 
          //   if (idx === squareMovedFrom || idx === squareMovedTo || idx === squareIdOfPawnCapturedViaEnPassant 
          //     || idx === squareIdOfKingAfterCastling || idx === squareIdOfRookAfterCastling) {
          //     // const [oldSquareId, oldPieceId, oldChangeCode] = el.props.key?.split('-');
          //     const newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode ? oldChangeCode + 1 : 0}`; // TODO i really gotta sort out and fix the keys 
          //     // newKeycode = (idx === squareMovedTo) ? pieceMoving : "";
          //     let newKeycode = "";
          //     let newChildren = null;
          //     // const newChildren = (idx === squareMovedTo) ? React.createElement(keycodeToComponent[pieceMoving], el.props) : null; // TODO el.props is the props from the square that previously had no piece on it
          //     if (idx === squareMovedTo) {
          //       if (squareIdOfKingAfterCastling === null && squareIdOfRookAfterCastling === null) {
          //         newKeycode = pieceMoving;
          //         newChildren = React.createElement(keycodeToComponent[pieceMoving], el.props);
          //       }
          //     } else if (idx === squareIdOfKingAfterCastling) {
          //       newKeycode = pieceMoving;
          //       newChildren = React.createElement(keycodeToComponent[pieceMoving], el.props);
          //     } else if (idx === squareIdOfRookAfterCastling) {
          //       newKeycode = castlingRook;
          //       newChildren = React.createElement(keycodeToComponent[castlingRook], el.props);
          //     }
          //     return React.cloneElement(el, 
          //       {
          //         ...el.props, 
          //         keycode: newKeycode, 
          //         isHighlighted: false, 
          //         isSelected: false, 
          //         key: newKey,
          //         children: newChildren,
          //       }
          //     );
          //   } 
          //   return React.cloneElement(el, 
          //     {
          //       ...el.props, 
          //       // keycode: newKeycode, 
          //       isHighlighted: false, 
          //       isSelected: false, 
          //       // key: `${el.props.id}-0`, 
          //       key: `${idx}-${oldPieceId}-${oldChangeCode ? oldChangeCode + 1 : 0}`
          //       // children: {newChildren} 
          //     }
          //   );
          // }),


          pieceKeys: newPieceKeys,
          squareProps: this.state.squareProps.map((squareProps, squareId) => {
            // update key and keycode to reflect the new piece placement
            let key = squareProps.key;
            if (squareProps.isHighlighted || squareProps.isSelected) {
              // eslint-disable-next-line no-unused-vars
              const [oldSquareId, oldPieceId, oldChangeCode] = key.split('-');
              key = `${oldSquareId}-${newPieceKeys[squareId]}-${oldChangeCode + 1}`;
            }
            return {
              ...squareProps,
              keycode: newPieceKeys[squareId],
              isHighlighted: false,
              isSelected: false,
              key: key,
            }
          }),
          history: this.state.history.concat([{
            pieceKeys: newPieceKeys,
            AN: null, // TODO generate Algebraic Notation for this move -- to do so, we need to know if any other 
                      //   pieces of the same type would be able to make the same move 
            INN: `${squareMovedFrom}${squareMovedTo}`, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
          }]),
        })
      } else {
        // select an unselected square and highlight the legal moves for that piece on this turn 
        const isThisPlayersMove = this.state.whiteToPlay ^ this.state.pieceKeys[squareToSelect]?.charAt(0) === 'D';
        const squaresToHighlight = isThisPlayersMove ? this.getLegalMoves(squareId) : [];
        // const squaresToHighlight = this.getLegalMoves(squareToSelect);
        this.setState({
          ...this.state,
          squareSelected: squareToSelect,


          // squareComponents: this.state.squareComponents.map((el, idx) => {
          //   const shouldHighlight = squaresToHighlight.includes(idx);
          //   const shouldSelect = (idx === squareToSelect);
          //   // if (shouldHighlight || shouldSelect) {
          //   //   const newKey = `${el.props.id}-${shouldHighlight ? '1' : '0'}`;
          //   //   return React.cloneElement(el, {...el.props, isHighlighted: shouldHighlight, isSelected: shouldSelect, key: newKey }); // !el.props.isHighlighted
          //   // } else {
          //   //   return el;
          //   // }
          //   // const [oldSquareId, oldPieceId, oldChangeId] = el.props.key.split('-');
          //   // const newKey = `${oldSquareId}-${oldPieceId}-${oldChangeId + 1}`; // this will just re-render all squares ... not very efficient ... but at least the key is using the right values
          //   const newKey = `${idx}-${el.keycode}-${shouldHighlight ? '1' : '0'}`; // el.props.id is wrong, should be el.props.keycode
          //   return React.cloneElement(el, { ...el.props, isHighlighted: shouldHighlight, isSelected: shouldSelect, key: newKey });
          // }),


          squareProps: this.state.squareProps.map((oldProps, squareId) => {
            const shouldHighlight = squaresToHighlight.includes(squareId);
            const shouldSelect = (squareId === squareToSelect);
            let newKey = oldProps.key;
            if (shouldHighlight || shouldSelect) {
              const [oldSquareId, oldPieceId, oldChangeCode] = newKey.split('-');
              newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode + 1}`;
            }
            return {
              ...oldProps,
              isHighlighted: shouldHighlight,
              isSelected: shouldSelect,
              key: newKey,
            }
          }),
        })
      }
    } else if (this.state.squareSelected === squareToSelect) {
      // Deselect the square and any highlighted legal moves 
      // const squaresToClear = this.getLegalMoves(squareId);
      // for now, let's just clear all highlights too 
      this.setState({
        ...this.state,
        squareSelected: null,
        // squareComponents: this.state.squareComponents.map((el, idx) => {
        //   // el.props.id is wrong in the key, should be el.props.keycode, also don't set the changeCode back to 0 if it exists already 
        //   let [oldSquareId, oldPieceId, changeCode] = el.key.split('-');
        //   if (el.props.isHighlighted || el.props.isSelected) changeCode += 1
        //   const newKey = `${oldSquareId}-${oldPieceId}-${changeCode}`;
        //   return React.cloneElement(el, {...el.props, isHighlighted: false, isSelected: false, key: newKey }); // key: `${idx}-${el.props.id}-0` 
        // }),
        squareProps: this.state.squareProps.map((oldProps) => {
          // update key to trigger re-render 
          let newKey = oldProps.key;
          if (oldProps.isHighlighted || oldProps.isSelected) {
            const [oldSquareId, oldPieceId, oldChangeCode] = newKey.split('-');
            newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode + 1}`;
          }
          return {
            ...oldProps,
            isHighlighted: false,
            isSelected: false,
            key: newKey,
          }
        }),
      });
    } else {

    }
  }

  // const [] = React.useState

  // TODO take this logic and put it somewhere else... was being used, not anymore 
  // handleClick(i) {
  //   // alert("Prop handler click on square " + i);

  //   const squares = this.state.squares;

  //   // also don't really know what i was doing here much ... 
  //   // const history = this.state.history.slice(0, this.state.stepNumber + 1);
  //   // // console.log(history);
  //   // const current = history[history.length - 1];
  //   // const squares = current.squares.slice();
  //   // // if (calculateWinner(squares) || squares[i]) {

  //   // this.setState({
  //   //   history: history.concat([{
  //   //     squares: squares,
  //   //   }]),
  //   //   squares: squares,
  //   //   stepNumber: history.length,
  //   //   whiteToPlay: !this.state.whiteToPlay,
  //   // });

  //   this.setState({
  //     ...this.state,
  //     history: this.state.history.concat([{
  //       squares: squares,
  //     }]),
  //     squares: squares,
  //     stepNumber: this.state.history.length,
  //     whiteToPlay: !this.state.whiteToPlay,
  //   })
  // }

  // jumpTo(step) {
  //   this.setState({
  //     stepNumber: step,
  //     whiteToPlay: (step % 2) === 0,
  //   });
  // }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            // squares={current.squares}
            // pieceKeys={this.state.pieceKeys} // WAS passing this down, but it's not necessary. Info is contained in squareProps
            // squareComponents={this.state.squareComponents}
            squareProps={this.state.squareProps}
            handleSquareClick={this.handleSquareClick}
            boardSize={this.boardSize}
            // onClick={(i) => this.handleClick(i)} // only place we pass down handleClick into onClick prop 
            // onPawnClick={(squareId) => this.handlePawnClick(squareId)}
          />
        </div>
        <GameStatus 
          whiteToPlay={this.state.whiteToPlay}
          history={this.state.history}
        />

        {/* {
          this.state.showNotes && (
            <GameNotes />
          )
        } */}

        {/* <div id="navbar">
          <Nav />
        </div> */}
      </div>
    );
  }
}

// function Nav() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//             <li>
//               <Link to="/users">Users</Link>
//             </li>
//           </ul>
//         </nav>

//         {/* A <Switch> looks through its children <Route>s and
//             renders the first one that matches the current URL. 
//             Updated <Switch> to <Routes> in React Router v6. */}
//         <Routes>
//           <Route path="/about" element={<About />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/" element={<Home />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>




    <div className="App">
      <Game />
    </div>



    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">Home</Link>
    //         </li>
    //         <li>
    //           <Link to="/about">About</Link>
    //         </li>
    //         <li>
    //           <Link to="/users">Users</Link>
    //         </li>
    //       </ul>
    //     </nav>

    //     {/* A <Switch> looks through its children <Route>s and
    //         renders the first one that matches the current URL. 
    //         Updated <Switch> to <Routes> in React Router v6. */}
    //     <Routes>
    //       <Route path="/about" element={<About />} />
    //       <Route path="/users" element={<Users />} />
    //       <Route path="/" element={<Home />} />
    //     </Routes>
    //   </div>
    // </Router>
  );
}

export default App;

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Users() {
//   return <h2>Users</h2>;
// }
