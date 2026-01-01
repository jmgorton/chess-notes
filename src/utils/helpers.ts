import React, { isValidElement } from 'react';

import Game from '../components/Game.tsx';
import GameProps from '../components/Game.tsx';
import GameState from '../components/Game.tsx';

import * as constants from './constants.ts';

import { keycodeToComponent } from '../components/Piece.tsx';

// // ********* GETTERS *********
// // ***** and generators *****

// this method is called before this move is applied to state, still current player's turn 
// boardState, whiteToPlay, kingPositions, this.wouldOwnKingBeInCheckAfterMove
export const generateMoveAN = (squareMovedFrom: number, squareMovedTo: number, currentGame?: Game): string => { // , futureBoardState = this.state.pieceKeys) => {
    if (!currentGame) {
        throw Error("Not implemented (yet)");
    }
    const currentBoardState = currentGame.state.pieceKeys.slice();
    const futureBoardState = getNewPieceKeysCopyWithMoveApplied(currentBoardState, squareMovedFrom, squareMovedTo);

    let [playerCode, pieceCode] = currentBoardState[squareMovedFrom].split(''); // [null, null]; // futureBoardState[squareMovedTo].split('');
    // if (playerCode === null && pieceCode === null) { // null !== undefined ... SMH 
    //     // this shouldn't happen, remnant of previous approach 
    //     [playerCode, pieceCode] = futureBoardState[squareMovedTo].split('');
    // }

    if (isMoveCastling(squareMovedFrom, squareMovedTo, currentBoardState)) { 
        const isShortCastling: boolean = Math.abs(squareMovedFrom - squareMovedTo) === 3;
        return isShortCastling ? 'O-O' : 'O-O-O'; 
    }

    let pieceAN, clarifierAN, isCaptureAN, destFileAN, destRankAN, promotionAN, isCheckOrCheckmateAN = '';

    let kingPosition = currentGame.state.whiteToPlay ? 
        currentGame.state.darkKingPosition : 
        currentGame.state.lightKingPosition;
    if (kingPosition === squareMovedFrom) kingPosition = squareMovedTo;

    if (isKingInCheck(
        kingPosition, 
        futureBoardState, 
        this
    )) {
        // if (this.isCheckmate()) isCheckOrCheckmateAN = '#';
        isCheckOrCheckmateAN = '+';
    }
    
    // TODO implement 
    // const isPawnPromotion = '=[Q,R,B,N]'; 

    // remember that our 0-63 is kind of backwards, and 0-indexed 
    destRankAN = 8 - Math.floor(squareMovedTo / 8); 
    destFileAN = 'abcdefgh'.charAt(squareMovedTo % 8);

    if (
        currentBoardState[squareMovedTo] !== '' ||
        isMoveEnPassant(squareMovedFrom, squareMovedTo, currentBoardState)
    ) {
        isCaptureAN = 'x';
    }

    if (pieceCode === 'P') {
        if (isCaptureAN === 'x') clarifierAN = 'abcdefgh'.charAt(squareMovedFrom % 8);
    } else {
        pieceAN = pieceCode;
        const movesThatNecessitateFurtherClarification = getOccupiedSquaresThatCanAttackThisSquare(squareMovedTo, [playerCode], futureBoardState)
            .filter((squareId) => futureBoardState[squareId].charAt(1) === pieceCode) // get only self-attacks from the same type of piece 
            // .filter((squareId) => squareId !== squareMovedFrom); // state issue TODO fix ... including this piece 
            .filter(squareId => !wouldOwnKingBeInCheckAfterMove(squareId, squareMovedTo, currentGame)) // don't allow illegal moves ... use current state, not future 

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
            else if (dupeSourceRanks) clarifierAN = `${sourceFile}`;
        }
    }

    return [pieceAN, clarifierAN, isCaptureAN, destFileAN, destRankAN, promotionAN, isCheckOrCheckmateAN].join('');
}

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
// TODO rename function to wouldMoveBeEnPassant ??? 
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

