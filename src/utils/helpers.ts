import React, { isValidElement } from 'react';

import Game from '../components/Game.tsx';
import GameProps from '../components/Game.tsx';
import GameState from '../components/Game.tsx';

import * as constants from './constants.ts';

// // ********* GETTERS *********
// // ***** and generators *****

// // this method is called before this move is applied to state, still current player's turn 
// // IS DEPENDENT ON CURRENT BOARD STATE 
// // export const generateMoveAN = (component: React.Component<GameProps, GameState>, squareMovedFrom: number, squareMovedTo: number): string => { // , futureBoardState = this.state.pieceKeys) => {
// export const generateMoveAN = (squareMovedFrom: number, squareMovedTo: number, currentBoardState: string[]): string => {
//     // // TODO error handling 
//     // if (!component) {
//     //     console.error("Component was null or undefined in helpers#generateMoveAN");
//     //     throw new Error('Component was null or undefined');
//     // }
//     // if (!component.state) {
//     //     console.error("Component argument had no state attribute in helpers#generateMoveAN");
//     //     throw new Error('Component has no state attribute');
//     // }
//     // if (!component.state.pieceKeys) {
//     //     console.error("Component state had no pieceKeys attribute in helpers#generateMoveAN");
//     //     throw new Error('Component has no pieceKeys state');
//     // }
//     const futureBoardState = getNewPieceKeysCopyWithMoveApplied(currentBoardState, squareMovedFrom, squareMovedTo);
//     // const currentBoardState = component.state.pieceKeys.slice();
//     let [playerCode, pieceCode] = currentBoardState[squareMovedFrom].split(''); // [null, null]; // futureBoardState[squareMovedTo].split('');
//     if (playerCode === null && pieceCode === null) { // null !== undefined ... SMH 
//       // this shouldn't happen, remnant of previous approach 
//       [playerCode, pieceCode] = futureBoardState[squareMovedTo].split('');
//     }

//     const isEnPassantCapture = isMoveEnPassant(squareMovedFrom, squareMovedTo, currentBoardState); // uses current board state, move not applied yet 
//     const isCapture = (currentBoardState[squareMovedTo] !== '' || isEnPassantCapture ? 'x' : ''); 
//     const opponent = component.state.whiteToPlay ? 'b' : 'w';
//     const isCheck = component.isKingInCheck(opponent, futureBoardState) ? '+' : ''; // TODO or checkmate 
//     // const isPawnPromotion = '=[Q,R,B,N]'; // TODO implement 

//     const destinationFile = 'abcdefgh'.charAt(squareMovedTo % 8);
//     const destinationRank = 8 - Math.floor(squareMovedTo / 8); // remember that our 0-63 is kind of backwards, and 0-indexed 

//     const movesThatNecessitateFurtherClarification = component.getSquaresWithPiecesThatCanAttackThisSquare(squareMovedTo, true, null, null, futureBoardState) // get all pieces incl. self-attacks 
//       .filter((squareId: number) => futureBoardState[squareId].charAt(0) === playerCode) // filter out non-self-attacks (opponent attacks)
//       .filter((squareId: number) => futureBoardState[squareId].charAt(1) === pieceCode) // get only self-attacks from the same type of piece 
//       .filter((squareId: number) => squareId !== squareMovedFrom); // state issue TODO fix ... including this piece 

//     // console.log(movesThatNecessitateFurtherClarification);

//     if (movesThatNecessitateFurtherClarification.length === 0) {
//       if (pieceCode === 'P') {
//         if (isCapture !== '') {
//           const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
//           return `${sourceFile}x${destinationFile}${destinationRank}${isCheck}`;
//         }
//         return `${destinationFile}${destinationRank}${isCheck}`;
//       }
//       return `${pieceCode}${isCapture}${destinationFile}${destinationRank}${isCheck}`;
//     } else {
//       // if (movesThatNecessitateFurtherClarification.length > 1) {
//       //   // this can actually be kind of complicated, for example if one or some of the pieces are pinned, 
//       //   // or promoting several pawns to knights and all (up to 4) attack the same square but have different rank *and* file
//       //   // for rooks, bishops, (even queens? no...) just default with sourceFile,
//       //   // use sourceRank if necessary due to duplicate identical sourceFile options, or use both of both have dupes 
//       //   const sourceFile
//       //   return 
//       // }
//       const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
//       const sourceRank = 8 - Math.floor(squareMovedFrom / 8);
//       let dupeSourceFiles = false;
//       let dupeSourceRanks = false;
//       // for (const altMove in movesThatNecessitateFurtherClarification.items()) {
//       for (let i = 0; i < movesThatNecessitateFurtherClarification.length; i++) {
//         const altMove = movesThatNecessitateFurtherClarification[i];
//         // check if piece move is actually legal here??? could expose a check 
//         // if (this.wouldOwnKingBeInCheckAfterMove(altMove, squareMovedTo)) continue; 
//         const altSourceFile = 'abcdefgh'.charAt(altMove % 8);
//         const altSourceRank = 8 - Math.floor(altMove / 8);
//         dupeSourceFiles = dupeSourceFiles || (sourceFile === altSourceFile);
//         dupeSourceRanks = dupeSourceRanks || (sourceRank === altSourceRank);
//         // console.log(`\tPiece at ${altMove} results in dupeSourceFiles:${dupeSourceFiles} (file:${altSourceFile}) and dupeSourceRanks:${dupeSourceRanks} (rank:${altSourceRank})`);
//       }
//       const pieceClarification = dupeSourceFiles ? (dupeSourceRanks ? `${sourceFile}${sourceRank}` : `${sourceRank}`) : `${sourceFile}`;
//       return `${pieceCode}${pieceClarification}${isCapture}${destinationFile}${destinationRank}${isCheck}`;
//     }
// }

