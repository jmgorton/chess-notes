import React from 'react';

import Game from '../components/Game.tsx';
// import GameProps from '../components/Game.tsx';
import GameState from '../components/Game.tsx';

import * as constants from './constants.ts';
import * as functions from './functions.ts';
import { Move, PlayerKey, RoyalKeycode } from './types.ts';

import { keycodeToComponent } from '../components/Piece.tsx';

// // ********* GETTERS *********
// // ***** and generators *****

// this method is called before this move is applied to state, still current player's turn 
// boardState, whiteToPlay, kingPositions, this.wouldOwnKingBeInCheckAfterMove
// TODO ... add optional boolean indicating whether move has been played yet? 
export function generateMoveAN(movePlayed: Move, currentState?: {
    pieceKeys: string[],
    whiteToPlay: boolean,
    kingPositions: { [key: string]: number },
}): string;
export function generateMoveAN(movePlayed: Move, currentState?: Game): string; // , futureBoardState = this.state.pieceKeys) => {
export function generateMoveAN(movePlayed: Move, currentState?: unknown): string {
    if (!currentState) {
        throw Error("Unable to generate algebraic notation for move without game context.");
    }

    if (typeof currentState === 'object') {
        if (!(currentState instanceof Game)) {
            throw Error("Not yet implemented.");
        } else {
            currentState = currentState as Game;
        }
    }

    const currentGame: Game = currentState as Game;

    // const requiredFields: string[] = ['pieceKeys'];
    // ('whiteToPlay' + ('kingPositions' | 'darkKingPosition' & 'lightKingPosition')) | kingPosition arg 
    // refactor isKingInCheck to not require full Game state ... also wouldOwnKingBeInCheckAfterMove 
    //   isKingInCheck should be pretty easy actually, and just needs pieceKeys and kingPosition(s)/whiteToPlay 
    // and this method also requires any fields those methods require 
        // required args for wouldOwnKingBeInCheckAfterMove:
    //   pieceKeys, whiteToPlay + kingPositions | kingPosition arg, 
    const currentBoardState = currentGame.state.pieceKeys.slice();
    const futureBoardState = getNewPieceKeysCopyWithMoveApplied(currentBoardState, movePlayed);

    const { squareMovedFrom, squareMovedTo, pieceMoving: pieceCode, playerMoving: playerCode } = movePlayed;
    // let [playerCode, pieceCode] = currentBoardState[squareMovedFrom].split(''); // [null, null]; // futureBoardState[squareMovedTo].split('');
    // if (playerCode === null && pieceCode === null) { // null !== undefined ... SMH 
    //     // this shouldn't happen, remnant of previous approach 
    //     [playerCode, pieceCode] = futureBoardState[squareMovedTo].split('');
    // }

    if (isMoveCastling(movePlayed)) { 
        const isShortCastling: boolean = Math.abs(squareMovedFrom - squareMovedTo) === 3;
        return isShortCastling ? 'O-O' : 'O-O-O'; 
    }

    let pieceAN, clarifierAN, isCaptureAN, destFileAN, destRankAN, promotionAN, isCheckOrCheckmateAN = '';

    let kingPosition = currentGame.state.whiteToPlay ? 
        currentGame.state.darkKingPosition : 
        currentGame.state.lightKingPosition;
    // const opponent = currentGame.state.whiteToPlay ? 'D' : 'L';
    // let kingPosition = currentGame.state.kingPositions[opponent];
    // using opponent's king position, but we just played the move... this never happens 
    // if (kingPosition === squareMovedFrom) kingPosition = squareMovedTo;

    if (isKingInCheck(
        kingPosition, 
        futureBoardState, 
        // this // this was like this... how was that working??
        currentGame // why is this passing something null? Either currentGame or currentGame.state is null... Hmm... 
    )) {
        // if (this.isCheckmate()) isCheckOrCheckmateAN = '#';
        isCheckOrCheckmateAN = '+';
    }
    
    if (isMovePromotion(movePlayed)) {
        promotionAN = `=${movePlayed.promotingTo}`;
    }

    // remember that our 0-63 is kind of backwards, and 0-indexed 
    destRankAN = 8 - Math.floor(squareMovedTo / 8); 
    destFileAN = 'abcdefgh'.charAt(squareMovedTo % 8);

    if (
        currentBoardState[squareMovedTo] !== '' ||
        isMoveEnPassant(movePlayed, currentBoardState)
    ) {
        isCaptureAN = 'x';
    }

    if (pieceCode === 'P') {
        if (isCaptureAN === 'x') clarifierAN = 'abcdefgh'.charAt(squareMovedFrom % 8);
    } else {
        pieceAN = pieceCode;
        const movesThatNecessitateFurtherClarification = getOccupiedSquaresThatCanAttackThisSquare(squareMovedTo, [playerCode], futureBoardState)
            // .filter((squareId) => futureBoardState[squareId].charAt(1) === pieceCode) // get only self-attacks from the same type of piece 
            // .filter((squareId) => squareId !== squareMovedFrom); // state issue TODO fix ... including this piece 
            .filter(squareId => {
                if (futureBoardState[squareId].charAt(1) !== pieceCode) return false; // get only self-attacks from the same type of piece 
                const moveToCheck: Move = {
                    squareMovedFrom: squareId,
                    squareMovedTo,
                    pieceMoving: pieceCode,
                    playerMoving: playerCode,
                }
                return !wouldOwnKingBeInCheckAfterMove(moveToCheck, currentGame) // squareId, squareMovedTo, currentGame
            }) // don't allow illegal moves ... use current state, not future 

        // console.log(movesThatNecessitateFurtherClarification);

        if (movesThatNecessitateFurtherClarification.length > 0) {
            // if (movesThatNecessitateFurtherClarification.length > 1) {
            //   // this can actually be kind of complicated, for example if one or some of the pieces are pinned, 
            //   // or promoting several pawns to knights and all (up to 4) attack the same square but have different rank *and* file
            //   // for rooks, bishops, (even queens? no...) just default with sourceFile,
            //   // use sourceRank if necessary due to duplicate identical sourceFile options, or use both of both have dupes 
            // }
            const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
            const sourceRank = 8 - Math.floor(squareMovedFrom / 8);
            let dupeSourceFiles = false;
            let dupeSourceRanks = false;
            // for (const altMove in movesThatNecessitateFurtherClarification.items()) {
            for (let i = 0; i < movesThatNecessitateFurtherClarification.length; i++) {
                const altMove = movesThatNecessitateFurtherClarification[i];
                const altSourceFile = 'abcdefgh'.charAt(altMove % 8);
                const altSourceRank = 8 - Math.floor(altMove / 8);
                dupeSourceFiles = dupeSourceFiles || (sourceFile === altSourceFile);
                dupeSourceRanks = dupeSourceRanks || (sourceRank === altSourceRank);
                // console.log(`\tPiece at ${altMove} results in dupeSourceFiles:${dupeSourceFiles} (file:${altSourceFile}) and dupeSourceRanks:${dupeSourceRanks} (rank:${altSourceRank})`);
            }
            if (dupeSourceFiles && dupeSourceRanks) clarifierAN = `${sourceFile}${sourceRank}`;
            else if (dupeSourceFiles) clarifierAN = `${sourceRank}`;
            else clarifierAN = `${sourceFile}`; //  if (dupeSourceRanks)
        }
    }

    return [pieceAN, clarifierAN, isCaptureAN, destFileAN, destRankAN, promotionAN, isCheckOrCheckmateAN].join('');
}

