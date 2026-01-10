import React from 'react';

import Game from '../components/Game.tsx';
// // import GameProps from '../components/Game.tsx';
// import GameState from '../components/Game.tsx';

import * as constants from './constants.ts';
import * as functions from './functions.ts';
import { GameState, KingPositions, Move, PlayerKey, PieceKey, RoyalKeycode, CastlingRights } from './types.ts';

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
    // ('whiteToPlay' + 'kingPositions') | kingPosition arg 
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

    // let kingPosition = currentGame.state.kingPositions[`${movePlayed.playerMoving}`];
    const opponent = currentGame.state.whiteToPlay ? 'D' : 'L';
    let kingPosition = currentGame.state.kingPositions[opponent];
    // using opponent's king position, but we just played the move... this never happens 

    if (isKingInCheck(
        kingPosition, 
        futureBoardState, 
        // this // this was like this... how was that working??
        currentGame // why is this passing something null? Either currentGame or currentGame.state is null... Hmm... 
    )) {
        isCheckOrCheckmateAN = '+';
        if (isKingCheckmated(futureBoardState)) isCheckOrCheckmateAN = '#';
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
export function getCastlingOptions(player: PlayerKey, { castlingRights, boardState }: { castlingRights: CastlingRights, boardState: string[] }): number[];
export function getCastlingOptions(player: PlayerKey, currentGame: GameState): number[];
export function getCastlingOptions(player: PlayerKey, currentGame: Game): number[];
export function getCastlingOptions(player: PlayerKey, currentGame: unknown): number[] {
    let castlingOptions: number[] = [];

    if (!(currentGame instanceof Game)) return []; // TODO implement 

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
            if (!qsCastlingRights) {
                return;
            }

            castlingSliceStart = rookStartingSquare + 1;
            castlingSliceEnd = kingStartingSquare;

            castlingSafetySquares = player === 'L' ? [60, 59, 58] : [4, 3, 2];
        } else if (squaresBetween === 3) {
            // short castling (ks) 
            const ksCastlingRights: boolean = currentGame.state.castlingRights![`${player}K`];
            if (!ksCastlingRights) {
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
            return;
        }

        const theirPiecesAreBlockingCastling = castlingSafetySquares
            .some(castlingSafetySquare => getOccupiedSquaresThatCanAttackThisSquare(
                castlingSafetySquare,
                constants.validPlayers.filter(validPlayer => validPlayer !== player),
                currentGame.state.pieceKeys,
            ).length > 0);
        if (theirPiecesAreBlockingCastling) {
            return;
        }

        castlingOptions.push(rookStartingSquare);
    })
    
    return castlingOptions;
}