// not dependent on current board state
export const generateMoveJN = (squareMovedFrom: number, squareMovedTo: number): string => {
    return `${String(squareMovedFrom).padStart(2, '0')}${String(squareMovedTo).padStart(2, '0')}`;
}

// not dependent on current board state
export const generateMoveINN = (squareMovedFrom: number, squareMovedTo: number): string => {
    // squareMovedFrom, squareMovedTo passed in as squareId values from 0-63
    const fromRank = Math.floor(squareMovedFrom / 8); // TODO ranks are backwards 
    const fromFile = squareMovedFrom % 8;
    const toRank = Math.floor(squareMovedTo / 8); // TODO ranks are backwards 
    const toFile = squareMovedTo % 8;
    return `${fromRank}${fromFile}${toRank}${toFile}`;
}

// currentBoardState does not yet have move applied from squareMovedFrom to squareMovedTo 
// pieceMoving is still on squareMovedFrom 
// we ASSUME that the arguments passed in represent a valid board state and a legal move to make 
export const isMoveEnPassant = (squareMovedFrom: number, squareMovedTo: number, currentBoardState: string[]): boolean => {
    if (currentBoardState[squareMovedFrom]?.charAt(1) !== 'P') return false; // not a pawn 
    if (squareMovedFrom % 8 === squareMovedTo % 8) return false; // same file, not a capture 
    if (currentBoardState[squareMovedTo] !== '') return false; // regular capture 
    return true;
}

// again, assume input arguments represent a legal move on a valid board
export const isMoveCastling = (squareMovedFrom: number, squareMovedTo: number, currentBoardState: string[]): boolean => {
    if (currentBoardState[squareMovedFrom].charAt(1) !== 'K') return false;
    if (squareMovedFrom === 4) {
        // black king moved from starting square 
        return [0, 7].includes(squareMovedTo);
    } else if (squareMovedFrom === 60) {
        // light king moved from starting square 
        return [56, 63].includes(squareMovedTo);
    }
    return false;
}

export function getCastlingOptions(player: string, currentGame: Game): number[] {
    let castlingOptions: number[] = [];

    // if (!['L','D'].includes(player)) return [];
    if (!constants.validPlayers.includes(player)) return [];

    const kingStartingSquare: number = player === 'L' ? 60 : 4;
    const rookStartingSquares: number[] = player === 'L' ? [56, 63] : [0, 7];

    rookStartingSquares
        .forEach((rookStartingSquare: number) => {
            const squaresBetween: number = Math.abs(rookStartingSquare - kingStartingSquare);
            // var dir: number; // = constants.DIR.E;
            let castlingSliceStart: number, castlingSliceEnd: number; 
            let castlingSafetySquares: number[]; 
            if (squaresBetween === 4) {
                // long castling (qs)
                const qsCastlingRights: boolean = 
                    player === constants.PLAYER.WHITE ? 
                        currentGame.state.lightKingHasLongCastlingRights :
                        currentGame.state.darkKingHasLongCastlingRights;
                if (!qsCastlingRights) return;

                castlingSliceStart = rookStartingSquare + 1;
                castlingSliceEnd = kingStartingSquare;

                castlingSafetySquares = player === 'L' ? [60, 59, 58] : [4, 3, 2];
            } else if (squaresBetween === 3) {
                // short castling (ks) 
                const ksCastlingRights: boolean = 
                    player === constants.PLAYER.WHITE ? 
                        currentGame.state.lightKingHasShortCastlingRights :
                        currentGame.state.darkKingHasShortCastlingRights;
                if (!ksCastlingRights) return;

                castlingSliceStart = kingStartingSquare + 1;
                castlingSliceEnd = rookStartingSquare;
                
                castlingSafetySquares = player === 'L' ? [60, 61, 62] : [4, 5, 6];
            } else {
                // should never happen, but just to make sure and avoid compiler errors 
                return;
            }

            const ourPiecesAreBlockingCastling = currentGame.state.pieceKeys
                .slice(kingStartingSquare + 1, rookStartingSquare)
                .some(pieceKey => pieceKey !== '') || true;
            if (ourPiecesAreBlockingCastling) return;

            const theirPiecesAreBlockingCastling = castlingSafetySquares
                .some(castlingSafetySquare => currentGame.getOccupiedSquaresThatCanAttackThisSquare(
                    castlingSafetySquare,
                    constants.validPlayers.filter(validPlayer => validPlayer !== player),
                    currentGame.state.pieceKeys,
                ).length > 0);
            if (theirPiecesAreBlockingCastling) return;

            castlingOptions.push(rookStartingSquare);
        })

    return castlingOptions;
}