// not dependent on current board state
export const generateMoveJN = (movePlayed: Move): string => {
    const { squareMovedFrom, squareMovedTo } = movePlayed;
    return `${String(squareMovedFrom).padStart(2, '0')}${String(squareMovedTo).padStart(2, '0')}`;
}

// not dependent on current board state
export const generateMoveINN = (movePlayed: Move): string => {
    const { squareMovedFrom, squareMovedTo } = movePlayed;
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
// TODO rename function to wouldMoveBeEnPassant ??? 
export const isMoveEnPassant = (movePlayed: Move, currentBoardState: string[]): boolean => { // maybe just pass in enPassantTargetSquare... 
    const { squareMovedFrom, squareMovedTo, pieceMoving } = movePlayed;
    if (pieceMoving !== 'P') return false; // not a pawn 
    if (squareMovedFrom % 8 === squareMovedTo % 8) return false; // same file, not a capture 
    if (currentBoardState[squareMovedTo] !== '') return false; // regular capture 
    return true;
}

// again, assume input arguments represent a legal move on a valid board
export const isMoveCastling = (movePlayed: Move): boolean => {
    const { squareMovedFrom, squareMovedTo, pieceMoving } = movePlayed;
    if (pieceMoving !== 'K') return false;
    if (squareMovedFrom === 4) {
        // black king moved from starting square 
        return [0, 7].includes(squareMovedTo);
    } else if (squareMovedFrom === 60) {
        // light king moved from starting square 
        return [56, 63].includes(squareMovedTo);
    }
    return false;
}

export const isMovePromotion = (movePlayed: Move): boolean => {
    if (movePlayed.promotingTo) return true;
    // if (movePlayed.pieceMoving === 'P' && Math.floor(movePlayed.squareMovedTo / 8) === (movePlayed.playerMoving === 'L' ? 0 : 7)) return true;
    return false;
}

// export function getCastlingOptions(player: string, castlingRights: {}, boardState: string[]): number[] {
export function getCastlingOptions(player: PlayerKey, currentGame: Game): number[] {
    let castlingOptions: number[] = [];

    // console.log(`Checking castling options for player:${player} in game:${currentGame}`);

    // if (!['L','D'].includes(player)) return [];
    if (!constants.validPlayers.includes(player)) return [];

    const kingStartingSquare: number = player === 'L' ? 60 : 4;
    const rookStartingSquares: number[] = player === 'L' ? [56, 63] : [0, 7];

    rookStartingSquares.forEach((rookStartingSquare: number) => {
        const squaresBetween: number = Math.abs(rookStartingSquare - kingStartingSquare);
        // var dir: number; // = constants.DIR.E;
        let castlingSliceStart: number, castlingSliceEnd: number; 
        let castlingSafetySquares: number[]; 
        if (squaresBetween === 4) {
            // long castling (qs)
            const qsCastlingRights: boolean = currentGame.state.castlingRights![`${player}Q`]; // TODO verify 
                // player === constants.PLAYER.WHITE ? 
                //     currentGame.state.lightKingHasLongCastlingRights :
                //     currentGame.state.darkKingHasLongCastlingRights;
            if (!qsCastlingRights) {
                // console.log(`Player ${player} does not have long castling rights.`);
                return;
            }

            castlingSliceStart = rookStartingSquare + 1;
            castlingSliceEnd = kingStartingSquare;

            castlingSafetySquares = player === 'L' ? [60, 59, 58] : [4, 3, 2];
        } else if (squaresBetween === 3) {
            // short castling (ks) 
            const ksCastlingRights: boolean = currentGame.state.castlingRights![`${player}K`]; // TODO verify 
                // player === constants.PLAYER.WHITE ? 
                //     currentGame.state.lightKingHasShortCastlingRights :
                //     currentGame.state.darkKingHasShortCastlingRights;
            if (!ksCastlingRights) {
                // console.log(`Player ${player} does not have short castling rights.`);
                return;
            }

            castlingSliceStart = kingStartingSquare + 1;
            castlingSliceEnd = rookStartingSquare;
            
            castlingSafetySquares = player === 'L' ? [60, 61, 62] : [4, 5, 6];
        } else {
            // should never happen, but just to make sure and avoid compiler errors 
            console.warn("What the hell type of castling is this??");
            return;
        }

        const ourPiecesAreBlockingCastling = currentGame.state.pieceKeys
            .slice(castlingSliceStart, castlingSliceEnd)
            .some(pieceKey => pieceKey !== '');
        if (ourPiecesAreBlockingCastling) {
            // console.log(`Our pieces are blocking castling: ${currentGame.state.pieceKeys.slice(castlingSliceStart, castlingSliceEnd)}`);
            return;
        }

        const theirPiecesAreBlockingCastling = castlingSafetySquares
            .some(castlingSafetySquare => getOccupiedSquaresThatCanAttackThisSquare(
                castlingSafetySquare,
                constants.validPlayers.filter(validPlayer => validPlayer !== player),
                currentGame.state.pieceKeys,
            ).length > 0);
        if (theirPiecesAreBlockingCastling) {
            // console.log(`Their pieces are blocking castling.`);
            // castlingSafetySquares
            //     .forEach(castlingSafetySquare => console.log(`At square ${castlingSafetySquare}: ${getOccupiedSquaresThatCanAttackThisSquare(
            //         castlingSafetySquare,
            //         constants.validPlayers.filter(validPlayer => validPlayer !== player),
            //         currentGame.state.pieceKeys,
            //     )}`))
            return;
        }

        castlingOptions.push(rookStartingSquare);
    })
    
    // console.log(`Castling options: ${castlingOptions}`);

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
    // else {
    //     console.log(`Current game has no state. Must supply currentGame argument for now...`);
    //     throw Error("No state found for currentGame.");
    // }

    // default implementation assumes that we are checking current boardState position in state
    // before any moves have been played, and use state to determine which king to check 
    const boardState: string[] = boardStateArg || currentGame!.state.pieceKeys;
    const kingPosition: number = kingPositionArg || (
        currentGame!.state.whiteToPlay ?
            currentGame!.state.darkKingPosition! :
            currentGame!.state.lightKingPosition!
    );
    // const opponent = currentGame!.state.whiteToPlay ? 'D' : 'L';
    // const kingPosition: number = kingPositionArg || currentGame!.state.kingPositions[opponent];

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
        // TODO what about when we're checking a future position?? 
        console.error(`No king found at ${kingPosition}; found ${boardState[kingPosition]}`);
        // throw Error(`No king found at ${kingPosition}; found ${boardState[kingPosition]}`);
    }

    const defender: string = boardState[kingPosition].charAt(0);
    const attackers: string[] = ['L','D'].filter(player => player !== defender);
    // const playerToMove: string = (currentGame && currentGame.state.whiteToPlay ? 'L' : 'D') || (attackers[0]);

    const attackingSquares = getOccupiedSquaresThatCanAttackThisSquare(
        kingPosition, 
        attackers,
        boardState,
    );

    return (attackingSquares !== null && attackingSquares.length !== 0);
    // if attackingSquares.length > 1, it's a double check, can't possible block or capture out of it 
    // have to evade with the king, check if opponent attacks all of the squares around our king 
    // if attackingSquares.length === 1, we can first try to capture or make a line from the attackingSquare to our king
    // and see if we can put a piece on any of those squares in the line to block 
}