// export function getCastlingOptions(player: string, castlingRights: {}, boardState: string[]): number[] {
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
                .slice(castlingSliceStart, castlingSliceEnd)
                .some(pieceKey => pieceKey !== '') || true;
            if (ourPiecesAreBlockingCastling) return;

            const theirPiecesAreBlockingCastling = castlingSafetySquares
                .some(castlingSafetySquare => getOccupiedSquaresThatCanAttackThisSquare(
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
        attackingSquares = getOccupiedSquaresThatCanAttackThisSquare(
            kingPosition, 
            attackers,
            boardState,
        );
    } else {
        // console.error("Not implemented. Must pass currentGame argument for now.");
        // throw Error("Not implemented yet.");
        attackingSquares = getOccupiedSquaresThatCanAttackThisSquare(
            kingPosition,
            attackers,
            boardState,
        );
    }

    // console.log(`Squares attacking our ${defender}K on ${kingPosition}: ${attackingSquares}`);

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

export function wouldOwnKingBeInCheckAfterMove(squareMovedFrom: number, squareMovedTo: number, currentGame?: Game): boolean {
    if (!currentGame) {
        // TODO handle kingPosition and boardState if currentGame is undefined 
        throw Error("Must supply currentGame arg (for now)...");
    }
    let ownKingPosition = currentGame.state.whiteToPlay ? currentGame.state.lightKingPosition : currentGame.state.darkKingPosition;
    if (ownKingPosition === squareMovedFrom) ownKingPosition = squareMovedTo;

    const futureState = getNewPieceKeysCopyWithMoveApplied(currentGame.state.pieceKeys, squareMovedFrom, squareMovedTo);
    return isKingInCheck(ownKingPosition, futureState); // , this);
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

export function doesStringMatchPatternFEN(input: string): boolean {
    // const matcher: RegExp = /^.*$/;
    const matcher = constants.googleGeminiMatcher;
    return input.match(matcher) !== null;
}

// takes a FEN string and sets the Game state accordingly, also returning new state 
// generateBoardStateFromFen = async (inputFEN: string): Promise<void> => { // { [key: string]: any } => {
export function getNewBoardStateKVPsFromFen(inputFEN: string): { [key: string]: any } {
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

    const newStateKVPs = {
        pieceKeys: newPieceKeys,
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
        whiteToPlay: sideToMove === 'w',
        darkKingHasShortCastlingRights: castlingAbility.includes('k'),
        darkKingHasLongCastlingRights: castlingAbility.includes('q'),
        lightKingHasShortCastlingRights: castlingAbility.includes('K'),
        lightKingHasLongCastlingRights: castlingAbility.includes('Q'),
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

// returns a list of *any* piece that can attack this square by default, not just the opponent's pieces 
// any piece can block identically to any other piece
// any capture is equivalently effective at removing a check 
// evading a check must be performed by the king with respect to the other pieces that really exist on the board (no imagination) 
// but these optional parameters would have to be passed down to the generate...LegalMoves methods as well 
// which in turn would have to get passed all the way down to the generatePieceValidMoves method 
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
            .generatePieceValidMoves(squareId, boardState, undefined, {
                includeNonCaptures: false, 
                includeCapturesOf: includeAttacksFrom,
            })
            .filter((square: number) => boardState[square] === keycode)
            .forEach((square: number) => squaresTargetingThisOne.push(square));
    });

    return squaresTargetingThisOne;
}

// // ********* SETTERS *********

export const initializeState = (component: React.Component<any, any>, stateToLoad?: unknown): void => {
// export const initializeState = (component: React.Component<GameProps, GameState>): void => {
    if (typeof stateToLoad === 'string') {
        console.log(`Passed string stateToLoad: ${stateToLoad}`);
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
                isPromoting: false,
            }
        }),

        // // TODO not yet maintained (except for light/dark king positions) 
        // lightPawnPositions: [48, 49, 50, 51, 52, 53, 54, 55],
        // darkPawnPositions: [8, 9, 10, 11, 12, 13, 14, 15],
        // lightKnightPositions: [57, 62],
        // darkKnightPositions: [1, 6],
        // lightBishopPositions: [58, 61],
        // darkBishopPositions: [2, 5],
        // lightRooksPositions: [56, 63],
        // darkRooksPositions: [0, 7],
        // lightQueenPositions: [59],
        // darkQueenPositions: [3],
        
        lightKingPosition: 60,
        darkKingPosition: 4,
        // kingPositions: {
        //     L: 60,
        //     D: 4,
        // },

        lightKingHasShortCastlingRights: true,
        lightKingHasLongCastlingRights: true,
        darkKingHasShortCastlingRights: true,
        darkKingHasLongCastlingRights: true,
        // castlingRights: {
        //     LK: true,
        //     LQ: true,
        //     DK: true,
        //     DQ: true,
        // },

        enPassantTargetSquare: null,

        // // TODO not yet used or maintained 
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

        // squaresAttackedByWhite: new Set(40, 41, 42, 43, 44, 45, 46, 47), 
        // squaresAttackedByBlack: new Set(16, 17, 18, 19, 20, 21, 22, 23), 
        // TODO also store squares that can be discover-attacked by a piece after moving another piece 

        squareSelected: null,
        squareAltSelected: null,
        whiteToPlay: true,
        FEN: constants.defaultStartingFEN,
        history: [],
        plyNumber: 0,
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