// either both kingPosition and boardState must be supplied, or currentGame must be supplied 
export function isKingInCheck(kingPositionArg: number, boardStateArg: string[], currentGame?: Game): boolean;
export function isKingInCheck(kingPositionArg?: number, boardStateArg?: string[], currentGame?: Game): boolean {
    // this block guarantees that if currentGame was not passed in correctly, 
    // then kingPosition and boardState must have been passed in 
    if (!currentGame || !currentGame.state) {
        if (!boardStateArg) {
            console.error("No game found.");
            throw Error("No game found.");
        } else if (!kingPositionArg) {
            console.error("No king position argument supplied.");
            throw Error("No king position argument supplied.");
        }
    }

    // default implementation assumes that we are checking current boardState position in state
    // before any moves have been played, and use state to determine which king to check 
    const boardState: string[] = boardStateArg || currentGame!.state.pieceKeys;
    const kingPosition: number = kingPositionArg || (
        currentGame!.state.whiteToPlay ?
            currentGame!.state.darkKingPosition! :
            currentGame!.state.lightKingPosition!
    );

    // maybe here we can easily set like a canBlock, canCapture, canEvade boolean state system ...
    // canBlock seems like the only tricky one, gotta check all piece moves 
    if (!boardState || boardState.length === 0) {
        console.error("Found invalid board state.");
        throw Error("Found invalid board state.");
    }
    if (
        boardState[kingPosition] === '' ||
        boardState[kingPosition].charAt(1) !== 'K'
    ) {
        console.error(`No king found at ${kingPosition}; found ${boardState[kingPosition]}`);
        throw Error(`No king found at ${kingPosition}; found ${boardState[kingPosition]}`);
    }

    const defender: string = boardState[kingPosition].charAt(0);
    const attackers: string[] = ['L','D'].filter(player => player !== defender);
    // const playerToMove: string = (currentGame && currentGame.state.whiteToPlay ? 'L' : 'D') || (attackers[0]);

    let attackingSquares = null;
    if (currentGame) {
        attackingSquares = currentGame.getOccupiedSquaresThatCanAttackThisSquare(
            kingPosition, 
            attackers,
            boardState
        );
    } else {
        console.error("Not implemented. Must pass currentGame argument for now.");
        throw Error("Not implemented yet.");
    }

    // console.log(`Squares attacking our ${defender}K on ${kingPosition}: ${attackingSquares}`);

    return (attackingSquares !== null && attackingSquares.length !== 0);
    // if attackingSquares.length > 1, it's a double check, can't possible block or capture out of it 
    // have to evade with the king, check if opponent attacks all of the squares around our king 
    // if attackingSquares.length === 1, we can first try to capture or make a line from the attackingSquare to our king
    // and see if we can put a piece on any of those squares in the line to block 
}

const isArgumentStringArray = (arg: any): boolean => {
    if (!Array.isArray(arg)) return false;
    return arg.every(element => typeof element === 'string');
}

const isArgumentReactComponent = (arg: any): boolean => {
    const argPrototype: any | null = Object.getPrototypeOf(arg);
    if (!argPrototype) {
        console.log(`Arg ${arg} has no prototype property.`);
    }
    if (argPrototype instanceof React.Component) {
        // alert(`${(arg as React.Component<GameProps, GameState>).name}`);
        // console.log(argPrototype);
        try {
            (argPrototype as React.Component<GameProps, GameState>)
        } catch (error) {
            console.error(error);
        }
        return true;
    }
     if (isValidElement(arg) || isValidElement(argPrototype)) {
        console.log(`${argPrototype || arg} is a valid React element.`);
    }
    // if (arg.prototype instanceof React.Component) {
    //     // evaluates to false on regular flow ... research prototypes more 
    //     return true;
    // }
    return false;
}

