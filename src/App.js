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

      // TODO not yet maintained (except for light/dark king positions) 
      lightPawnPositions: [48, 49, 50, 51, 52, 53, 54, 55],
      darkPawnPositions: [8, 9, 10, 11, 12, 13, 14, 15],
      lightKnightPositions: [57, 62],
      darkKnightPositions: [1, 6],
      lightBishopPositions: [58, 61],
      darkBishopPositions: [2, 5],
      lightRooksPositions: [56, 63],
      darkRooksPositions: [0, 7],
      lightQueenPositions: [59],
      darkQueenPositions: [3],
      lightKingPosition: 60,
      darkKingPosition: 4,

      lightKingHasShortCastlingRights: true,
      lightKingHasLongCastlingRights: true,
      darkKingHasShortCastlingRights: true,
      darkKingHasLongCastlingRights: true,

      // TODO not yet used or maintained 
      // warning: numeric literals with absolute values equal to 2^53 or greater are too large to be represented accurately as integers.
      // append an `n` to use the BigInt javascript type 
      bitmapLightPawns: 0x000000000000ff00n, // 6th (7th) rank full of 1s
      bitmapDarkPawns: 0x00ff000000000000n, // 1st (2nd) rank full of 1s
      bitmapLightKnights: 0x0000000000000042n,
      bitmapDarkKnights: 0x2400000000000000n,
      bitmapLightBishops: 0x0000000000000024n,
      bitmapDarkBishops: 0x4200000000000000n,
      bitmapLightRooks: 0x0000000000000081n,
      bitmapDarkRooks: 0x1800000000000000n,
      bitmapLightQueens: 0x0000000000000010n,
      bitmapDarkQueens: 0x1000000000000000n,
      bitmapLightKing: 0x0000000000000008n,
      bitmapDarkKing: 0x0800000000000000n,


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
      FENstring: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // starting position in Forsyth-Edwards Notation 
      history: [], // don't store the initial state 
      // history: [{
      //   pieceKeys: startingConfig, // full state of keycodes on board at this move
      //   AN: null, // Algebraic Notation
      //   JN: null, // Jared's Notation
      //   INN: null, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
      //          // TODO just realized i'm doing INN wrong... using the square id of the board, not mapping first number to the file and second to rank
      // }],
      stepNumber: 0,
    }
  }

  generateBoardFEN = (boardState = this.state.pieceKeys) => {
    // lowercase is black, upper is white, standard piece keys for pieces, numbers for consecutive empty squares,
    // followed by next player's move, then castling rights still available, the en passant target square (if applicable),
    // and finally, the "half-move clock" and the full-move counter 
    // see: https://www.chessprogramming.org/Forsyth-Edwards_Notation for more info 

    // 
  }

  generateBoardStateFromFen = (inputFEN) => {
    const [piecePlacement, sideToMove, castlingAbility, enPassantTargetSquare, halfmoveClock, fullmoveCounter] = inputFEN.split(' ');
    const rankPiecePlacements = piecePlacement.split('/');
  }

  // piece should *already* be on squareMovedTo, the algebraic notation will be generated always after the move is played 
  // actually... maybe the history is updated at the same time as the board, and state might not be updated yet 
  generateMoveAN = (squareMovedFrom, squareMovedTo) => { // , futureBoardState = this.state.pieceKeys) => {
    const futureBoardState = this.getNewPieceKeysCopyWithMoveApplied(squareMovedFrom, squareMovedTo);
    const currentBoardState = this.state.pieceKeys.slice();
    let [playerCode, pieceCode] = [null, null]; // futureBoardState[squareMovedTo].split('');
    if (playerCode === null && pieceCode === null) { // null !== undefined ... SMH 
      [playerCode, pieceCode] = futureBoardState[squareMovedTo].split('');
    }
    const isCapture = (currentBoardState[squareMovedTo] !== '' ? 'x' : '');
    const isCheck = this.isKingInCheck() ? '+' : ''; // TODO or checkmate 
    const isPawnPromotion = '=[Q,R,B,N]'; // TODO implement 
    const destinationFile = 'abcdefgh'.charAt(squareMovedTo % 8);
    const destinationRank = 8 - Math.floor(squareMovedTo / 8); // remember that our 0-63 is kind of backwards, and 0-indexed 
    const movesThatNecessitateFurtherClarification = this.getSquaresWithPiecesThatCanAttackThisSquare(squareMovedTo, true, null, null, futureBoardState) // get all pieces incl. self-attacks 
      .filter((squareId) => futureBoardState[squareId].charAt(0) === playerCode) // filter out non-self-attacks (opponent attacks)
      .filter((squareId) => futureBoardState[squareId].charAt(1) === pieceCode) // get only self-attacks from the same type of piece 
      .filter((squareId) => squareId !== squareMovedFrom); // state issue TODO fix ... including this piece 
    // const isCapture = isMoveCapture
    if (movesThatNecessitateFurtherClarification.length === 0) {
      if (pieceCode === 'P') {
        if (isCapture && isCapture !== '') {
          const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
          return `${sourceFile}x${destinationFile}${destinationRank}${isCheck}`;
        }
        return `${destinationFile}${destinationRank}${isCheck}`;
      }
      return `${pieceCode}${isCapture}${destinationFile}${destinationRank}${isCheck}`;
    } else {
      // if (movesThatNecessitateFurtherClarification.length > 1) {
      //   // this can actually be kind of complicated, for example if one or some of the pieces are pinned, 
      //   // or promoting several pawns to knights and all (up to 4) attack the same square but have different rank *and* file
      //   // for rooks, bishops, (even queens? no...) just default with sourceFile,
      //   // use sourceRank if necessary due to duplicate identical sourceFile options, or use both of both have dupes 
      //   const sourceFile
      //   return 
      // }
      const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
      const sourceRank = 8 - Math.floor(squareMovedFrom / 8);
      let dupeSourceFiles = false;
      let dupeSourceRanks = false;
      for (const altMove in movesThatNecessitateFurtherClarification) {
        // check if piece move is actually legal here??? could expose a check 
        const altSourceFile = 'abcdefgh'.charAt(altMove % 8);
        const altSourceRank = 8 - Math.floor(altMove / 8);
        dupeSourceFiles = dupeSourceFiles || sourceFile === altSourceFile;
        dupeSourceRanks = dupeSourceRanks || sourceRank === altSourceRank;
      }
      const pieceClarification = dupeSourceFiles ? (dupeSourceRanks ? `${sourceFile}${sourceRank}` : `${sourceRank}`) : `${sourceFile}`;
      return `${pieceCode}${pieceClarification}${isCapture}${destinationFile}${destinationRank}${isCheck}`;
    }
  }

  generateMoveJN = (squareMovedFrom, squareMovedTo) => {
    return `${String(squareMovedFrom).padStart(2, '0')}${String(squareMovedTo).padStart(2, '0')}`;
  }

  generateMoveINN = (squareMovedFrom, squareMovedTo) => {
    // squareMovedFrom, squareMovedTo passed in as squareId values from 0-63
    const fromRank = Math.floor(squareMovedFrom / 8);
    const fromFile = squareMovedFrom % 8;
    const toRank = Math.floor(squareMovedTo / 8);
    const toFile = squareMovedTo % 8;
    return `${fromRank}${fromFile}${toRank}${toFile}`;
  }

  // TODO can we name this input argument dictionary and just spread it??
  generatePieceValidCaptureMoves = (squareId, directions, distance = 8, {nextSquareValidators = [], captureValidators = []} = {}, boardState = this.state.pieceKeys) => {
    return this.generatePieceValidMoves(
      squareId, 
      directions, 
      // distance,
      {
        distance: distance, 
        nextSquareValidators: nextSquareValidators, 
        captureValidators: captureValidators, 
        // ...validatorArgs,
        includeNonCaptures: false,
      },
      boardState,
    );
  }

  generatePieceValidNonCaptureMoves = (squareId, directions, {distance = 8, nextSquareValidators = [], captureValidators = []} = {}, boardState = this.state.pieceKeys) => {
    return this.generatePieceValidMoves(
      squareId, 
      directions, 
      {
        distance: distance, 
        nextSquareValidators: nextSquareValidators, 
        captureValidators: captureValidators, 
        includeCaptures: false
      },
      boardState,
    );
  }

  generatePieceValidSelfCaptureMoves = (squareId, directions, {distance = 8, nextSquareValidators = [], captureValidators = []} = {}, boardState = this.state.pieceKeys) => {
    return this.generatePieceValidMoves(
      squareId, 
      directions, 
      {
        distance: distance, 
        nextSquareValidators: nextSquareValidators, 
        captureValidators: captureValidators, 
        includeCaptures: false, 
        includeNonCaptures: false, 
        includeSelfCaptures: true
      },
      boardState,
    );
  }

  // in order to allow generatePawnValidMoves to call this method, we also have to include a captureValidator input function
  // all other pieces' captureValidator inputs will be the same, what exists: the piece at the target is not the same color as the piece at the source 
  // the existing nextSquareValidators input is more like a validPieceMovenextSquareValidators input 
  // it would be nice if I could access the Piece objects and use their internal properties to store/call these methods, but whatever 
  generatePieceValidMoves = (
    squareId, 
    directions, 
    {
      distance = 8, 
      nextSquareValidators = [], 
      captureValidators = [],
      selfCaptureValidators = [], // ... never necessary (so far) 
      includeNonCaptures = true,
      includeCaptures = true, 
      includeSelfCaptures = false,
      squareToImagineEmpty = null, // used to test out possible moves this side may make 
      squareToImagineFriendly = null, // used to test out possible moves this side may make 
    } = {},
    boardState = this.state.pieceKeys,
  ) => {
    const legalMoves = [];
    if ((squareToImagineEmpty || squareToImagineFriendly) && squareToImagineEmpty === squareToImagineFriendly) {
      console.error("Square to imagine empty can't be the same square to imagine friendly");
      return legalMoves;
    }
    // if (!directions) return legalMoves; // not necessary 
    // if (this.state.pieceKeys[squareId] === 'LN' || (this.state.pieceKeys[squareId] === 'LK' && this.state.pieceKeys[squareToImagineEmpty] === 'LN')) {
    //   // console.log(`Fn params for ${this.state.pieceKeys[squareId]}:\n\tsquareId: ${squareId}\n\tdirections: ${directions}\n\t{\n\t\tdistance: ${distance}\n\t\tnextSquareValidators: ${nextSquareValidators}\n\t\tincludeNonCaptures: ${includeNonCaptures}\n\t\tincludeCaptures: ${includeCaptures}\n\t\tincludeSelfCaptures: ${includeSelfCaptures}\n\t\tsquareToImagineEmpty: ${squareToImagineEmpty}\n\t\tsquareToImagineFriendly: ${squareToImagineFriendly}\n\t}`);
    // }
    nextSquareValidators.push((oldSquare, newSquare) => oldSquare >= 0 && newSquare >= 0);
    nextSquareValidators.push((oldSquare, newSquare) => oldSquare < 64 && newSquare < 64);
    captureValidators.push((squareFrom, squareTo) => boardState[squareFrom]?.charAt(0) !== boardState[squareTo]?.charAt(0));
    selfCaptureValidators.push((squareFrom, squareTo) => boardState[squareFrom]?.charAt(0) === boardState[squareTo]?.charAt(0));
    selfCaptureValidators.push((squareFrom, squareTo) => squareTo === squareToImagineFriendly);
    directions.forEach((direction) => {
      let checkedSquare = squareId;
      let nextSquareToCheck = checkedSquare + direction;
      let rangeRemaining = distance;
      // eslint-disable-next-line no-loop-func
      while (rangeRemaining > 0 && nextSquareValidators.every(validator => validator(checkedSquare, nextSquareToCheck))) {
        if (
          nextSquareToCheck !== squareToImagineFriendly && 
          (
            boardState[nextSquareToCheck] === "" || 
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
              nextSquareToCheck !== squareToImagineFriendly && 
              // this.state.pieceKeys[nextSquareToCheck].charAt(0) !== this.state.pieceKeys[squareId].charAt(0) && 
              // eslint-disable-next-line no-loop-func
              captureValidators.some(validator => validator(squareId, nextSquareToCheck)) // at least one validator true means valid capture 
            ) || 
            (
              includeSelfCaptures && 
              // (
              //   this.state.pieceKeys[nextSquareToCheck].charAt(0) === this.state.pieceKeys[squareId].charAt(0) || 
              //   nextSquareToCheck === squareToImagineFriendly
              // )
              // eslint-disable-next-line no-loop-func
              selfCaptureValidators.some(validator => validator(squareId, nextSquareToCheck))
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

  generatePawnValidMoves = (squareId, includeNonCaptures = true, includeSelfCaptures = false, boardState = this.state.pieceKeys) => {

    // // Legal pawn moves 

    // let pawnMoves = [-8, -7, -9];
    // // let pawnMoves = piece.state.moves;
    // if (playerCode === 'L' && Math.floor(squareId / 8) === 6 || playerCode === 'D' && Math.floor(squareId / 8) === 1) pawnMoves.push(-16); // two-square opening move
    // if (playerCode === 'D') pawnMoves = pawnMoves.map(move => -move);
    // let pawnnextSquareValidators = [
    //   (target) => target >= 0 && target < 64, // on board
    //   (target) => ![8, 16].includes(Math.abs(squareId - target)) || this.state.pieceKeys[target] === "", // not occupied
    //   (target) => ![7, 9].includes(Math.abs(squareId - target)) 
    //     || (this.state.pieceKeys[target] !== "" && this.state.pieceKeys[target]?.charAt(0) !== this.state.pieceKeys[squareId].charAt(0))
    //     // || (this.state.history[-1].JN === `${squareId-17}${squareId-1}` || this.state.history[-1].JN === `${squareId-15}${squareId+1}`),
    // ];
    // // let legalMoves = [];
    // // pawnMoves.forEach(move => {
    // //   const targetSquare = squareId + move;
    // //   const legalMove = pawnnextSquareValidators.every(validator => validator(targetSquare));
    // //   if (legalMove) {
    // //     legalMoves.push(targetSquare);
    // //   }
    // // })
    // // return legalMoves;
    // return pawnMoves
    //   .map((move) => move + squareId)
    //   .filter((target) => pawnnextSquareValidators.every(validator => validator(target)));

    // // ****** LEGAL PAWN MOVES (alt approach) ********

    // // // this validation is handle in the getLegalMoves method, don't do it here in case we want to use this method other places 
    // // if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") return [];
    // // const [playerCode, pieceCode] = this.state.pieceKeys[squareId].split('');
    // // if (this.state.whiteToPlay && playerCode !== 'L') return []; // not this player's turn
    // // if (pieceCode !== 'P') return []; // not a pawn 


    // const playerCode = this.state.pieceKeys[squareId].charAt(0);
    // const pawnMultiplier = playerCode === 'L' ? 1 : -1;
    // const pawnStartingRank = playerCode === 'L' ? 6 : 1;
    // const currRank = Math.floor(squareId / 8);
    // const currFile = squareId % 8;
    // let pawnMoves = [];

    // if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier] === "") {
    //   pawnMoves.push(squareId + DIR.N * pawnMultiplier); // one square forward
    //   if (currRank === pawnStartingRank && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier * 2] === "") 
    //     pawnMoves.push(squareId + DIR.N * pawnMultiplier * 2); // two squares forward from starting position
    // }
    // if (currFile !== 0) { // pawn is not on a file
    //   if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.W] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.W].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // capture to the north/south west
    //   if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].JN === `${String(squareId + DIR.N * pawnMultiplier * 2 + DIR.W).padStart(2, '0')}${String(squareId + DIR.W).padStart(2, '0')}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // en passant capture to the north/south west
    // }
    // if (currFile !== 7) { // pawn is not on h file 
    //   if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // capture to the north/south east
    //   if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].JN === `${String(squareId + DIR.N * pawnMultiplier * 2 + DIR.E).padStart(2, '0')}${String(squareId + DIR.E).padStart(2, '0')}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // en passant capture to the north/south east
    // }


    // // TODO check if any of these moves would result in another piece being able to capture the king ... need to do this for every piece move 
    // // so maybe just handle this in the getLegalMoves method, removing suggested moves that would leave the king attacked 

    // // LEGAL PAWN MOVES (3RD APPROACH) ... nvm that's stupid, not worth it ... or is it? 

    const playerCode = boardState[squareId].charAt(0);
    const currRank = Math.floor(squareId / 8);
    // const currFile = squareId % 8;

    let pawnMoves = [];

    // if (playerCode === 'L') {
    //   if (currRank === 6) pawnMoves = pawnMoves.concat(this.generatePieceValidNonCaptureMoves(squareId, [-8], {distance: 2}));
    //   else pawnMoves = pawnMoves.concat(this.generatePieceValidNonCaptureMoves(squareId, [-8], {distance: 1}));
    //   pawnMoves = pawnMoves.concat(this.generatePieceValidCaptureMoves(squareId, [-7, -9], {distance: 1}));
    //   // and en passant 
    // } else if (playerCode === 'D') {

    // }
    if (includeNonCaptures) {
      pawnMoves = pawnMoves.concat(
        this.generatePieceValidNonCaptureMoves(
          squareId,
          playerCode === 'L' ? [-8] : [8],
          {
            distance: (currRank === (playerCode === 'L' ? 6 : 1)) ? 2 : 1,
          },
          boardState
        )
      );
    }

    pawnMoves = pawnMoves.concat(
      this.generatePieceValidCaptureMoves(
        squareId,
        playerCode === 'L' ? [-7,-9] : [7,9],
        1,
        {
          // distance: 1,
          captureValidators: [
            (squareFrom, squareTo) => {
              if (!this.state.history || this.state.history.length === 0) return false;
              // previous move had to be a pawn moving from a square "in front of" squareTo to a square "behind" squareTo from this player's perspective ... 
              // we already validated that it is actually a capture by supplying the directions and calling the valid capture function which validates 
              const squareInFrontOfTarget = playerCode === 'L' ? squareTo - 8 : squareTo + 8;
              const squareBehindTarget = playerCode === 'L' ? squareTo + 8 : squareTo - 8;
              const targetPreviousJN = this.generateMoveJN(squareInFrontOfTarget, squareBehindTarget);
              return this.state.history[this.state.history.length - 1].JN === targetPreviousJN;
            }
          ],
        },
        boardState,
      )
    )

    if (includeSelfCaptures) {
      pawnMoves = pawnMoves.concat(
        this.generatePieceValidSelfCaptureMoves(
          squareId,
          playerCode === 'L' ? [-7,-9] : [7,9],
          {
            distance: 1,
          },
          boardState,
        )
      )
    }

    return pawnMoves;
  }

  generateKnightValidMoves = (squareId, includeNonCaptures = true, includeSelfCaptures = false, squareToImagineEmpty = null, squareToImagineFriendly = null, boardState = this.state.pieceKeys) => {
    const nextSquareValidators = [
      (square, nextSquare) => Math.abs((square % 8) - (nextSquare % 8)) <= 2,
      (square, nextSquare) => Math.abs(Math.floor(square / 8) - Math.floor(nextSquare / 8)) <= 2,
    ];
    const directions = [-17, -15, -10, -6, 6, 10, 15, 17];
    return this.generatePieceValidMoves(
      squareId, 
      directions, 
      {
        distance: 1, 
        nextSquareValidators: nextSquareValidators, 
        includeNonCaptures: includeNonCaptures,
        includeSelfCaptures: includeSelfCaptures,
        squareToImagineEmpty: squareToImagineEmpty,
        squareToImagineFriendly: squareToImagineFriendly,
      },
      boardState,
    );
  }

  generateBishopValidMoves = (squareId, includeNonCaptures = true, includeSelfCaptures = false, squareToImagineEmpty = null, squareToImagineFriendly = null, boardState = this.state.pieceKeys) => {
    const nextSquareValidators = [
      (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) === 1,
      (square, nextSquare) => Math.abs(square % 8 - nextSquare % 8) === 1,
    ];
    const directions = [-9, -7, 7, 9];
    return this.generatePieceValidMoves(
      squareId, 
      directions, 
      {
        nextSquareValidators: nextSquareValidators, 
        includeNonCaptures: includeNonCaptures,
        includeSelfCaptures: includeSelfCaptures,
        squareToImagineEmpty: squareToImagineEmpty,
        squareToImagineFriendly: squareToImagineFriendly,
      },
      boardState
    );
  }

  generateRookValidMoves = (squareId, includeNonCaptures = true, includeSelfCaptures = false, squareToImagineEmpty = null, squareToImagineFriendly = null, boardState = this.state.pieceKeys) => {
    const nextSquareValidators = [
      (square, nextSquare) => Math.abs(Math.floor(nextSquare / 8) - Math.floor(square / 8)) ^ Math.abs(square % 8 - nextSquare % 8) === 0b1,
      (square, nextSquare) => Math.floor(nextSquare / 8) === Math.floor(square / 8) ^ square % 8 === nextSquare % 8,
    ];
    const directions = [-8, -1, 1, 8];
    return this.generatePieceValidMoves(
      squareId, 
      directions, 
      {
        nextSquareValidators: nextSquareValidators, 
        includeNonCaptures: includeNonCaptures,
        includeSelfCaptures: includeSelfCaptures,
        squareToImagineEmpty: squareToImagineEmpty,
        squareToImagineFriendly: squareToImagineFriendly,
      },
      boardState
    );
  }

  // add squareToImagineEmpty = null, squareToImagineFriendly = null here??? idts 
  generateQueenValidMoves = (squareId, includeNonCaptures = true, includeSelfCaptures = false, boardState = this.state.pieceKeys) => {
    // there's a bug here somehow, queen was on d5 and a highlighted move was b4, or even a4 ... maybe it's fixed now 
    return this.generateBishopValidMoves(squareId, includeNonCaptures, includeSelfCaptures, null, null, boardState)
      .concat(this.generateRookValidMoves(squareId, includeNonCaptures, includeSelfCaptures, null, null, boardState));
  }

  generateKingValidMoves = (squareId, includeNonCaptures = true, includeSelfCaptures = false, includeCastling = true, boardState = this.state.pieceKeys) => {
    // TODO king nextSquareValidators are more complicated, have to analyze other pieces next move for possible checks...
    //   or apply, from the king's square, all possible types of piece moves and see if a piece that can make that move is on any of those squares 
    const nextSquareValidators = [
    ];
    const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
    const legalMoves = this.generatePieceValidMoves(
      squareId, 
      directions, 
      {
        distance: 1, 
        nextSquareValidators: nextSquareValidators, 
        includeNonCaptures: includeNonCaptures,
        includeSelfCaptures: includeSelfCaptures,
      },
      boardState,
    );

    // avoid the infinite loop from getSquaresWithPiecesThatCanAttackThisSquare calling generateKingValidMoves and trying to check for castling as an attack 
    if (!includeCastling) return legalMoves;

    // check for castling ... start by verifying that the king never moved, could store this info in state for a minor speedup 
    const kingStartingSquare = this.state.whiteToPlay ? 60 : 4; // TODO remove this assumption ?? 
    if (squareId !== kingStartingSquare) return legalMoves;
    // if (this.state.history.some(pastMove => pastMove.JN.startsWith(String(kingStartingSquare).padStart(2, '0')))) return legalMoves;
    if (this.state.whiteToPlay && !this.state.lightKingHasShortCastlingRights && !this.state.lightKingHasLongCastlingRights) return legalMoves;
    if (!this.state.whiteToPlay && !this.state.darkKingHasShortCastlingRights && !this.state.darkKingHasLongCastlingRights) return legalMoves; 

    // check short and long castling 
    // need to verify for each side that the rook also never moved, that we have no pieces in between the king and rook, and
    // that none of the opponent's pieces can target either square that the rook or king will land on 
    //   (in short castling, this means none of the squares that are between the king and rook; in long castling, the square
    //    next to the rook *can* be targeted) 
    const playerCode = boardState[squareId].charAt(0);
    const shortCastleRookStartingSquare = this.state.whiteToPlay ? 63 : 7;
    const shortCastleKingSafetySquares = this.state.whiteToPlay ? [60, 61, 62] : [4, 5, 6];
    if (
      boardState.slice(kingStartingSquare + 1, shortCastleRookStartingSquare).every(pieceKey => pieceKey === '') && 
      // this.state.history.every(pastMove => !pastMove.JN.startsWith(String(shortCastleRookStartingSquare).padStart(2, '0')))
      this.state.whiteToPlay ? 
        this.state.lightKingHasShortCastlingRights :
        this.state.darkKingHasShortCastlingRights
    ) {
      if (shortCastleKingSafetySquares
          .every(square => this.getSquaresWithPiecesThatCanAttackThisSquare(square) 
            .filter((square) => boardState[square].charAt(0) !== playerCode).length === 0
          )
      ) {
        legalMoves.push(shortCastleRookStartingSquare);
      }
    }
    const longCastleRookStartingSquare = this.state.whiteToPlay ? 56 : 0;
    const longCastleKingSafetySquares = this.state.whiteToPlay ? [60, 59, 58] : [4, 3, 2];
    if (boardState.slice(longCastleRookStartingSquare + 1, kingStartingSquare).every(pieceKey => pieceKey === '') &&
      // this.state.history.every(pastMove => !pastMove.JN.startsWith(String(longCastleRookStartingSquare).padStart(2, '0')))
      this.state.whiteToPlay ?
        this.state.lightKingHasLongCastlingRights :
        this.state.darkKingHasLongCastlingRights
    ) {
      if (longCastleKingSafetySquares
          .every(square => this.getSquaresWithPiecesThatCanAttackThisSquare(square) 
            .filter((square) => boardState[square].charAt(0) !== playerCode)
            .length === 0
          )
      ) {
        legalMoves.push(longCastleRookStartingSquare);
      }
    }

    return legalMoves;
  }

  validMoveMap = {
    'P': this.generatePawnValidMoves,
    'N': this.generateKnightValidMoves,
    'B': this.generateBishopValidMoves,
    'R': this.generateRookValidMoves,
    'Q': this.generateQueenValidMoves,
    'K': this.generateKingValidMoves,
  }

  isKingInCheck = () => {
    // maybe here we can easily set like a canBlock, canCapture, canEvade boolean state system ...
    // canBlock seems like the only tricky one, gotta check all piece moves 
    let attackingSquares = this.getSquaresWithPiecesThatCanAttackThisSquare(
      this.state.whiteToPlay ? 
        this.state.darkKingPosition : 
        this.state.lightKingPosition, 
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

  wouldOwnKingBeInCheckAfterMove = (squareMovedFrom, squareMovedTo) => {

    let ownKingPosition = this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition;
    if (ownKingPosition === squareMovedFrom) ownKingPosition = squareMovedTo;
    const tempBoardState = this.getNewPieceKeysCopyWithMoveApplied(squareMovedFrom, squareMovedTo);
    const squaresWithPiecesThatCouldAttackOurKingAfterThisMove = this.getSquaresWithPiecesThatCanAttackThisSquare(
      ownKingPosition, 
      false, 
      null, // squareMovedFrom, // do this if we don't update state 
      null,
      tempBoardState,
    );

    return squaresWithPiecesThatCouldAttackOurKingAfterThisMove.length !== 0;

    // // ****** ALT METHOD ******

    // // const playerCode = this.state.pieceKeys[squareMovedFrom].charAt(0);
    // // const playerCode = this.state.whiteToPlay ? "L" : "D";
    // const pieceCode = this.state.pieceKeys[squareMovedFrom].charAt(1);
    // const kingPosition = this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition;
    // if (pieceCode === 'K') {
    //   // TODO dangerous, find a better way to do this 
    //   // warning: do not mutate state directly. use setState()
    //   // i still consider it dangerous from a coding practice pov even if we do it the "proper" way ... but let's use setState() i guess 
    //   // in current state [c5df4ed], using setState instead of modifying state directly does fix the castling issue where the rook disappears
    //   // but it causes the issue with generating the king's escape squares after check to return... the move that should be legal is not
    //   // because the king's own pieces, and the king itself, can attack that square 

    //   // // this.state.pieceKeys[squareMovedTo] = this.state.pieceKeys[squareMovedFrom];
    //   // // this.state.pieceKeys[squareMovedFrom] = '';
    //   const tempPieceKeys = this.getNewPieceKeysCopyWithMoveApplied(squareMovedFrom, squareMovedTo);
    //   // this.setState({
    //   //   ...this.state,
    //   //   pieceKeys: tempPieceKeys,
    //   // });

    //   const squaresWithPiecesThatCouldAttackOurKingAfterThisMove = this.getSquaresWithPiecesThatCanAttackThisSquare(
    //     squareMovedTo, 
    //     false, 
    //     null, // squareMovedFrom, // do this if we don't update state 
    //     null,
    //     tempPieceKeys,
    //   );

    //   // // warning: do not mutate state directly. use setState()
    //   // // this.state.pieceKeys[squareMovedFrom] = this.state.pieceKeys[squareMovedTo];
    //   // // this.state.pieceKeys[squareMovedTo] = '';
    //   // const pieceKeysAfterRevertingTempMove = this.getNewPieceKeysCopyWithMoveApplied(squareMovedTo, squareMovedFrom);
    //   // this.setState({
    //   //   ...this.state,
    //   //   pieceKeys: pieceKeysAfterRevertingTempMove,
    //   // });

    //   // console.log(`\tSquares w pieces that can attack the king on square ${squareMovedTo}: ${squaresWithPiecesThatCouldAttackOurKingAfterThisMove}`);
      
    //   return squaresWithPiecesThatCouldAttackOurKingAfterThisMove.length !== 0;
    // }

    // const squaresWithPiecesThatCouldAttackOurKingAfterThisMove = this.getSquaresWithPiecesThatCanAttackThisSquare(
    //   // playerCode === 'L' ? this.state.lightKingPosition : this.state.darkKingPosition,
    //   kingPosition,
    //   false,
    //   squareMovedFrom, // imagine empty
    //   squareMovedTo, // imagine friendly 
    // );
    // // if (pieceCode === 'N') {
    // //   // console.log(`If we moved this knight from ${squareMovedFrom} to ${squareMovedTo}, our king would be capturable from these squares: ${squaresWithPiecesThatCouldAttackOurKingAfterThisMove}`);
    // // }
    // return squaresWithPiecesThatCouldAttackOurKingAfterThisMove.length !== 0;
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

    return newPieceKeys; // , {squareIdOfPawnCapturedViaEnPassant, squareIdOfKingAfterCastling, squareIdOfRookAfterCastling};
  }

  getLegalMoves = (squareId) => {
    if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") {
      // console.log("The selected square has no piece on it, therefore there are no legal moves to make.");
      return [];
    }
    if (this.state.whiteToPlay && this.state.pieceKeys[squareId]?.charAt(0) !== 'L') {
      // console.log("It is not this player's turn, therefore there are no legal moves to make.")
      return []; // not this player's turn 
    }

    // TODO first, if we're in check, we have three options:
    //   1. capture the checking piece if possible
    //   2. block the checking piece if possible
    //   3. move the king if possible
    // If none of these are possible, it's checkmate
    // If we are in a *double* check, we *must* move the king. 

    // One way to go about it would be to verify the proposed moves returned by the validMoveMap functions 
    // and remove the ones where the king is attacked after making the move 

    // I was thinking about deleting the pieceKeys state, but actually it'll be so convenient to use it as a computer analysis board 
    // without rendering the moves I'm trying out, then set it back to match what's in squareProps or history when I'm done or in between moves 

    // const playerCode = this.state.pieceKeys[squareId].charAt(0);
    const pieceCode = this.state.pieceKeys[squareId].charAt(1);
    // console.log(`Generating valid moves that this ${pieceCode} can make...`);
    const validMoves = pieceCode in this.validMoveMap ? this.validMoveMap[pieceCode](squareId) : []; // use the default arguments, only supply squareId 
    // if (pieceCode === 'K') console.log(`Valid moves for this ${pieceCode} are: ${validMoves}`);
    const legalMoves = validMoves.filter((targetMove) => !this.wouldOwnKingBeInCheckAfterMove(squareId, targetMove));
    // if (pieceCode === 'K') console.log(`Legal moves after filtering out which valid moves would result in this player's king being capturable on the next move: ${legalMoves}`);
    return legalMoves;
  }

  getOccupiedSquaresThatCanAttackThisEmptySquare = () => {
    // TODO implement? 
  }

  getOccupiedSquaresThatCanAttackThisOccupiedSquare = () => {
    // TODO implement? 
  }

  // returns a list of *any* piece that can attack this square by default, not just the opponent's pieces 
  // maybe add squaresToExclude (imagine empty) and/or squaresToInclude (imagine occupied/captured) ...
  // any piece can block identically to any other piece
  // any capture is equivalently effective at removing a check 
  // evading a check must be performed by the king with respect to the other pieces that really exist on the board (no imagination) 
  // but these optional parameters would have to be passed down to the generate...LegalMoves methods as well 
  // which in turn would have to get passed all the way down to the generatePieceValidMoves method 

  // TODO we might also need to include an includeNonCaptures flag here as well... 
  getSquaresWithPiecesThatCanAttackThisSquare = (squareId, includeSelfAttacks = true, squareToImagineEmpty = null, squareToImagineFriendly = null, boardState = this.state.pieceKeys) => {
    // if ((squareId === 51 || squareId === 52) && (squareToImagineEmpty === 60 || squareToImagineEmpty === null)) {
    //   console.log(`\t\tgetSquaresWithPiecesThatCanAttackThisSquare(squareId: ${squareId}, includeSelfAttacks: ${includeSelfAttacks}, squareToImagineEmpty: ${squareToImagineEmpty}, squareToImagineFriendly: ${squareToImagineFriendly})`)
    //   console.log(`\t\t\tpieceKeys[squareId]=${boardState[squareId]}; pieceKeys[squareToImagineEmpty]=${boardState[squareToImagineEmpty]}`);
    // }
    let squaresTargetingThisOne = [];

    // // Pawn logic replaced with function call to generatePawnValidMoves below 
    // let includeWhiteAttacks = true;
    // let includeBlackAttacks = true;
    // if (!includeSelfAttacks && this.state.pieceKeys[squareId] !== '') {
    //   if (this.state.pieceKeys[squareId].charAt(0) === 'L') includeBlackAttacks = false;
    //   if (this.state.pieceKeys[squareId].charAt(0) === 'D') includeWhiteAttacks = false;
    // }

    // // see if a pawn can attack this square separately ... refactor generatePawnValidMoves to have includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly
    // // i don't think squares to imagine empty/friendly apply to pawns either, a pawn attack can never be blocked 
    // // so just add includeNonAttacks (and includeSelfAttacks, i guess? just for consistency and altHighlighting on ctrl-click) 
    // if (includeBlackAttacks) {
    //   if (squareId - 7 >= 0 && this.state.pieceKeys[squareId - 7] === "DP") squaresTargetingThisOne.push(squareId - 7);
    //   if (squareId - 9 >= 0 && this.state.pieceKeys[squareId - 9] === "DP") squaresTargetingThisOne.push(squareId - 9);
    // }
    // if (includeWhiteAttacks) {
    //   if (squareId + 7 < 64 && this.state.pieceKeys[squareId + 7] === "LP") squaresTargetingThisOne.push(squareId + 7);
    //   if (squareId + 9 < 64 && this.state.pieceKeys[squareId + 9] === "LP") squaresTargetingThisOne.push(squareId + 9);
    // }

    // TODO really need to verify whether we should be including non-captures, probably add a function argument 
    // for now let's just set it completely based on whether we are checking an empty or occupied square and see if it breaks 

    const includeNonCaptures = (boardState[squareId] === '');

    this.generatePawnValidMoves(squareId, includeNonCaptures, includeSelfAttacks, boardState)
      .filter((square) => boardState[square].charAt(1) === "P")
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateKnightValidMoves(squareId, includeNonCaptures, includeSelfAttacks, null, null, boardState) // , squareToImagineEmpty, squareToImagineFriendly) 
      // // are squares to imagine empty/friendly needed for knights? blocking isn't possible... 
      .filter((square) => boardState[square].charAt(1) === "N")
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateBishopValidMoves(squareId, includeNonCaptures, includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly, boardState)
      .filter((square) => ["B","Q"].includes(boardState[square].charAt(1)))
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateRookValidMoves(squareId, includeNonCaptures, includeSelfAttacks, squareToImagineEmpty, squareToImagineFriendly, boardState)
      .filter((square) => ["R","Q"].includes(boardState[square].charAt(1)))
      .forEach((square) => squaresTargetingThisOne.push(square));

    this.generateKingValidMoves(squareId, includeNonCaptures, includeSelfAttacks, false, boardState) // includeNonCaptures should be set to..? 
      // it depends on if this method is being called on a square with a piece on it or an empty square i guess, or if we're just highlighting vs actually using the results 
      // also, at this moment all others are using false, king is only one set to true, and it seems kinda working... but let's set it to the new var 
      // OK i broke it again and neither value for includeNonCaptures works ... am i setting includeNonCaptures correctly? 
      // hmm, it is specifically because of the change in wouldOwnKingBeInCheckAfterMove where i tried to use getPieceKeysCopy and set state appropriately..? 
      // TODO investigate later 
      .filter((square) => boardState[square].charAt(1) === "K")
      .forEach((square) => squaresTargetingThisOne.push(square));

    return squaresTargetingThisOne;
  }

  updateMoveHistory = (squareMovedFrom, squareMovedTo, boardState) => {
    this.setState({
      ...this.state,
      history: this.state.history.concat([{
        pieceKeys: boardState,
        AN: this.generateMoveAN(squareMovedFrom, squareMovedTo), // TODO generate Algebraic Notation for this move -- to do so, we need to know if any other 
                  //   pieces of the same type would be able to make the same move 
        JN: this.generateMoveJN(squareMovedFrom, squareMovedTo), 
        INN: this.generateMoveINN(squareMovedFrom, squareMovedTo),
        // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
      }]),
    });
  }

  deselectAndRemoveHighlightFromAllSquares = () => {
    this.setState({
      ...this.state,
      squareSelected: null,
      squareAltSelected: null,
      squareProps: this.state.squareProps.map((oldProps) => {
        return {
          ...oldProps,
          isHighlighted: false,
          isSelected: false,
          isAltHighlighted: false,
          isAltSelected: false,
        }
      }),
    });
  }

  selectSquareAndHighlightAllLegalMoves = (squareToSelect, legalMovesToHighlight) => {
    this.setState({
      ...this.state,
      squareSelected: squareToSelect,
      squareAltSelected: null,
      squareProps: this.state.squareProps.map((oldProps, squareId) => {
        const shouldHighlight = legalMovesToHighlight.includes(squareId);
        const shouldSelect = (squareId === squareToSelect);
        return {
          ...oldProps,
          isHighlighted: shouldHighlight,
          isSelected: shouldSelect,
          isAltHighlighted: false,
          isAltSelected: false,
        }
      }),
    });
  }

  handleSquareClick = (squareId) => {
    // clicking the same square again removes all highlighting and selections 
    if (this.state.squareSelected === squareId) {
      this.deselectAndRemoveHighlightFromAllSquares();
      return;
    }
    // otherwise, we're either clicking on a square for the first time, or clicking on a different square 
    // disallow multi-piece selection for now 
    // if (this.state.squareSelected === null || this.state.squareSelected !== squareId) { 

    // if we clicked on an un-highlighted and unselected square square
    // we're either clicking on a square for the first time, 
    // or a square that is not a legal move of whichever piece/square is highlighted,
    // then we just apply the selection and highlighting to prepare for the next click
    if (!this.state.squareProps[squareId].isHighlighted) {
      // select an unselected and unhighlighted square and highlight the legal moves for that piece on this turn 
      const isThisPlayersMove = this.state.whiteToPlay ^ this.state.pieceKeys[squareId]?.charAt(0) === 'D';
      const squaresToHighlight = isThisPlayersMove ? this.getLegalMoves(squareId) : [];
      this.selectSquareAndHighlightAllLegalMoves(squareId, squaresToHighlight);
      return;
    }

    // otherwise, a square is already selected, and we clicked on one of its legal move squares 
    // if (this.state.squareProps[squareId].isHighlighted) {
    // Move piece at selected square to clicked highlighted square
    const squareMovedFrom = this.state.squareSelected;
    const squareMovedTo = squareId;
    const newPieceKeys = this.getNewPieceKeysCopyWithMoveApplied(squareMovedFrom, squareMovedTo);
    if (this.state.pieceKeys[squareMovedFrom].charAt(1) === 'K') {
      if (this.state.pieceKeys[squareMovedFrom].charAt(0) === 'L') {
        this.setState({...this.state, lightKingHasLongCastlingRights: false, lightKingHasShortCastlingRights: false});
      } else {
        this.setState({...this.state, darkKingHasLongCastlingRights: false, darkKingHasShortCastlingRights: false});
      }
      if (!this.isMoveCastling(squareMovedFrom, squareMovedTo)) {
        if (newPieceKeys[squareMovedTo].charAt(0) === 'L') {
          this.setState({...this.state, lightKingPosition: squareMovedTo});
        } else {
          this.setState({...this.state, darkKingPosition: squareMovedTo});
        }
      } else {
        const directionFromKing = squareMovedFrom < squareMovedTo ? 1 : -1;
        const squareIdOfKingAfterCastling = squareMovedFrom + directionFromKing * 2;
        if (newPieceKeys[squareIdOfKingAfterCastling].charAt(0) === 'L') {
          this.setState({...this.state, lightKingPosition: squareIdOfKingAfterCastling});
        } else {
          this.setState({...this.state, darkKingPosition: squareIdOfKingAfterCastling});
        }
      }
    } else if (this.state.pieceKeys[squareMovedFrom].charAt(1) === 'R') {
      if (this.state.pieceKeys[squareMovedFrom].charAt(0) === 'L') {
        if (squareMovedFrom === 63) {
          this.setState({...this.state, lightKingHasShortCastlingRights: false});
        } else if (squareMovedFrom === 56) {
          this.setState({...this.state, lightKingHasLongCastlingRights: false});
        }
      } else {
        if (squareMovedFrom === 7) {
          this.setState({...this.state, darkKingHasShortCastlingRights: false});
        } else if (squareMovedFrom === 0) {
          this.setState({...this.state, darkKingHasLongCastlingRights: false});
        }
      }
    } else if (this.state.pieceKeys[squareMovedFrom].charAt(1) === 'P') {
      const isPromoting = Math.floor(squareMovedTo / 8) === (this.state.whiteToPlay ? 0 : 7);
      if (isPromoting) {
        // TODO implement UI, just auto-queen for now 
        // newPieceKeys is const, but can we change elements?? 
        newPieceKeys[squareMovedTo] = this.state.pieceKeys[squareMovedFrom].charAt(0) + 'Q';
      }
    }

    const nextMoveAN = this.generateMoveAN(squareMovedFrom, squareMovedTo); // , newPieceKeys);
    const nextMoveJN = this.generateMoveJN(squareMovedFrom, squareMovedTo);
    const nextMoveINN = this.generateMoveINN(squareMovedFrom, squareMovedTo);

    // TODO there's a bug with castling, rook stopped showing up, seems like it's here somewhere ...
    // can i not setState twice back to back or something weird?? why is that happening? 
    // EDIT: no the issue was somewhere else, avoiding modifying state directly above resolved that issue. 
    // NOTE: *DO NOT CALL METHODS THAT REFERENCE STATE WHILE SETTING STATE* 
    this.setState({
      ...this.state,
      squareSelected: null,
      squareAltSelected: null,
      whiteToPlay: !this.state.whiteToPlay,
      pieceKeys: newPieceKeys,
      squareProps: this.state.squareProps.map((squareProps, squareId) => {
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
        }
      }),
      history: this.state.history.concat([{
        pieceKeys: newPieceKeys,
        AN: nextMoveAN, // TODO generate Algebraic Notation for this move -- to do so, we need to know if any other 
                  //   pieces of the same type would be able to make the same move 
        JN: nextMoveJN, 
        INN: nextMoveINN,
        // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
      }]),
    });

    // this.updateMoveHistory(squareMovedFrom, squareMovedTo, newPieceKeys);
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
          return {
            ...oldProps,
            isAltSelected: (squarePropId === squareId),
            isAltHighlighted: shouldAltHighlight,
            isSelected: false,
            isHighlighted: false,
          }
        }),
      })
    } else {
      this.setState({
        ...this.state,
        squareAltSelected: null,
        squareProps: this.state.squareProps.map((oldProps, squarePropId) => {
          return {
            ...oldProps,
            isAltSelected: false,
            isAltHighlighted: false,
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