export function isKingCheckmated(): boolean {
    // is in check 
    // can't capture/block (if single check) 
    // can't evade 
    return false;
}

export function wouldOwnKingBeInCheckAfterMove(movePlayed: Move, currentGame?: Game): boolean {
    if (!currentGame) {
        // TODO handle kingPosition and boardState if currentGame is undefined 
        throw Error("Must supply currentGame arg (for now)...");
    }

    // TODO refactor to use Move object input 
    // const { squareMovedFrom, squareMovedTo, pieceMoving, playerMoving } = movePlayed;

    // required args from currentGame:
    //   pieceKeys, whiteToPlay + kingPositions | kingPosition arg, 

    const { squareMovedFrom, squareMovedTo, pieceMoving, playerMoving } = movePlayed;

    const futureState = getNewPieceKeysCopyWithMoveApplied(currentGame.state.pieceKeys, movePlayed);
    // const player = currentGame.state.whiteToPlay ? 'L' : 'D';
    // let ownKingPosition: number = currentGame.state.kingPositions[player];
    let ownKingPosition = currentGame.state.whiteToPlay ? currentGame.state.lightKingPosition : currentGame.state.darkKingPosition;
    if (ownKingPosition === squareMovedFrom) {
        if (isMoveCastling(movePlayed)) {
            if (squareMovedFrom === 4) {
                if (squareMovedTo === 7) ownKingPosition = 6;
                else if (squareMovedTo === 0) ownKingPosition = 2;
                else ownKingPosition = -1;
            } else if (squareMovedFrom === 60) {
                if (squareMovedTo === 63) ownKingPosition = 62;
                else if (squareMovedTo === 56) ownKingPosition = 58;
                else ownKingPosition = -1;
            } else {
                ownKingPosition = -1;
            }
        } else {
            ownKingPosition = squareMovedTo;
        }
    }

    return isKingInCheck(ownKingPosition, futureState); // , currentGame); // , currentGame);
}