// TODO we need to allow this to handle pawn promotions 
export function getNewPieceKeysCopyWithMoveApplied(boardState: string[], squareMovedFrom: number, squareMovedTo: number): string[];
export function getNewPieceKeysCopyWithMoveApplied(component: React.Component<any, any>, squareMovedFrom: number, squareMovedTo: number): string[];
// export function getNewPieceKeysCopyWithMoveApplied(componentState: GameState, squareMovedFrom: number, squareMovedTo: number): string[];
// export const getNewPieceKeysCopyWithMoveApplied = (component: React.Component<any, any>, squareMovedFrom: number, squareMovedTo: number): string[] => {
export function getNewPieceKeysCopyWithMoveApplied(state: unknown, squareMovedFrom: number, squareMovedTo: number): string[] {
    let currentBoardState: string[] | null = null;
    if (isArgumentStringArray(state)) { 
        currentBoardState = state as string[]; 
        // console.log(currentBoardState); 
    }
    else if (isArgumentReactComponent(state)) {
        // try {
        //     const inputComponentState: GameProps | GameState = (state as React.Component<GameProps, GameState>).state;
        //     // currentBoardState = inputComponentState.pieceKeys;
        //     console.log(inputComponentState);
        // } catch (error) {
        //     console.error(error);
        //     const inputComponent: Game = state as Game;
        //     currentBoardState = inputComponent.state.pieceKeys;
        //     if (!currentBoardState || currentBoardState.length === 0) return [];
        // }
        const inputComponent: Game = state as Game;
        currentBoardState = inputComponent.state.pieceKeys;
    } 
    else {
        return [];
    }
    // if (arguments)
    // console.log(currentBoardState);
    if (!currentBoardState || currentBoardState.length === 0) return [];

    const pieceMoving = currentBoardState[squareMovedFrom];
    let squareIdOfPawnCapturedViaEnPassant = null;
    let squareIdOfKingAfterCastling = null;
    let squareIdOfRookAfterCastling = null;
    let castlingRook = null;
    // copy the array before mutating so React sees a new reference
    let newPieceKeys = currentBoardState.slice();

    if (isMoveEnPassant(squareMovedFrom, squareMovedTo, currentBoardState)) {
        // alert("An en passant occurred...");
        squareIdOfPawnCapturedViaEnPassant = squareMovedTo + -8 * (pieceMoving.charAt(0) === 'L' ? -1 : 1);
        newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
        newPieceKeys[squareMovedFrom] = "";
        newPieceKeys[squareMovedTo] = pieceMoving;
    } else if (isMoveCastling(squareMovedFrom, squareMovedTo, currentBoardState)) {
        // indicates that the king is castling 
        let directionFromKing = 1;
        if (squareMovedTo < squareMovedFrom) directionFromKing = -1;
        castlingRook = currentBoardState[squareMovedTo];
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

    // console.log(newPieceKeys);
    return newPieceKeys; // , {squareIdOfPawnCapturedViaEnPassant, squareIdOfKingAfterCastling, squareIdOfRookAfterCastling};
}

// // ********* SETTERS *********

export const updateState = (component: React.Component<any, any>, stateKey: string, stateValue: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!component) {
            console.error("Component was null or undefined in helpers#updateState");
            return reject(new Error('Component was null or undefined'));
        }
        if (typeof component.setState !== 'function') {
            console.error("Component argument had no setState in helpers#updateState");
            return reject(new Error('Component has no setState'));
        }

        // Use functional setState pattern and resolve when the update is applied.
        component.setState((prevState: any) => ({
            ...prevState,
            [stateKey]: stateValue,
        }), () => {
            // console.log(`After updating state on component, new state is: ${JSON.stringify(component.state)}`);
            resolve();
        });
    });
};

export const multiUpdateState = (component: React.Component<any, any>, stateKVPs: { [key: string]: any }): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!component) {
            console.error("Component was null or undefined in helpers#updateState");
            return reject(new Error('Component was null or undefined'));
        }
        if (typeof component.setState !== 'function') {
            console.error("Component argument had no setState in helpers#updateState");
            return reject(new Error('Component has no setState'));
        }

        // Use functional setState pattern and resolve when the update is applied.
        component.setState((prevState: any) => ({
            ...prevState,
            ...stateKVPs,
        }), () => {
            // console.log(`After updating state on component, new state is: ${JSON.stringify(component.state)}`);
            resolve();
        });
    });
}