export function isStalemate(state: unknown): boolean {
    // TODO implement 
    return false;
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
            currentGame!.state.kingPositions.D :
            currentGame!.state.kingPositions.L
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

    // this method does *NOT* filter for pieces that are pinned. A pin does not absolve a check. 
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

// this move also called from generateMoveAN, similar to isKingInCheck, so NOTE: it is still the opponent's turn, state has not been updated 
// although both locations that call isKingInCheck (generateMoveAN and wouldKingBeInCheckAfterMove) supply a kingPositionArg and future boardStateArg ... 
// we might need to do that here too, or update state differently so we call this method *after* udpating state... 
// also note that the only *critical* argument for this method is boardState/pieceKeys, we can figure out everything else relevant from that 
// so that's what we'll do just to start, require the basic info and figure everything else out 
// we're gonna overload this method anyway later on, so it's an interesting exercise 
export function isKingCheckmated(boardState: string[]): boolean {
    // is in check 
    // can't capture/block (if single check) 
    // can't evade 
    // remember: two filters with one boolean is ~as fast~ as one filter with two booleans ... 
    const kingPositions: KingPositions = {
        L: boardState.indexOf('LK'),
        D: boardState.indexOf('DK'),
    }
    // in this minimal-info approach, we don't even know which side we're checking for checkmate for
    // supplied state will be able to speed this up *a lot* (kingPosition, whiteToPlay, squaresAttackedByBlack, etc...
    // maybe even a state map of pieces in "contact" - attacking and attackedBy graph/bi-directional map) 
    let isKingCheckmated = false;
    Object.entries(kingPositions).forEach(([player, kingPosition]) => {
        // this method does *NOT* filter for pieces that are pinned. A pin does not absolve a check. 
        const piecesTargeting = getOccupiedSquaresThatCanAttackThisSquare(kingPosition, (player === 'L') ? ['D'] : ['L'], boardState);
        if (piecesTargeting.length === 0) {
            return;
        }

        let canBlockOrCapture, canEvade = true;
        if (piecesTargeting.length === 1) {
            // check if we can capture or block 
            const squareIdOfAttackingPiece = piecesTargeting[0];
            const attackingPiece = boardState[squareIdOfAttackingPiece].charAt(1);
            if (attackingPiece === 'N') {
                // just check if we can capture it, don't build a line between it and king 
                // canBlock = false;
                const capturePossibilities = getOccupiedSquaresThatCanAttackThisSquare(squareIdOfAttackingPiece, [player], boardState);
                const realCaptureOptions = capturePossibilities.filter(possibilitySquareId => {
                    const possibleMove: Move = {
                        squareMovedFrom: possibilitySquareId,
                        squareMovedTo: squareIdOfAttackingPiece,
                        pieceMoving: boardState[possibilitySquareId].charAt(1) as PieceKey,
                        playerMoving: player as PlayerKey,
                        // promotingTo: undefined, // not relevant for capturing to get out of a checkmate 
                    }
                    return !wouldOwnKingBeInCheckAfterMove(possibleMove, boardState);
                });
                if (realCaptureOptions.length === 0) {
                    // console.log("Unable to capture the checking knight.");
                    canBlockOrCapture = false;
                }
            } else {
                // construct the path between the attacker and this king... hmm that's kinda an interesting problem, it's like a search
                // but we do have the starting coordinates, we can at least narrow our search down into a single "quadrant" 
                // actually we can do better than a quadrant, it's either vertical, diagonal, or a single un-blockable knight move 
                const orientationOfKingFromAttacker = [0, 0]; 
                const boardNavigationCoefficient = [1, 8]; // [x, y]
                // [x, y] search direction: -1, 0, 1 to indicate rook style move, or either a bishop style move direction OR quadrant of attacking knight 
                // use rankDiff and fileDiff to determine if it's a diagonal bishop move or a knight quadrant 
                // just realized that last part is not necessary, we can tell what piece is attacking by checking boardState ... face palm smh 
                // and if it's a knight, it can't be blocked, so only check if we can capture it 
                const kingRank = Math.floor(kingPosition / 8);
                const kingFile = kingPosition % 8;
                const attackerRank = Math.floor(squareIdOfAttackingPiece / 8);
                const attackerFile = squareIdOfAttackingPiece % 8;
                if (kingRank > attackerRank) orientationOfKingFromAttacker[1] = 1;
                else if (kingRank < attackerRank) orientationOfKingFromAttacker[1] = -1;
                if (kingFile > attackerFile) orientationOfKingFromAttacker[0] = 1;
                else if (kingFile < attackerFile) orientationOfKingFromAttacker[0] = -1;
    
                // below not necessary, we check for the knight case above, then below we don't have to differentiate between different straight-line styles 
                // if (orientationOfKingFromAttacker.every(direction => direction !== 0)) {
                //     // it is either a bishop-style attack or a knight attack 
                //     // const rankDiff = kingRank - attackerRank;
                //     // const fileDiff = kingFile - attackerFile;
                //     // if (rankDiff !== fileDiff) {
                //     //     // knight attack 
                //     // } else {
                //     //     // bishop-style attack 
                //     // }
                //     const attackingPiece = boardState[squareIdOfAttackingPiece].charAt(1);
                //     if (attackingPiece === 'N') {
                //         // knight attack
                        
                //     } else {
                //         // bishop-style attack (queen, bishop, or pawn) 
                //     }
                // } else {
                //     // it is a rook-style attack (queen or rook)
                // }

                const boardStep = functions
                    .zip(orientationOfKingFromAttacker, boardNavigationCoefficient)
                    .map(([direction, coefficient]) => direction * coefficient)
                    .reduce((accumulator, vector) => accumulator + vector);
                let foundCaptureOrBlock = false;
                for (let squareIdToCheck = squareIdOfAttackingPiece; squareIdToCheck !== kingPosition; squareIdToCheck += boardStep) {
                    if (squareIdOfAttackingPiece < 0 || squareIdToCheck >= 64) {
                        throw Error("Something went wrong with my math.")
                    }

                    const captureOrBlockPossibilities = getOccupiedSquaresThatCanAttackThisSquare(squareIdToCheck, [player], boardState);
                    const realCaptureOrBlockOptions = captureOrBlockPossibilities.filter(possibilitySquareId => {
                        const possibleMove: Move = {
                            squareMovedFrom: possibilitySquareId,
                            squareMovedTo: squareIdToCheck,
                            pieceMoving: boardState[possibilitySquareId].charAt(1) as PieceKey,
                            playerMoving: player as PlayerKey,
                            // promotingTo: undefined, // not relevant for capturing or blocking to get out of a checkmate 
                        }
                        return !wouldOwnKingBeInCheckAfterMove(possibleMove, boardState);
                    });
                    if (realCaptureOrBlockOptions.length !== 0) {
                        foundCaptureOrBlock = true;
                        // console.log(`Found at least one way to capture or block the check: ${realCaptureOrBlockOptions}`);
                        break;
                    }
                }
                canBlockOrCapture = foundCaptureOrBlock;
            }
        } else {
            // then there must be two attackers, blocking and capturing in the same move is impossible. must try to evade 
            canBlockOrCapture = false;
        }
        // if we can't capture or block, then check if we can evade (whether it's 1 attacker or 2)
        if (canBlockOrCapture) return;

        // could import from King but I don't feel like it 
        const kingDirections = [-9, -8, -7, -1, 1, 7, 8, 9];
        const legalEvasionSquares = kingDirections
            .map(direction => direction + kingPosition)
            .filter(newKingPosition => newKingPosition >= 0 && newKingPosition < 64)
            .filter(newKingPosition => boardState[newKingPosition] === '' || boardState[newKingPosition].charAt(0) !== player)
            .filter(newKingPosition => {
                const possibleMove: Move = {
                    squareMovedFrom: kingPosition,
                    squareMovedTo: newKingPosition,
                    pieceMoving: 'K',
                    playerMoving: player as PlayerKey,
                }
                return !wouldOwnKingBeInCheckAfterMove(possibleMove, boardState);
            });
        if (legalEvasionSquares.length === 0) {
            // console.log(`Found at least one way to evade the check: ${legalEvasionSquares}`);
            canEvade = false;
        }

        // if we can neither capture, block, nor evade, it is checkmate 
        // don't overwrite it if we already found a checkmate ... this forEach approach isn't the most efficient 
        isKingCheckmated = isKingCheckmated || (!canBlockOrCapture && !canEvade);
    })
    return isKingCheckmated;
}

export function wouldOwnKingBeInCheckAfterMove(movePlayed: Move, currentGame: string[]): boolean;
export function wouldOwnKingBeInCheckAfterMove(movePlayed: Move, currentGame: Game): boolean;
// export function wouldOwnKingBeInCheckAfterMove(movePlayed: Move, currentGame: GameState): boolean;
export function wouldOwnKingBeInCheckAfterMove(movePlayed: Move, currentGame: unknown): boolean {

    const { squareMovedFrom, squareMovedTo, pieceMoving, playerMoving } = movePlayed;
    let boardState, ownKingPosition;

    if (!currentGame) {
        // impossible with type checking 
        throw Error("Must supply currentGame argument.");
    } else {
        // the function parameterization is not necessary, but interests me 
        if (Array.isArray(currentGame) && functions.isArgumentArrayOfType<string>(currentGame, 'string')) { 
            boardState = currentGame;
            ownKingPosition = currentGame.indexOf(`${playerMoving}K`);
        } else if (currentGame instanceof Game) {
            boardState = currentGame.state.pieceKeys;
            ownKingPosition = currentGame.state.kingPositions[playerMoving as PlayerKey]
        } else if (
            typeof currentGame === 'object' && 
            'state' in currentGame && 
            currentGame.state &&
            typeof currentGame.state === 'object' &&
            'pieceKeys' in currentGame.state &&
            currentGame.state.pieceKeys
        ) {
            boardState = currentGame.state.pieceKeys as string[]; // TODO validate, add more safeguards 
            if ('kingPositions' in currentGame.state && typeof currentGame.state.kingPositions === 'object') {
                ownKingPosition = (currentGame.state.kingPositions as KingPositions)[playerMoving]
            } else {
                ownKingPosition = boardState.indexOf(`${playerMoving}K`);
            }
        } else {
            throw Error("Invalid argument type for currentGame: " + typeof currentGame);
        }
    }

    const futureState = getNewPieceKeysCopyWithMoveApplied(boardState, movePlayed);
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

    return isKingInCheck(ownKingPosition, futureState); 
}

export function getNewPieceKeysCopyWithMoveApplied(boardState: string[], movePlayed: Move): string[];
export function getNewPieceKeysCopyWithMoveApplied(component: React.Component<any, any>, movePlayed: Move): string[];
export function getNewPieceKeysCopyWithMoveApplied(componentState: GameState, movePlayed: Move): string[];
export function getNewPieceKeysCopyWithMoveApplied(state: unknown, movePlayed: Move): string[] {
    const { squareMovedFrom, squareMovedTo, pieceMoving, playerMoving } = movePlayed;
    let currentBoardState: string[] | null = null;
    if (functions.isArgumentStringArray(state)) { 
        currentBoardState = state as string[]; 
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
        // TODO state could also be GameState 
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

    return newPieceKeys; 
    // {squareIdOfPawnCapturedViaEnPassant, squareIdOfKingAfterCastling, squareIdOfRookAfterCastling};
}


export function getNewStateAfterMoveIsApplied(currentState: object, moveToApply: Move): object {
    // TODO implement 
    return currentState;
}

export function doesStringMatchPatternFEN(input: string): boolean {
    const matcher = constants.googleGeminiMatcher;
    return input.match(matcher) !== null;
}

export function getNewBoardStateKVPsFromFen(inputFEN: string): { [key: string]: any } { // { [key in GameState]: any } {
    // const [piecePlacement, sideToMove, castlingAbility, enPassantTargetSquare, halfmoveClock, fullmoveCounter] = inputFEN.split(' ');
    const FENComponents = inputFEN.match(constants.googleGeminiMatcher);
    if (!FENComponents) {
        throw Error("Invalid FEN provided.");
        // return {};
    }
    const [
        fullMatch, 
        piecePlacement, 
        sideToMove, 
        castlingAbility, 
        enPassantTargetSquare, 
        halfmoveClock, 
        fullmoveCounter
    ] = FENComponents;

    // about halfmoveClock and fullmoveCounter:
    // The halfmove clock specifies a decimal number of half moves with respect to the 50 move draw rule.
    //   It is reset to zero after a capture or a pawn move and incremented otherwise.
    // The fullmoveCounter is the  number of the full moves in a game. 
    //   It starts at 1, and is incremented after each Black's move.
    const rankPiecePlacements = piecePlacement.split('/');

    let newPieceKeys = Array(64).fill("");
    let newKingPositions: Partial<KingPositions> = {};

    let pki = 0;
    for (const rank of rankPiecePlacements) { 
        let squaresOnThisRank = 0
        for (const char of rank) {
            if (char.match(/[1-8]/)) {
                let numEmptySquares = Number(char);
                pki += numEmptySquares;
                squaresOnThisRank += numEmptySquares;
            } else {
                const pieceCode = char.toUpperCase();
                const playerCode = (char === pieceCode) ? 'L' : 'D';
                newPieceKeys[pki] = `${playerCode}${pieceCode}`;
                if (pieceCode === 'K') {
                    newKingPositions[playerCode] = pki;
                }
                pki += 1;
                squaresOnThisRank += 1;
            }
        }
        if (squaresOnThisRank !== 8) { // TODO boardSize prop/state? 
            throw Error("Invalid FEN provided.", { cause: `Rank: ${rank}: Contains an invalid number of characters.` });
        }
    }

    // TODO make this the correct type 
    const newStateKVPs: Partial<GameState> = {
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
        // kingPositions: {
        //     'L': newLightKingPosition,
        //     'D': newDarkKingPosition,
        // },
        kingPositions: newKingPositions as KingPositions, 
        // piecePositions: {}, // TODO fill out all piece positions from FEN input 
        whiteToPlay: sideToMove === 'w',
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
        squareSelectedLegalMoves: undefined,
        squareAltSelected: null,
    }

    return newStateKVPs;
}

export function generateFENFromGameState(gameState: GameState): string;
export function generateFENFromGameState(gameState: { [key: string]: any }): string;
export function generateFENFromGameState(gameState: {
    pieceKeys: string[],
    whiteToPlay: boolean,
    castlingRights: CastlingRights,
    enPassantTargetSquare: number,
    halfmoveClock: number,
    // fullmoveCounter: number, // or plyNumber 
}): string;
export function generateFENFromGameState(gameState: unknown): string {

    const requiredKeys: string[] = ['pieceKeys','whiteToPlay','enPassantTargetSquare','halfmoveClock','castlingRights']; // 'fullmoveCounter'

    if (!gameState || typeof gameState !== 'object') {
        console.warn(`Invalid gameState input provided.`)
        return '';
    }

    if (requiredKeys.some(key => !(key in gameState))) {
        console.warn("Unsupported gameState argument supplied.");
        return '';
    }

    if (!functions.doesArgumentDictionaryContainKeys(gameState, requiredKeys)) {
        console.warn(`Insufficient gameState information provided.`)
        return '';
    }

    const {
        pieceKeys: boardState, 
        whiteToPlay, 
        enPassantTargetSquare: enPassantTargetSquareId, 
        halfmoveClock, 
        castlingRights: castlingRightsState 
    } = gameState as Partial<GameState>;

    if (!boardState || whiteToPlay === undefined || whiteToPlay === null || halfmoveClock === undefined || !castlingRightsState) {
        console.warn(`Some required gameState information was null/undefined: ${[boardState, whiteToPlay, enPassantTargetSquareId, halfmoveClock, castlingRightsState]}`)
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
    const fullmoveCounter = 'fullmoveCounter' in gameState ? gameState.fullmoveCounter : 'plyNumber' in gameState ? Math.floor(gameState.plyNumber as number / 2) : '?';

    const fullFEN = `${newPiecePlacement} ${whiteToPlay ? 'w' : 'b'} ${castlingRights} ${enPassantTargetSquare} ${halfmoveClock} ${fullmoveCounter}`;
    // console.log(`Full FEN: ${fullFEN}`);

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
        
        kingPositions: {
            'L': 60,
            'D': 4,
        },

        squaresAttackedByWhite: 0x0000000000ff0000n, // only sixth rank 
        squaresAttackedByBlack: 0x0000ff0000000000n, // only third rank

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
        squareSelectedLegalMoves: undefined,
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