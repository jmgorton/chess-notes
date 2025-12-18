import React from 'react';
import './App.css';

import GameStatus from './GameStatus.jsx';
import { GameNotes } from './GameNotes.tsx';
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
    super(props);

    let startingConfig = Array(64).fill("");
    startingConfig.fill("DP", 8, 16);
    startingConfig.splice(0, 8, ...this.backrankStartingPositions.map((piece) => "D" + piece));

    startingConfig.fill("LP", 48, 56);
    startingConfig.splice(56, 8, ...this.backrankStartingPositions.map((piece) => "L" + piece));

    this.state = {
      pieceKeys: startingConfig, // we could get rid of this state entirely as well, or use it internally for testing moves?? 
      squareProps: startingConfig.map((pieceKey, squareId) => {
        return {
          keycode: pieceKey, // pieceId 
          id: squareId, // squareId
          // key: `${squareId}-${pieceKey}-0`, // element key, must be unique, and change to force re-render 
          // TODO  don't use the reserved React keyword `key` as it gets stripped from component props. Use another name
          isHighlighted: false,
          isAltHighlighted: false,
          isSelected: false,
          isAltSelected: false,
        }
      }),
      lightKingPosition: 60,
      darkKingPosition: 4,
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

      // boardSize: this.boardSize,
      squareSelected: null,
      squareAltSelected: null,
      whiteToPlay: true,
      history: [], // don't store the initial state 
      // history: [{
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

    // // ****** LEGAL PAWN MOVES (alt approach) ********

    // // this validation is handle in the getLegalMoves method, don't do it here in case we want to use this method other places 
    // if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") return [];
    // const [playerCode, pieceCode] = this.state.pieceKeys[squareId].split('');
    // if (this.state.whiteToPlay && playerCode !== 'L') return []; // not this player's turn
    // if (pieceCode !== 'P') return []; // not a pawn 
    const playerCode = this.state.pieceKeys[squareId].charAt(0);

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
      if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].INN === `${String(squareId + DIR.N * pawnMultiplier * 2 + DIR.W).padStart(2, '0')}${String(squareId + DIR.W).padStart(2, '0')}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // en passant capture to the north/south west
    }
    if (currFile !== 7) { // pawn is not on h file 
      if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // capture to the north/south east
      if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].INN === `${String(squareId + DIR.N * pawnMultiplier * 2 + DIR.E).padStart(2, '0')}${String(squareId + DIR.E).padStart(2, '0')}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // en passant capture to the north/south east
    }

    // // TODO check if any of these moves would result in another piece being able to capture the king ... need to do this for every piece move 
    // // so maybe just handle this in the getLegalMoves method, removing suggested moves that would leave the king attacked 

    // // LEGAL PAWN MOVES (3RD APPROACH) ... nvm that's stupid, not worth it ... or is it? 

    // const playerCode = this.state.pieceKeys[squareId].charAt(0);
    // const currRank = Math.floor(squareId / 8);
    // const currFile = squareId % 8;

    // let pawnMoves = [];

    // if (playerCode === 'L') {
    //   if (currRank === 6) pawnMoves = pawnMoves.concat(this.generatePieceLegalNonCaptureMoves(squareId, [-8], {distance: 2}));
    //   else pawnMoves = pawnMoves.concat(this.generatePieceLegalNonCaptureMoves(squareId, [-8], {distance: 1}));
    //   pawnMoves = pawnMoves.concat(this.generatePieceLegalCaptureMoves(squareId, [-7, -9], {distance: 1}));
    //   // and en passant 
    // } else if (playerCode === 'D') {

    // }

    return pawnMoves;
  }

  generatePieceLegalCaptureMoves = (squareId, directions, {distance = 8, validators = []} = {}) => {
    return this.generatePieceLegalMoves(squareId, directions, {distance: distance, validators: validators, includeNonCaptures: false});
  }

  generatePieceLegalNonCaptureMoves = (squareId, directions, {distance = 8, validators = []} = {}) => {
    return this.generatePieceLegalMoves(squareId, directions, {distance: distance, validators: validators, includeCaptures: false});
  }

  generatePieceLegalSelfCaptureMoves = (squareId, directions, {distance = 8, validators = []} = {}) => {
    return this.generatePieceLegalMoves(squareId, directions, {distance: distance, validators: validators, includeCaptures: false, includeNonCaptures: false, includeSelfCaptures: true});
  }

  // in order to allow generatePawnLegalMoves to call this method, we also have to include a captureValidator input function
  // all other pieces' captureValidator inputs will be the same, what exists: the piece at the target is not the same color as the piece at the source 
  // the existing validators input is more like a validPieceMoveValidators input 
  // it would be nice if I could access the Piece objects and use their internal properties to store/call these methods, but whatever 
  generatePieceLegalMoves = (
    squareId, 
    directions, 
    {
      distance = 8, 
      validators = [], 
      includeNonCaptures = true,
      includeCaptures = true, 
      includeSelfCaptures = false,
      squareToImagineEmpty = null, // used to test out possible moves this side may make 
      squareToImagineFriendly = null, // used to test out possible moves this side may make 
    } = {}
  ) => {
    const legalMoves = [];
    if ((squareToImagineEmpty || squareToImagineFriendly) && squareToImagineEmpty === squareToImagineFriendly) {
      console.log("Square to imagine empty can't be the same square to imagine friendly");
      return legalMoves;
    }
    if (!directions) return legalMoves;
    directions.forEach((direction) => {
      let checkedSquare = squareId;
      let nextSquareToCheck = checkedSquare + direction;
      let rangeRemaining = distance;
      while (
        nextSquareToCheck >= 0 &&
        nextSquareToCheck < 64 &&
        rangeRemaining > 0 &&
        // eslint-disable-next-line no-loop-func
        validators.every(validator => validator(nextSquareToCheck, checkedSquare))
      ) {
        if (
          nextSquareToCheck !== squareToImagineFriendly && 
          (
            this.state.pieceKeys[nextSquareToCheck] === "" || 
            nextSquareToCheck === squareToImagineEmpty
          )
        ) {
          if (includeNonCaptures) {
            legalMoves.push(nextSquareToCheck);
          }
        } else {
          if (
            // this.state.pieceKeys[squareId] === "" || // TODO validate/change later ... 
            // generating legal moves from any square without a piece on it will include pieces from either side making contact w this square 
            (
              includeCaptures && 
              this.state.pieceKeys[nextSquareToCheck].charAt(0) !== this.state.pieceKeys[squareId].charAt(0) && 
              nextSquareToCheck !== squareToImagineFriendly
            ) || 
            (
              includeSelfCaptures && 
              (
                this.state.pieceKeys[nextSquareToCheck].charAt(0) === this.state.pieceKeys[squareId].charAt(0) || 
                nextSquareToCheck === squareToImagineFriendly
              )
            )
          ) {
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

  generateKnightLegalMoves = (squareId, includeSelfCaptures = false, squareToImagineEmpty = null, squareToImagineFriendly = null) => {
    const validators = [
      (square, nextSquare) => Math.abs((square % 8) - (nextSquare % 8)) <= 2,
      (square, nextSquare) => Math.abs(Math.floor(square / 8) - Math.floor(nextSquare / 8)) <= 2,
    ];
    const directions = [-17, -15, -10, -6, 6, 10, 15, 17];
    return this.generatePieceLegalMoves(
      squareId, 
      directions, 
      {
        distance: 1, 
        validators: validators, 
        includeSelfCaptures: includeSelfCaptures,
        squareToImagineEmpty: squareToImagineEmpty,
        squareToImagineFriendly: squareToImagineFriendly,
      }
    );
  }

  generateBishopLegalMoves = (squareId, includeSelfCaptures = false, squareToImagineEmpty = null, squareToImagineFriendly = null) => {
    const validators = [
      (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) === 1,
      (square, nextSquare) => Math.abs(square % 8 - nextSquare % 8) === 1,
    ];
    const directions = [-9, -7, 7, 9];
    return this.generatePieceLegalMoves(
      squareId, 
      directions, 
      {
        validators: validators, 
        includeSelfCaptures: includeSelfCaptures,
        squareToImagineEmpty: squareToImagineEmpty,
        squareToImagineFriendly: squareToImagineFriendly,
      }
    );
  }

  generateRookLegalMoves = (squareId, includeSelfCaptures = false, squareToImagineEmpty = null, squareToImagineFriendly = null) => {
    const validators = [
      (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) ^ Math.abs(square % 8 - nextSquare % 8) === 0b1,
      (square, nextSquare) => Math.floor(nextSquare / 8) === Math.floor(square / 8) || square % 8 === nextSquare % 8,
    ];
    const directions = [-8, -1, 1, 8];
    return this.generatePieceLegalMoves(
      squareId, 
      directions, 
      {
        validators: validators, 
        includeSelfCaptures: includeSelfCaptures,
        squareToImagineEmpty: squareToImagineEmpty,
        squareToImagineFriendly: squareToImagineFriendly,
      }
    );
  }

  // add squareToImagineEmpty = null, squareToImagineFriendly = null here??? idts 
  generateQueenLegalMoves = (squareId, includeSelfCaptures = false) => {
    // there's a bug here somehow, queen was on d5 and a highlighted move was b4, or even a4 ... maybe it's fixed now 
    return this.generateBishopLegalMoves(squareId, includeSelfCaptures)
      .concat(this.generateRookLegalMoves(squareId, includeSelfCaptures));
  }

  generateKingLegalMoves = (squareId, includeSelfCaptures = false, includeCastling = true) => {
    // TODO king validators are more complicated, have to analyze other pieces next move for possible checks...
    //   or apply, from the king's square, all possible types of piece moves and see if a piece that can make that move is on any of those squares 
    const validators = [
    ];
    const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
    const legalMoves = this.generatePieceLegalMoves(squareId, directions, {distance: 1, validators: validators, includeSelfCaptures: includeSelfCaptures});

    // avoid the infinite loop from getSquaresWithPiecesThatCanAttackThisSquare calling generateKingLegalMoves and trying to check for castling as an attack 
    if (!includeCastling) return legalMoves;

    // check for castling ... start by verifying that the king never moved, could store this info in state for a minor speedup 
    const kingStartingSquare = this.state.whiteToPlay ? 60 : 4; // TODO remove this assumption ?? 
    if (squareId !== kingStartingSquare) return legalMoves;
    if (this.state.history.some(pastMove => pastMove.INN.startsWith(String(kingStartingSquare).padStart(2, '0')))) return legalMoves;

    // check short and long castling 
    // need to verify for each side that the rook also never moved, that we have no pieces in between the king and rook, and
    // that none of the opponent's pieces can target either square that the rook or king will land on 
    //   (in short castling, this means none of the squares that are between the king and rook; in long castling, the square
    //    next to the rook *can* be targeted) 
    const playerCode = this.state.pieceKeys[squareId].charAt(0);
    const shortCastleRookStartingSquare = this.state.whiteToPlay ? 63 : 7;
    const shortCastleKingSafetySquares = this.state.whiteToPlay ? [60, 61, 62] : [4, 5, 6];
    if (this.state.pieceKeys.slice(kingStartingSquare + 1, shortCastleRookStartingSquare).every(pieceKey => pieceKey === '')
      && this.state.history.every(pastMove => !pastMove.INN.startsWith(String(shortCastleRookStartingSquare).padStart(2, '0')))
    ) {
      if (shortCastleKingSafetySquares
          .every(square => this.getSquaresWithPiecesThatCanAttackThisSquare(square) 
            .filter((square) => this.state.pieceKeys[square].charAt(0) !== playerCode).length === 0
          )
      ) {
        legalMoves.push(shortCastleRookStartingSquare);
      }
    }
    const longCastleRookStartingSquare = this.state.whiteToPlay ? 56 : 0;
    const longCastleKingSafetySquares = this.state.whiteToPlay ? [60, 59, 58] : [4, 3, 2];
    if (this.state.pieceKeys.slice(longCastleRookStartingSquare + 1, kingStartingSquare).every(pieceKey => pieceKey === '')
      && this.state.history.every(pastMove => !pastMove.INN.startsWith(String(longCastleRookStartingSquare).padStart(2, '0')))
    ) {
      if (longCastleKingSafetySquares
          .every(square => this.getSquaresWithPiecesThatCanAttackThisSquare(square) 
            .filter((square) => this.state.pieceKeys[square].charAt(0) !== playerCode)
            .length === 0
          )
      ) {
        legalMoves.push(longCastleRookStartingSquare);
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

  isKingInCheck = () => {
    // maybe here we can easily set like a canBlock, canCapture, canEvade boolean state system ...
    // canBlock seems like the only tricky one, gotta check all piece moves 
    let attackingSquares = this.getSquaresWithPiecesThatCanAttackThisSquare(
      this.state.whiteToPlay ? 
        this.state.darkKingPosition : 
        this.state.lightKingPosition, // TODO make sure this state is actually getting updated on moves 
      false
    );
    return attackingSquares.length !== 0;
  }

  isCheckmate = () => {

  }

  isMoveEnPassant = (squareMovedFrom, squareMovedTo) => {
    const pieceMoving = this.state.pieceKeys[squareMovedFrom];
    return (
      pieceMoving.charAt(1) === 'P' // piece moving is a pawn
      && squareMovedFrom % 8 !== squareMovedTo % 8 // signifies that the pawn performed a capture (changed files) 
      && this.state.pieceKeys[squareMovedTo] === '' // signifies that the capture was an en passant 
    )
  }

  isMoveCastling = (squareMovedFrom, squareMovedTo) => {
    const pieceMoving = this.state.pieceKeys[squareMovedFrom];
    return (
      pieceMoving.charAt(1) === 'K'
      && [60, 4].includes(squareMovedFrom) && [63, 56, 7, 0].includes(squareMovedTo)
    )
  }

  wouldKingBeInCheckAfterMove = (squareMovedFrom, squareMovedTo) => {
    // we might need to be careful if we use state pieceKeys to test out moves... 
    // that is what a lot of our function logic references, which is good, but make sure that
    // none of the render logic uses that, and be sure to set it back correctly to not update the board 

    // or take a different approach
    // const playerCode = this.state.pieceKeys[squareMovedFrom].charAt(0);
    // const playerCode = this.state.whiteToPlay ? "L" : "D";
    const pieceCode = this.state.pieceKeys[squareMovedFrom].charAt(1);
    const kingPosition = this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition;
    if (pieceCode !== 'K')
      return this.getSquaresWithPiecesThatCanAttackThisSquare(
        // playerCode === 'L' ? this.state.lightKingPosition : this.state.darkKingPosition,
        kingPosition,
        false,
        squareMovedFrom,
        squareMovedTo,
      ).length !== 0
    else return this.getSquaresWithPiecesThatCanAttackThisSquare(squareMovedTo, false).length !== 0;
  }

  getNewPieceKeysCopyWithMoveApplied = (squareMovedFrom, squareMovedTo) => {
    const pieceMoving = this.state.pieceKeys[squareMovedFrom];
    let squareIdOfPawnCapturedViaEnPassant = null;
    let squareIdOfKingAfterCastling = null;
    let squareIdOfRookAfterCastling = null;
    let castlingRook = null;
    // copy the array before mutating so React sees a new reference
    let newPieceKeys = this.state.pieceKeys.slice();

    if (this.isMoveEnPassant(squareMovedFrom, squareMovedTo)) {
      // alert("An en passant occurred...");
      squareIdOfPawnCapturedViaEnPassant = squareMovedTo + DIR.N * (pieceMoving.charAt(0) === 'L' ? -1 : 1);
      newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
      newPieceKeys[squareMovedFrom] = "";
      newPieceKeys[squareMovedTo] = pieceMoving;
    } else if (this.isMoveCastling(squareMovedFrom, squareMovedTo)) {
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

    return newPieceKeys;
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

    // One way to go about it would be to verify the proposed moves returned by the legalMoveMap functions 
    // and remove the ones where the king is attacked after making the move 

    // I was thinking about deleting the pieceKeys state, but actually it'll be so convenient to use it as a computer analysis board 
    // without rendering the moves I'm trying out, then set it back to match what's in squareProps or history when I'm done or in between moves 

    // const playerCode = this.state.pieceKeys[squareId].charAt(0);
    const pieceCode = this.state.pieceKeys[squareId].charAt(1);
    let validMoves = pieceCode in this.legalMoveMap ? this.legalMoveMap[pieceCode](squareId) : [];

    // gotta first see if we are currently in check ... actually, no we don't first 
    // then gotta see if we will be in check after this proposed move 

    validMoves = validMoves.filter((targetMove) => !this.wouldKingBeInCheckAfterMove(squareId, targetMove));

    return validMoves;
  }

  // returns a list of *any* piece that can attack this square by default, not just the opponent's pieces 
  // maybe add squaresToExclude (imagine empty) and/or squaresToInclude (imagine occupied/captured) ...
  // any piece can block identically to any other piece
  // any capture is equivalently effective at removing a check 
  // evading a check must be performed by the king with respect to the other pieces that really exist on the board (no imagination) 
  // but these optional parameters would have to be passed down to the generate...LegalMoves methods as well 
  // which in turn would have to get passed all the way down to the generatePieceLegalMoves method 
  getSquaresWithPiecesThatCanAttackThisSquare = (squareId, includeSelfAttacks = true, squareToImagineEmpty = null, squareToImagineFriendly = null) => {
    let squaresTargetingThisOne = [];

    let includeWhiteAttacks = true;
    let includeBlackAttacks = true;
    if (!includeSelfAttacks && this.state.pieceKeys[squareId] !== '') {
      if (this.state.pieceKeys[squareId].charAt(0) === 'L') includeBlackAttacks = false;
      if (this.state.pieceKeys[squareId].charAt(0) === 'D') includeWhiteAttacks = false;
    }

    // see if a pawn can attack this square separately ... refactor generatePawnLegalMoves to have includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly
    if (includeBlackAttacks) {
      if (squareId - 7 >= 0 && this.state.pieceKeys[squareId - 7] === "DP") squaresTargetingThisOne.push(squareId - 7);
      if (squareId - 9 >= 0 && this.state.pieceKeys[squareId - 9] === "DP") squaresTargetingThisOne.push(squareId - 9);
    }
    if (includeWhiteAttacks) {
      if (squareId + 7 < 64 && this.state.pieceKeys[squareId + 7] === "LP") squaresTargetingThisOne.push(squareId + 7);
      if (squareId + 9 < 64 && this.state.pieceKeys[squareId + 9] === "LP") squaresTargetingThisOne.push(squareId + 9);
    }

    this.generateKnightLegalMoves(squareId, includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly)
      .filter((square) => this.state.pieceKeys[square].charAt(1) === "N")
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateBishopLegalMoves(squareId, includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly)
      .filter((square) => ["B","Q"].includes(this.state.pieceKeys[square].charAt(1)))
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateRookLegalMoves(squareId, includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly)
      .filter((square) => ["R","Q"].includes(this.state.pieceKeys[square].charAt(1)))
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateKingLegalMoves(squareId, includeSelfAttacks, false)
      .filter((square) => this.state.pieceKeys[square].charAt(1) === "K")
      .forEach((square) => squaresTargetingThisOne.push(square));

    return squaresTargetingThisOne;
  }

  handleSquareClick = (squareId) => {
    const squareToSelect = squareId;
    // clicking on a square for the first time (no square selected yet) 
    if (this.state.squareSelected === null || this.state.squareSelected !== squareToSelect) { // disallow multi-piece selection for now 
      if (this.state.squareProps[squareToSelect].isHighlighted) {
        // Move piece to clicked square
        const squareMovedFrom = this.state.squareSelected;
        const squareMovedTo = squareToSelect;
        const newPieceKeys = this.getNewPieceKeysCopyWithMoveApplied(squareMovedFrom, squareMovedTo);
        if (this.state.pieceKeys[squareMovedFrom].charAt(1) === 'K') {
          if (!this.isMoveCastling(squareMovedFrom, squareMovedTo)) {
            if (newPieceKeys[squareMovedTo].charAt(0) === 'L') this.setState({...this.state, lightKingPosition: squareMovedTo});
            else this.setState({...this.state, darkKingPosition: squareMovedTo});
          } else {
            const directionFromKing = squareMovedFrom < squareMovedTo ? 1 : -1;
            const squareIdOfKingAfterCastling = squareMovedFrom + directionFromKing * 2;
            if (newPieceKeys[squareIdOfKingAfterCastling].charAt(0) === 'L') this.setState({...this.state, lightKingPosition: squareIdOfKingAfterCastling});
            else this.setState({...this.state, darkKingPosition: squareIdOfKingAfterCastling});
          }
        }
        this.setState({
          ...this.state,
          squareSelected: null,
          squareAltSelected: null,
          whiteToPlay: !this.state.whiteToPlay,
          pieceKeys: newPieceKeys,
          squareProps: this.state.squareProps.map((squareProps, squareId) => {
            // update key and keycode to reflect the new piece placement
            // let key = squareProps.key;
            // if (squareProps.isHighlighted || squareProps.isSelected || squareProps.isAltSelected) {
            //   // eslint-disable-next-line no-unused-vars
            //   const [oldSquareId, oldPieceId, oldChangeCode] = key.split('-');
            //   key = `${oldSquareId}-${newPieceKeys[squareId]}-${oldChangeCode + 1}`;
            // }
            const newKeycode = newPieceKeys[squareId];
            // TODO can we setState on a separate field *inside* a setState block that modifies other state parameters??? Probably not... 
            // Make sure we update the king locations in state here 
            // Alternatively we could maybe loop over squareProps outside the setState function and call setState 64 times, once for each square 
            // if (newKeycode?.charAt(1) === 'K') {
            //   if (newKeycode.charAt(0) === 'L') this.setState({...this.state, lightKingPosition: squareId});
            //   else this.setState({...this.state, darkKingPosition: squareId});
            // }
            // ORRRR... we can do this alllll outside this function entirely, that's what I'll do actually 
            return {
              ...squareProps,
              keycode: newKeycode,
              isHighlighted: false,
              isAltHighlighted: false,
              isSelected: false,
              isAltSelected: false,
              // key: key,
            }
          }),
          history: this.state.history.concat([{
            pieceKeys: newPieceKeys,
            AN: null, // TODO generate Algebraic Notation for this move -- to do so, we need to know if any other 
                      //   pieces of the same type would be able to make the same move 
            INN: `${String(squareMovedFrom).padStart(2, '0')}${String(squareMovedTo).padStart(2, '0')}`, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
          }]),
        })
      } else {
        // select an unselected square and highlight the legal moves for that piece on this turn 
        const isThisPlayersMove = this.state.whiteToPlay ^ this.state.pieceKeys[squareToSelect]?.charAt(0) === 'D';
        const squaresToHighlight = isThisPlayersMove ? this.getLegalMoves(squareId) : [];
        this.setState({
          ...this.state,
          squareSelected: squareToSelect,
          squareAltSelected: null,
          squareProps: this.state.squareProps.map((oldProps, squareId) => {
            const shouldHighlight = squaresToHighlight.includes(squareId);
            const shouldSelect = (squareId === squareToSelect);
            // let newKey = oldProps.key;
            // if (shouldHighlight || shouldSelect) {
            //   const [oldSquareId, oldPieceId, oldChangeCode] = newKey.split('-');
            //   newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode + 1}`;
            // }
            return {
              ...oldProps,
              isHighlighted: shouldHighlight,
              isSelected: shouldSelect,
              isAltHighlighted: false,
              isAltSelected: false,
              // key: newKey,
            }
          }),
        })
      }
    } else if (this.state.squareSelected === squareToSelect) {
      this.setState({
        ...this.state,
        squareSelected: null,
        squareAltSelected: null,
        squareProps: this.state.squareProps.map((oldProps) => {
          // update key to trigger re-render 
          // let newKey = oldProps.key;
          // if (oldProps.isHighlighted || oldProps.isSelected || oldProps.isAltHighlighted) {
          //   const [oldSquareId, oldPieceId, oldChangeCode] = newKey.split('-');
          //   newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode + 1}`;
          // }
          return {
            ...oldProps,
            isHighlighted: false,
            isSelected: false,
            isAltHighlighted: false,
            isAltSelected: false,
            // key: newKey,
          }
        }),
      });
    } else {

    }
  }

  handleSquareRightClick = (event, squareId) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    // squareId provided from Square component
    // console.log('Right-click on square:', squareId, event);
    // If you need to call any DOM/test helpers, do so here. e.g. event.target.testEvent();
   
    
    // select an unselected square and highlight the legal moves for that piece on this turn 
    if (squareId !== this.state.squareAltSelected) {
      const squaresToAltHighlight = this.getSquaresWithPiecesThatCanAttackThisSquare(squareId);
      this.setState({
        ...this.state,
        squareSelected: null,
        squareAltSelected: squareId,
        squareProps: this.state.squareProps.map((oldProps, squarePropId) => {
          const shouldAltHighlight = squaresToAltHighlight.includes(squarePropId);
          // let newKey = oldProps.key;
          // if (shouldAltHighlight) {
          //   const [oldSquareId, oldPieceId, oldChangeCode] = newKey.split('-');
          //   newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode + 1}`;
          // }
          return {
            ...oldProps,
            isAltSelected: (squarePropId === squareId),
            isAltHighlighted: shouldAltHighlight,
            isSelected: false,
            isHighlighted: false,
            // key: newKey,
          }
        }),
      })
    } else {
      this.setState({
        ...this.state,
        squareAltSelected: null,
        squareProps: this.state.squareProps.map((oldProps, squarePropId) => {
          // let newKey = oldProps.key;
          // if (shouldAltHighlight) {
          //   const [oldSquareId, oldPieceId, oldChangeCode] = newKey.split('-');
          //   newKey = `${oldSquareId}-${oldPieceId}-${oldChangeCode + 1}`;
          // }
          return {
            ...oldProps,
            isAltSelected: false,
            isAltHighlighted: false,
            // key: newKey,
          }
        }),
      })
    }
  }

  render() {
    return (
      <div className="game">
        <Board 
          // squares={current.squares}
          // pieceKeys={this.state.pieceKeys} // WAS passing this down, but it's not necessary. Info is contained in squareProps
          squareProps={this.state.squareProps}
          handleSquareClick={this.handleSquareClick}
          handleSquareRightClick={this.handleSquareRightClick}
          boardSize={this.boardSize}
        />
        <GameStatus 
          whiteToPlay={this.state.whiteToPlay}
          history={this.state.history}
        />
        <GameNotes />

        {
          // this.state.showNotes && (
          //   <GameNotes />
          // )
        }

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