// TODO we need to allow this to handle pawn promotions 
export function getNewPieceKeysCopyWithMoveApplied(boardState: string[], movePlayed: Move): string[];
export function getNewPieceKeysCopyWithMoveApplied(component: React.Component<any, any>, movePlayed: Move): string[];
// export function getNewPieceKeysCopyWithMoveApplied(componentState: GameState, squareMovedFrom: number, squareMovedTo: number): string[];
// export const getNewPieceKeysCopyWithMoveApplied = (component: React.Component<any, any>, squareMovedFrom: number, squareMovedTo: number): string[] => {
export function getNewPieceKeysCopyWithMoveApplied(state: unknown, movePlayed: Move): string[] {
    const { squareMovedFrom, squareMovedTo, pieceMoving, playerMoving } = movePlayed;
    let currentBoardState: string[] | null = null;
    if (functions.isArgumentStringArray(state)) { 
        currentBoardState = state as string[]; 
        // console.log(currentBoardState); 
    }
    else if (functions.isArgumentReactComponent(state)) {
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

    // const pieceMoving = currentBoardState[squareMovedFrom]; // oops, this was keycode, not just pieceMoving ... 
    let squareIdOfPawnCapturedViaEnPassant = null;
    let squareIdOfKingAfterCastling = null;
    let squareIdOfRookAfterCastling = null;
    let castlingRook = null;
    // copy the array before mutating so React sees a new reference
    let newPieceKeys = currentBoardState.slice();

    if (isMoveEnPassant(movePlayed, currentBoardState)) {
        // alert("An en passant occurred...");
        squareIdOfPawnCapturedViaEnPassant = squareMovedTo + -8 * (playerMoving === 'L' ? -1 : 1);
        newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
        newPieceKeys[squareMovedFrom] = "";
        newPieceKeys[squareMovedTo] = `${playerMoving}${pieceMoving}`;
    } else if (isMoveCastling(movePlayed)) {
        // indicates that the king is castling 
        let directionFromKing = 1;
        if (squareMovedTo < squareMovedFrom) directionFromKing = -1;
        castlingRook = currentBoardState[squareMovedTo];
        squareIdOfKingAfterCastling = squareMovedFrom + directionFromKing * 2;
        squareIdOfRookAfterCastling = squareMovedFrom + directionFromKing;
        newPieceKeys[squareMovedFrom] = "";
        newPieceKeys[squareMovedTo] = "";
        newPieceKeys[squareIdOfRookAfterCastling] = castlingRook;
        newPieceKeys[squareIdOfKingAfterCastling] = `${playerMoving}${pieceMoving}`;
    } else if (isMovePromotion(movePlayed)) {
        newPieceKeys[squareMovedFrom] = "";
        newPieceKeys[squareMovedTo] = `${playerMoving}${movePlayed.promotingTo}`;
    } else {
        newPieceKeys[squareMovedFrom] = "";
        newPieceKeys[squareMovedTo] = `${playerMoving}${pieceMoving}`;
    }

    // console.log(newPieceKeys);
    return newPieceKeys; // , {squareIdOfPawnCapturedViaEnPassant, squareIdOfKingAfterCastling, squareIdOfRookAfterCastling};
}


export function getNewStateAfterMoveIsApplied(currentState: object, moveToApply: Move): object {
    // TODO implement 
    return currentState;
}

export function doesStringMatchPatternFEN(input: string): boolean {
    // const matcher: RegExp = /^.*$/;
    const matcher = constants.googleGeminiMatcher;
    return input.match(matcher) !== null;
}

// takes a FEN string and sets the Game state accordingly, also returning new state 
// generateBoardStateFromFen = async (inputFEN: string): Promise<void> => { // { [key: string]: any } => {
export function getNewBoardStateKVPsFromFen(inputFEN: string): { [key: string]: any } { // { [key in GameState]: any } {
    // console.log("Generating board state from FEN: " + inputFEN)
    const [piecePlacement, sideToMove, castlingAbility, enPassantTargetSquare, halfmoveClock, fullmoveCounter] = inputFEN.split(' ');

    // about halfmoveClock and fullmoveCounter:
    // The halfmove clock specifies a decimal number of half moves with respect to the 50 move draw rule.
    //   It is reset to zero after a capture or a pawn move and incremented otherwise.
    // The fullmoveCounter is the  number of the full moves in a game. 
    //   It starts at 1, and is incremented after each Black's move.
    const rankPiecePlacements = piecePlacement.split('/');

    let newPieceKeys = Array(64).fill("");
    let newLightKingPosition = null;
    let newDarkKingPosition = null;

    let pki = 0;
    for (const rank of rankPiecePlacements) { // REMEMBER: of, not in 
            for (const char of rank) {
        // for (let i: number = 0; i < rank.length; i++) {
        //     const char = rank.charAt(i);
            if (char.match(/[1-8]/)) {
                let numEmptySquares = Number(char);
                pki += numEmptySquares;
            } else {
                const pieceCode = char.toUpperCase();
                const playerCode = (char === pieceCode) ? 'L' : 'D';
                newPieceKeys[pki] = `${playerCode}${pieceCode}`;
                if (pieceCode === 'K') {
                    if (playerCode === 'L') newLightKingPosition = pki;
                    else if (playerCode === 'D') newDarkKingPosition = pki;
                }
                pki += 1;
            }
        }
    }

    // TODO make this the correct type 
    const newStateKVPs = {
        pieceKeys: newPieceKeys,
        piecePositions: {},
        squareProps: newPieceKeys.map((pieceKey, squareId) => {
            return {
                keycode: pieceKey, // pieceId 
                id: squareId,
                isHighlighted: false,
                isAltHighlighted: false,
                isSelected: false,
                isAltSelected: false,
                isPromoting: false,
            }
        }),
        lightKingPosition: newLightKingPosition!, // TODO could add more validation here to make sure 
        darkKingPosition: newDarkKingPosition!, // there are kings on the board ... 
        kingPositions: {
            'L': newLightKingPosition,
            'D': newDarkKingPosition,
        },
        // piecePositions: {}, // TODO fill out all piece positions from FEN input 
        whiteToPlay: sideToMove === 'w',
        // darkKingHasShortCastlingRights: castlingAbility.includes('k'),
        // darkKingHasLongCastlingRights: castlingAbility.includes('q'),
        // lightKingHasShortCastlingRights: castlingAbility.includes('K'),
        // lightKingHasLongCastlingRights: castlingAbility.includes('Q'),
        castlingRights: {
            'DK': castlingAbility.includes('k'),
            'DQ': castlingAbility.includes('q'),
            'LK': castlingAbility.includes('K'),
            'LQ': castlingAbility.includes('Q'),
        },
        enPassantTargetSquare: enPassantTargetSquare === '-' ? null : Number(enPassantTargetSquare),
        plyNumber: Number(fullmoveCounter) * 2 + sideToMove === 'w' ? 0 : 1,
        halfmoveClock: Number(halfmoveClock),
        FEN: inputFEN,
        history: [], // no history from loading game from FEN 
        squareSelected: null,
        squareAltSelected: null,
    }

    return newStateKVPs;
}

// export function generateFENFromGameState(event?: React.SyntheticEvent | null, boardState?: string[]): string {
export function generateFENFromGameState(gameState: GameState): string;
export function generateFENFromGameState(gameState: { [key: string]: any }): string;
export function generateFENFromGameState(gameState: unknown): string {
    // if (event && typeof event.preventDefault === 'function') event.preventDefault();

    let boardState: string[];
    // let castlingRightsState: { [key: string]: any} = {};
    let castlingRightsState: { [key in RoyalKeycode]: boolean } = {
        LK: false,
        LQ: false,
        DK: false,
        DQ: false,
    };
    let whiteToPlay: boolean;
    let enPassantTargetSquareId: number | null = null;
    let halfmoveClock: number;
    let fullmoveCounter: number;

    const requiredKeys: string[] = ['pieceKeys','whiteToPlay','enPassantTargetSquare','halfmoveClock','fullmoveCounter'];
    const moreRequiredKeys: string[] = [
        'lightKingHasShortCastlingRights',
        'lightKingHasLongCastlingRights',
        'darkKingHasShortCastlingRights',
        'darkKingHasLongCastlingRights'
    ];

    if (gameState instanceof GameState) {
        boardState = gameState.state.pieceKeys; // || gameState.pieceKeys;
        whiteToPlay = gameState.state.whiteToPlay;
        enPassantTargetSquareId = gameState.state.enPassantTargetSquare;
        halfmoveClock = gameState.state.halfmoveClock;
        fullmoveCounter = Math.floor(gameState.state.plyNumber / 2);
        if ('castlingRights' in gameState.state && gameState.state.castlingRights) {
            // const castlingRightsInput = (gameState.state.castlingRights as { [key: string]: any });
            const castlingRightsInput = gameState.state.castlingRights;
            // castlingRightsState.DQ = castlingRightsInput.darkKingHasLongCastlingRights;
            // castlingRightsState.DK = castlingRightsInput.darkKingHasShortCastlingRights;
            // castlingRightsState.LQ = castlingRightsInput.lightKingHasLongCastlingRights;
            // castlingRightsState.LK = castlingRightsInput.lightKingHasShortCastlingRights;
            castlingRightsState = castlingRightsInput;
        // } else {
        //     castlingRightsState.DQ = gameState.state.darkKingHasLongCastlingRights;
        //     castlingRightsState.DK = gameState.state.darkKingHasShortCastlingRights;
        //     castlingRightsState.LQ = gameState.state.lightKingHasLongCastlingRights;
        //     castlingRightsState.LK = gameState.state.lightKingHasShortCastlingRights;
        }
    } else if (functions.isArgumentDictionary(gameState)) {
        // TODO FIX THIS, entire castlingRights section is done incorrectly 
        // gameState = (gameState as { [key: string]: any });
        if (requiredKeys.some(key => !(key in gameState))) return '';
        if (moreRequiredKeys.some(key => !(key in gameState))) {
            if ('castlingRights' in gameState) {
                if (moreRequiredKeys.some(key => !(key in (gameState.castlingRights as Record<string, boolean>)))) {
                    return '';
                } else {
                    // TODO refactor and fix this before using this with a dictionary arg (not full GameState)
                    const castlingRightsInput = (gameState.castlingRights as { [key: string]: any });
                    castlingRightsState.DQ = castlingRightsInput.darkKingHasLongCastlingRights;
                    castlingRightsState.DK = castlingRightsInput.darkKingHasShortCastlingRights;
                    castlingRightsState.LQ = castlingRightsInput.lightKingHasLongCastlingRights;
                    castlingRightsState.LK = castlingRightsInput.lightKingHasShortCastlingRights;
                }
            } else return '';
        }
        boardState = gameState.pieceKeys as string[]; // TODO validate these 
        whiteToPlay = gameState.whiteToPlay as boolean;
        halfmoveClock = gameState.halfmoveClock as number;
        fullmoveCounter = gameState.fullmoveCounter as number;
        enPassantTargetSquareId = gameState.enPassantTargetSquare as number;
    } else {
        console.error("Unsupported gameState argument supplied.");
        return '';
    }

    // lowercase is black, upper is white, standard piece keys for pieces, numbers for consecutive empty squares,
    // followed by next player's move, then castling rights still available, the en passant target square (if applicable),
    // and finally, the "half-move clock" and the full-move counter 
    // see: https://www.chessprogramming.org/Forsyth-Edwards_Notation for more info 

    // console.log(boardState);
    const piecePlacementWithSpaces = boardState.map((pieceKey, index) => {
        const [playerCode, pieceCode] = pieceKey.split('');
        const translator = playerCode === 'L' ? (x: string) => x.toUpperCase() : (playerCode === 'D' ? (x: string) => x.toLowerCase() : (x: string) => ' '); 
        const translated = translator(pieceCode);
        // if (index % 8 === 7) return `${translated}/`;
        // else return translated;
        return translated;
    });
    // console.log(piecePlacementWithSpaces);
    let consecutiveSpaces = 0;
    let newPiecePlacement = '';
    // for (const char in piecePlacement) {
    for (let i = 0; i < piecePlacementWithSpaces.length; i++) {
        const char = piecePlacementWithSpaces[i];
        if (i && i % 8 === 0) {
            if (consecutiveSpaces) {
                newPiecePlacement += `${consecutiveSpaces}`;
                consecutiveSpaces = 0;
            }
            newPiecePlacement += '/';
        }
        if (char === ' ') {
            consecutiveSpaces += 1;
        } else {
            if (consecutiveSpaces) {
                // piecePlacement.splice(i - consecutiveSpaces, consecutiveSpaces)
                newPiecePlacement += `${consecutiveSpaces}`;
            }
            newPiecePlacement += char;
            consecutiveSpaces = 0;
        }
    }
    // console.log(newPiecePlacement);

    const castlingRights = `${castlingRightsState.LK ? 'K' : ''}${castlingRightsState.LQ ? 'Q' : ''}${castlingRightsState.DK ? 'k' : ''}${castlingRightsState.DQ ? 'q' : ''}`;

    const enPassantTargetSquare = enPassantTargetSquareId ? `${'abcdefgh'.charAt(enPassantTargetSquareId % 8)}${8 - Math.floor(enPassantTargetSquareId / 8)}` : "-";

    const fullFEN = `${newPiecePlacement} ${whiteToPlay ? 'w' : 'b'} ${castlingRights} ${enPassantTargetSquare} ${halfmoveClock} ${fullmoveCounter}`;
    console.log(`Full FEN: ${fullFEN}`);

    return fullFEN;
}

// returns a list of *any* piece that can attack this square by default, not just the opponent's pieces 
// any piece can block identically to any other piece
// any capture is equivalently effective at removing a check 
// evading a check must be performed by the king with respect to the other pieces that really exist on the board (no imagination) 
// but these optional parameters would have to be passed down to the generate...LegalMoves methods as well 
// which in turn would have to get passed all the way down to the generatePieceValidMoveTargets method 
export const getOccupiedSquaresThatCanAttackThisSquare = (
    squareId: number,
    includeAttacksFrom: string[] = ['L','D'],
    boardState: string[],
): number[] => {

    let squaresTargetingThisOne: number[] = [];

    // Object.keys(this.validMoveMap).forEach(pieceKey => {
    //     // those nulls are now includeNonCaptures, and for pawns includeSelfCaptures is still there, removing now 
    //     this.validMoveMap[pieceKey](squareId, boardState, false, includeAttacksFrom) 
    //     // TODO remove squareToImagine{Empty,Friendly} vars ... DONE? 
    //         .filter(square => boardState[square].charAt(1) === pieceKey)
    //         .forEach(square => squaresTargetingThisOne.push(square));
    // });

    Object.keys(keycodeToComponent).forEach(keycode => {
        const keycodeMapKey = keycode as keyof typeof keycodeToComponent;
        keycodeToComponent[keycodeMapKey]
            .generatePieceValidMoveTargets(squareId, boardState, undefined, {
                includeNonCaptures: false, 
                includeCapturesOf: includeAttacksFrom,
            })
            .filter((square: number) => boardState[square] === keycode)
            .forEach((square: number) => squaresTargetingThisOne.push(square));
    });

    return squaresTargetingThisOne;
}

// // ********* SETTERS *********

//     // lightPawnPositions: [48, 49, 50, 51, 52, 53, 54, 55],
//     // darkPawnPositions: [8, 9, 10, 11, 12, 13, 14, 15],
//     // lightKnightPositions: [57, 62],
//     // darkKnightPositions: [1, 6],
//     // lightBishopPositions: [58, 61],
//     // darkBishopPositions: [2, 5],
//     // lightRooksPositions: [56, 63],
//     // darkRooksPositions: [0, 7],
//     // lightQueenPositions: [59],
//     // darkQueenPositions: [3],
//     // lightKingPosition: 60,
//     // darkKingPosition: 4,
function getStartingPiecePositionMaps(): { [player: string]: { [piece: string]: Set<number> }} { // number[] no 
// Map<string, Map<string, number[]>> {
    // const pieceMap: Map<string, Map<string, number[]>> = new Map();
    let pieceMap: { [player: string]: { [piece: string]: Set<number> }} = {};
    for (const player of constants.validPlayers) {
        // pieceMap.set(player, new Map());
        pieceMap[player] = { P: new Set<number>() };
        const indexQR = (player === 'D') ? 0 : 56;
        const indexQRP = (player === 'D') ? 8 : 48;
        // const op = (player === 'D') ? (a: number) => a++ : (a: number) => a--;
        // for (const piece of constants.defaultStartingBackRank) {
        for (let i = 0; i < constants.defaultStartingBackRank.length; i++) {
            const piece = constants.defaultStartingBackRank[i];
            if (!(piece in pieceMap[player])) {
                // if (piece === 'K') pieceMap[player][piece] = i + indexQR;
                pieceMap[player][piece] = new Set<number>([i + indexQR]);
            } else {
                pieceMap[player][piece].add(i + indexQR);
            }
            pieceMap[player]['P'].add(i + indexQRP);
        }
    }
    return pieceMap;
}


// // warning: numeric literals with absolute values equal to 2^53 or greater are too large to be represented accurately as integers.
// // append an `n` to use the BigInt javascript type 
// bitmapLightPawns: 0x000000000000ff00n, // 6th (7th) rank full of 1s
// bitmapDarkPawns: 0x00ff000000000000n, // 1st (2nd) rank full of 1s
// bitmapLightKnights: 0x0000000000000042n,
// bitmapDarkKnights: 0x2400000000000000n,
// bitmapLightBishops: 0x0000000000000024n,
// bitmapDarkBishops: 0x4200000000000000n,
// bitmapLightRooks: 0x0000000000000081n,
// bitmapDarkRooks: 0x1800000000000000n,
// bitmapLightQueens: 0x0000000000000010n,
// bitmapDarkQueens: 0x1000000000000000n,
// bitmapLightKing: 0x0000000000000008n,
// bitmapDarkKing: 0x0800000000000000n,
function getStartingPiecePositionBitmaps(): { [player: string]: { [piece: string]: bigint }} {
    // let pieceBitmap: { [player: string]: { [piece: string]: bigint }} = {};
    // return pieceBitmap;
    return constants.STARTING_BITMAPS;
}

// squaresAttackedByWhite: new Set(40, 41, 42, 43, 44, 45, 46, 47), 
// squaresAttackedByBlack: new Set(16, 17, 18, 19, 20, 21, 22, 23), 
// TODO also store squares that can be discover-attacked by a piece after moving another piece 

export function initializeState(component: React.Component<any, any>, stateToLoad?: GameState): void;
export function initializeState(component: React.Component<any, any>, stateToLoad?: string): void;
// export function initializeState(component: React.Component<any, any>, stateToLoad?: object): void;
export function initializeState(component: React.Component<any, any>, stateToLoad?: unknown): void {
// export const initializeState = (component: React.Component<GameProps, GameState>): void => {
    if (typeof stateToLoad === 'string') {
        // console.log(`Passed string stateToLoad: ${stateToLoad}`);
        if (doesStringMatchPatternFEN(stateToLoad)) {
            // wipe out existing state, if any (shouldn't be)
            component.setState({
                ...getNewBoardStateKVPsFromFen(stateToLoad),
            });
        } else {
            console.warn(`Passed an un-parsable string stateToLoad argument: ${stateToLoad}`)
        }
        return;
    }

    let startingConfig: string[] = Array(64).fill("");
    startingConfig.fill("DP", 8, 16);
    startingConfig.splice(0, 8, ...constants.defaultStartingBackRank.map((piece) => "D" + piece));

    startingConfig.fill("LP", 48, 56);
    startingConfig.splice(56, 8, ...constants.defaultStartingBackRank.map((piece) => "L" + piece));

    const newState: { [key: string]: any } = {
    // const newState: GameState = {
        pieceKeys: startingConfig,
        piecePositions: getStartingPiecePositionMaps(),
        pieceBitmaps: getStartingPiecePositionBitmaps(),
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
                isPromoting: false,
            }
        }),
        
        lightKingPosition: 60,
        darkKingPosition: 4,
        kingPositions: {
            'L': 60,
            'D': 4,
        },

        squaresAttackedByWhite: 0x0000000000ff0000n, // only sixth rank 
        squaresAttackedByBlack: 0x0000ff0000000000n, // only third rank

        // lightKingHasShortCastlingRights: true,
        // lightKingHasLongCastlingRights: true,
        // darkKingHasShortCastlingRights: true,
        // darkKingHasLongCastlingRights: true,
        castlingRights: {
            LK: true,
            LQ: true,
            DK: true,
            DQ: true,
        },

        enPassantTargetSquare: null,

        // squaresAttackedByWhite: new Set(40, 41, 42, 43, 44, 45, 46, 47), 
        // squaresAttackedByBlack: new Set(16, 17, 18, 19, 20, 21, 22, 23), 
        // TODO also store squares that can be discover-attacked by a piece after moving another piece 

        squareSelected: null,
        squareAltSelected: null,
        whiteToPlay: true,
        FEN: constants.defaultStartingFEN,
        history: [],
        plyNumber: 0,
        enableDragAndDrop: true,
        highlightLegalMoves: true,
        isBoardFlipped: false,
    }

    // wipe out existing state, if any (shouldn't be)
    component.setState({
        ...newState,
    });
}

// TODO (component: React.Component<P, S>, stateKey: string as keyof typeof P ??? , stateValue: any) 
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