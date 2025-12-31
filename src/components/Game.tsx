import React from 'react';

import GameStatus from './GameStatus.jsx';
import { GameNotes } from './GameNotes';
import Board from './Board.jsx';

// import Piece, { keycodeToComponent } from './Piece.tsx';
import { keycodeToComponent } from './Piece.tsx';
import {
    // King, 
    LightKing, 
    DarkKing
 } from './Piece.tsx';
// import { multiUpdateState, updateState } from '../utils/helpers.ts';
import * as helpers from '../utils/helpers.ts';
import * as constants from '../utils/constants.ts';

// Type definitions
type GameProps = Record<string, unknown>;

// TODO refactor this, keep e.g. highlightedSquares, etc. at the top-level Game state 
// id not necessary (squareId)
// keycode not necessary, use pieceKeys or similar 
interface SquareProp {
    keycode: string;
    id: number;
    isHighlighted: boolean;
    isAltHighlighted: boolean;
    isSelected: boolean;
    isAltSelected: boolean;
    isPromoting: boolean;
}

interface HistoryItem {
    pieceKeys: string[];
    AN: string | null;
    JN: string | null;
    INN: string | null;
}

interface GameState {
    pieceKeys: string[];
    squareProps: SquareProp[];
    lightKingPosition: number;
    darkKingPosition: number;
    lightKingHasShortCastlingRights: boolean;
    lightKingHasLongCastlingRights: boolean;
    darkKingHasShortCastlingRights: boolean;
    darkKingHasLongCastlingRights: boolean;
    enPassantTargetSquare: number | null;
    squareSelected: number | null;
    squareAltSelected: number | null;
    whiteToPlay: boolean;
    FEN: string;
    history: HistoryItem[];
    plyNumber: number;
    //   testState: number;
}

export default class Game extends React.Component<GameProps, GameState> {
    backrankStartingPositions: string[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']; // can make chess960 later 
    boardSize: number = this.backrankStartingPositions.length;
    numSquares: number = this.boardSize ** 2;
    startingFEN: string = 'r1b1kb1r/pp2pppp/2n2n2/1Bpq4/5P2/5N2/PPPP2PP/RNBQK2R w KQkq - 0 1'; // null 

    // state = {
    //     pieceKeys = null,
    //     squareProps = null,
    //     lightKingPosition = null,
    //     darkKingPosition = null;
    //     lightKingHasShortCastlingRights = null,
    //     lightKingHasLongCastlingRights = null,
    //     darkKingHasShortCastlingRights = null,
    //     darkKingHasLongCastlingRights = null,
    //     enPassantTargetSquare = null,
    //     squareSelected = null,
    //     squareAltSelected = null,
    //     whiteToPlay = null,
    //     FEN = null,
    //     history = null,
    //     plyNumber = null,
    // };

    constructor(props: GameProps) {
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

            lightKingHasShortCastlingRights: true,
            lightKingHasLongCastlingRights: true,
            darkKingHasShortCastlingRights: true,
            darkKingHasLongCastlingRights: true,

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
            FEN: constants.defaultStartingFEN,
            history: [],
            // history: [{
            //   pieceKeys: startingConfig, // full state of keycodes on board at this move // don't store the initial state 
            //   AN: null, // Algebraic Notation
            //   JN: null, // Jared's Notation
            //   INN: null, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
            // }],
            plyNumber: 0,

            //   testState: 0,
        }

        // not necessary? was working without this 
        this.handleSquareClick = this.handleSquareClick.bind(this);
        this.handleSquareRightClick = this.handleSquareRightClick.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);

        // if (this.startingFEN) {
        //     this.generateBoardStateFromFen(this.startingFEN); // const newStateKVPs = 
        //     // this.setState({
        //     //     ...this.state,
        //     //     ...newStateKVPs,
        //     // });

        //     // return;
        // }
    }

    generateBoardFEN = (event?: React.SyntheticEvent | null, boardState: string[] = this.state.pieceKeys): string => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();

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

        const castlingRights = `${this.state.lightKingHasShortCastlingRights ? 'K' : ''}${this.state.lightKingHasLongCastlingRights ? 'Q' : ''}${this.state.darkKingHasShortCastlingRights ? 'k' : ''}${this.state.darkKingHasLongCastlingRights ? 'q' : ''}`;
        const enPassantTargetSquare = "-";
        // TODO use history or smth to find enPassantTargetSquare ... or use this.state.enPassantTargetSquare 

        const fullFEN = `${newPiecePlacement} ${this.state.whiteToPlay ? 'w' : 'b'} ${castlingRights} ${enPassantTargetSquare} ${this.state.plyNumber % 2} ${Math.floor(this.state.plyNumber / 2) + 1}`;
        console.log(`Full FEN: ${fullFEN}`);

        return fullFEN;
    }

    // takes a FEN string and sets the Game state accordingly, also returning new state 
    // generateBoardStateFromFen = async (inputFEN: string): Promise<void> => { // { [key: string]: any } => {
    generateBoardStateFromFen = (inputFEN: string): void => {
        const [piecePlacement, sideToMove, castlingAbility, enPassantTargetSquare, halfmoveClock, fullmoveCounter] = inputFEN.split(' ');
        const rankPiecePlacements = piecePlacement.split('/');

        let newPieceKeys = Array(64).fill("");
        let newLightKingPosition = null;
        let newDarkKingPosition = null;
        // TODO this is wrong, rankPiecePlacements is an array of strings mapping to each rank 
        // for (let i = 0, pki = 0; i < rankPiecePlacements.length; i++) {
        //   const numEmptySquares = rankPiecePlacements
        // }
        let pki = 0;
        for (const rank in rankPiecePlacements) {
            //   for (const char in rank) {
            for (let i: number = 0; i < rank.length; i++) {
                const char = rank.charAt(i);
                // if (char.isNumeric()) {
                if (char.match(/[1-8]/)) {
                    let numEmptySquares = Number(char);
                    pki += numEmptySquares;
                } else {
                    const pieceCode = char.toUpperCase();
                    const playerCode = char === pieceCode ? 'L' : 'D';
                    newPieceKeys[pki] = `${playerCode}${pieceCode}`;
                    if (pieceCode === 'K') {
                        if (playerCode === 'L') newLightKingPosition = pki;
                        else newDarkKingPosition = pki;
                    }
                    pki += 1;
                }
            }
        }

        // this.state.whiteToPlay = sideToMove === 'w'; // otherwise 'b' 
        // this.state.darkKingHasLongCastlingRights = castlingAbility.includes('q');
        // this.state.darkKingHasShortCastlingRights = castlingAbility.includes('k');
        // this.state.lightKingHasLongCastlingRights = castlingAbility.includes('Q');
        // this.state.lightKingHasShortCastlingRights = castlingAbility.includes('K');
        // this.state.enPassantTargetSquare = enPassantTargetSquare;
        // this.state.plyNumber = fullmoveCounter * 2 + halfmoveClock;
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
            enPassantTargetSquare: Number(enPassantTargetSquare),
            plyNumber: Number(fullmoveCounter) * 2 + Number(halfmoveClock),
            FEN: inputFEN,
            history: [], // no history from loading game from FEN 
            squareSelected: null,
            squareAltSelected: null,
        }
        this.setState({
          ...this.state,
          ...newStateKVPs,
        });
        // await multiUpdateState(this, newStateKVPs);
        // return newStateKVPs;
        return;
    }

    // this method is called before this move is applied to state, still current player's turn 
    generateMoveAN = (squareMovedFrom: number, squareMovedTo: number): string => { // , futureBoardState = this.state.pieceKeys) => {
        const currentBoardState = this.state.pieceKeys.slice();
        const futureBoardState = helpers.getNewPieceKeysCopyWithMoveApplied(currentBoardState, squareMovedFrom, squareMovedTo);

        let [playerCode, pieceCode] = currentBoardState[squareMovedFrom].split(''); // [null, null]; // futureBoardState[squareMovedTo].split('');
        // if (playerCode === null && pieceCode === null) { // null !== undefined ... SMH 
        //     // this shouldn't happen, remnant of previous approach 
        //     [playerCode, pieceCode] = futureBoardState[squareMovedTo].split('');
        // }

        let pieceAN, clarifierAN, isCaptureAN, destFileAN, destRankAN, promotionAN, isCheckOrCheckmateAN = '';

        let kingPosition = this.state.whiteToPlay ? 
            this.state.darkKingPosition : 
            this.state.lightKingPosition;
        if (kingPosition === squareMovedFrom) kingPosition = squareMovedTo;

        if (helpers.isKingInCheck(
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
            helpers.isMoveEnPassant(squareMovedFrom, squareMovedTo, currentBoardState)
        ) {
            isCaptureAN = 'x';
        }

        if (pieceCode === 'P') {
            if (isCaptureAN === 'x') clarifierAN = 'abcdefgh'.charAt(squareMovedFrom % 8);
        } else {
            pieceAN = pieceCode;
            const movesThatNecessitateFurtherClarification = this.getOccupiedSquaresThatCanAttackThisSquare(squareMovedTo, [playerCode], futureBoardState)
                .filter((squareId) => futureBoardState[squareId].charAt(1) === pieceCode) // get only self-attacks from the same type of piece 
                // .filter((squareId) => squareId !== squareMovedFrom); // state issue TODO fix ... including this piece 
                .filter(squareId => !this.wouldOwnKingBeInCheckAfterMove(squareId, squareMovedTo)) // don't allow illegal moves ... use current state, not future 

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

    // returns a list of *any* piece that can attack this square by default, not just the opponent's pieces 
    // any piece can block identically to any other piece
    // any capture is equivalently effective at removing a check 
    // evading a check must be performed by the king with respect to the other pieces that really exist on the board (no imagination) 
    // but these optional parameters would have to be passed down to the generate...LegalMoves methods as well 
    // which in turn would have to get passed all the way down to the generatePieceValidMoves method 
    getOccupiedSquaresThatCanAttackThisSquare = (
        squareId: number,
        includeAttacksFrom: string[] = ['L','D'],
        boardState: string[] = this.state.pieceKeys,
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

    // generatePieceValidMoves = (
    //     squareId: number,
    //     directions: number[],
    //     {
    //         distance = 8,
    //         nextSquareValidators = [],
    //         captureValidators = [],
    //         // selfCaptureValidators = [], // ... never necessary (so far) ... merged into captureValidators 
    //         includeNonCaptures = true,
    //         // includeCaptures = true,
    //         // includeSelfCaptures = false,
    //         includeAttacksFrom = ['L','D'], // could even put '' to indicate includeNonCaptures as well... 
    //         // squareToImagineEmpty = null, // used to test out possible moves this side may make
    //         // squareToImagineFriendly = null, // used to test out possible moves this side may make
    //     }: {
    //         distance?: number;
    //         nextSquareValidators?: ((oldSquare: number, newSquare: number) => boolean)[];
    //         captureValidators?: ((squareFrom: number, squareTo: number) => boolean)[];
    //         // selfCaptureValidators?: ((squareFrom: number, squareTo: number) => boolean)[];
    //         includeNonCaptures?: boolean;
    //         // includeCaptures?: boolean;
    //         // includeSelfCaptures?: boolean;
    //         includeAttacksFrom?: string[] | null;
    //         // squareToImagineEmpty?: number | null;
    //         // squareToImagineFriendly?: number | null;
    //     } = {},
    //     boardState: string[] = this.state.pieceKeys,
    // ): number[] => {
    //     const legalMoves: number[] = [];
    //     // if ((squareToImagineEmpty || squareToImagineFriendly) && squareToImagineEmpty === squareToImagineFriendly) {
    //     //     console.error("Square to imagine empty can't be the same square to imagine friendly");
    //     //     return legalMoves;
    //     // }
    //     // if (!directions) return legalMoves; // not necessary 
    //     // if (this.state.pieceKeys[squareId] === 'LN' || (this.state.pieceKeys[squareId] === 'LK' && this.state.pieceKeys[squareToImagineEmpty] === 'LN')) {
    //     //   // console.log(`Fn params for ${this.state.pieceKeys[squareId]}:\n\tsquareId: ${squareId}\n\tdirections: ${directions}\n\t{\n\t\tdistance: ${distance}\n\t\tnextSquareValidators: ${nextSquareValidators}\n\t\tincludeNonCaptures: ${includeNonCaptures}\n\t\tincludeCaptures: ${includeCaptures}\n\t\tincludeSelfCaptures: ${includeSelfCaptures}\n\t\tsquareToImagineEmpty: ${squareToImagineEmpty}\n\t\tsquareToImagineFriendly: ${squareToImagineFriendly}\n\t}`);
    //     // }

    //     nextSquareValidators.push((oldSquare: number, newSquare: number) => oldSquare >= 0 && newSquare >= 0);
    //     nextSquareValidators.push((oldSquare: number, newSquare: number) => oldSquare < 64 && newSquare < 64);

    //     captureValidators.push((squareFrom: number, squareTo: number) => includeAttacksFrom?.includes(boardState[squareTo]?.charAt(0)) || false);
    //     captureValidators.push((squareFrom: number, squareTo: number) => helpers.isMoveEnPassant(squareFrom, squareTo, boardState));
    //     // captureValidators.push((squareFrom: number, squareTo: number) => boardState[squareFrom]?.charAt(0) !== boardState[squareTo]?.charAt(0));

    //     // selfCaptureValidators.push((squareFrom: number, squareTo: number) => boardState[squareFrom]?.charAt(0) === boardState[squareTo]?.charAt(0));
    //     // selfCaptureValidators.push((squareFrom: number, squareTo: number) => squareTo === squareToImagineFriendly);


    //     directions.forEach((direction) => {
    //         let checkedSquare = squareId;
    //         let nextSquareToCheck = checkedSquare + direction;
    //         let rangeRemaining = distance;
    //         // eslint-disable-next-line no-loop-func
    //         while (rangeRemaining > 0 && nextSquareValidators.every(validator => validator(checkedSquare, nextSquareToCheck))) { // (checkedSquare: number, nextSquareToCheck: number) => boolean:
    //             if (
    //                 // nextSquareToCheck !== squareToImagineFriendly &&
    //                 (
    //                     boardState[nextSquareToCheck] === "" // ||
    //                     // nextSquareToCheck === squareToImagineEmpty
    //                 )
    //             ) {
    //                 if (includeNonCaptures) {
    //                     legalMoves.push(nextSquareToCheck);
    //                 }
    //             } else {
    //                 if (
    //                     // this.state.pieceKeys[squareId] === "" || // TODO validate/change later ... 
    //                     // generating legal moves from any square without a piece on it will include pieces from either side making contact w this square 
    //                     (
    //                         // includeCaptures &&
    //                         // nextSquareToCheck !== squareToImagineFriendly &&

    //                         // this.state.pieceKeys[nextSquareToCheck].charAt(0) !== this.state.pieceKeys[squareId].charAt(0) && 
    //                         // eslint-disable-next-line no-loop-func
    //                         captureValidators.some(validator => validator(squareId, nextSquareToCheck)) // at least one validator true means valid capture 
    //                     ) 
    //                     // ||
    //                     // (
    //                     //     // includeSelfCaptures &&
    //                     //     // (
    //                     //     //   this.state.pieceKeys[nextSquareToCheck].charAt(0) === this.state.pieceKeys[squareId].charAt(0) || 
    //                     //     //   nextSquareToCheck === squareToImagineFriendly
    //                     //     // )
    //                     //     // eslint-disable-next-line no-loop-func
    //                     //     selfCaptureValidators.some(validator => validator(squareId, nextSquareToCheck))
    //                     // )
    //                 ) {
    //                     legalMoves.push(nextSquareToCheck);
    //                 }
    //                 break;
    //             }
    //             checkedSquare = nextSquareToCheck;
    //             nextSquareToCheck = checkedSquare + direction;
    //             rangeRemaining -= 1;
    //         }
    //     })

    //     return legalMoves;
    // }

    // generateKingValidMoves = (
    //     squareId: number,
    //     includeNonCaptures: boolean = true,
    //     // includeSelfCaptures: boolean = false,
    //     includeAttacksFrom: string[] = ['L','D'],
    //     boardState: string[] = this.state.pieceKeys,
    //     includeCastling: boolean = false, // true,
    // ): number[] => {
    //     // const nextSquareValidators: ((oldSquare: number, newSquare: number) => boolean)[] = [];
    //     // const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
    //     const nextSquareValidators = keycodeToComponent['K'].nextSquareValidators;
    //     const directions = keycodeToComponent['K'].directions;
    //     const legalMoves = this.generatePieceValidMoves(
    //         squareId,
    //         directions,
    //         {
    //             distance: 1,
    //             nextSquareValidators: nextSquareValidators,
    //             includeNonCaptures: includeNonCaptures,
    //             // includeSelfCaptures: includeSelfCaptures,
    //             includeAttacksFrom: includeAttacksFrom,
    //         },
    //         boardState,
    //     );

    //     // avoid the infinite loop from getOccupiedSquaresThatCanAttackThisSquare calling generateKingValidMoves and trying to check for castling as an attack 
    //     if (!includeCastling || !boardState[squareId] || boardState[squareId].charAt(1) !== 'K') {
    //         // console.log("Do not include castling based on method argument.");
    //         return legalMoves;
    //     }

    //     // check for castling ... start by verifying that the king never moved, could store this info in state for a minor speedup 
    //     const kingStartingSquare = this.state.whiteToPlay ? 60 : 4; // TODO remove this assumption ?? 

    //     if (squareId === kingStartingSquare) {
    //         console.log(`LegalMoves: ${legalMoves}`);
    //         console.log(`KingPosition: ${this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition}`);
    //     } else if (kingStartingSquare !== 60 && kingStartingSquare !== 4) {
    //         console.log(`KingStartingSquare: ${kingStartingSquare}`);
    //     } else {
    //         console.log(`SquareID: ${squareId}`);
    //         console.log(`KingPosition: ${this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition}`);
    //     }

    //     if (
    //         squareId !== kingStartingSquare ||
    //         (this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition) !== kingStartingSquare
    //     ) return legalMoves;

    //     console.log(`LightKingHasShortCastlingRights: ${this.state.lightKingHasShortCastlingRights}`);
    //     console.log(`LightKingHasLongCastlingRights: ${this.state.lightKingHasLongCastlingRights}`);
    //     console.log(`DarkKingHasShortCastlingRights: ${this.state.darkKingHasShortCastlingRights}`);
    //     console.log(`DarkKingHasLongCastlingRights: ${this.state.darkKingHasLongCastlingRights}`);


    //     // if (this.state.history.some(pastMove => pastMove.JN.startsWith(String(kingStartingSquare).padStart(2, '0')))) return legalMoves;
    //     if (this.state.whiteToPlay && !this.state.lightKingHasShortCastlingRights && !this.state.lightKingHasLongCastlingRights) return legalMoves;
    //     if (!this.state.whiteToPlay && !this.state.darkKingHasShortCastlingRights && !this.state.darkKingHasLongCastlingRights) return legalMoves;

    //     // check short and long castling 
    //     // need to verify for each side that the rook also never moved, that we have no pieces in between the king and rook, and
    //     // that none of the opponent's pieces can target either square that the rook or king will land on 
    //     //   (in short castling, this means none of the squares that are between the king and rook; in long castling, the square
    //     //    next to the rook *can* be targeted) 
    //     const playerCode = boardState[squareId].charAt(0);
    //     const shortCastleRookStartingSquare = this.state.whiteToPlay ? 63 : 7;
    //     const shortCastleKingSafetySquares = this.state.whiteToPlay ? [60, 61, 62] : [4, 5, 6];
    //     console.log("Checking short castling...");
    //     console.log(`\tRelevant BoardState: ${boardState.slice(kingStartingSquare + 1, shortCastleRookStartingSquare)}`);
    //     if (
    //         boardState.slice(kingStartingSquare + 1, shortCastleRookStartingSquare).every(pieceKey => pieceKey === '') &&
    //             // this.state.history.every(pastMove => !pastMove.JN.startsWith(String(shortCastleRookStartingSquare).padStart(2, '0')))
    //             (this.state.whiteToPlay ?
    //             this.state.lightKingHasShortCastlingRights :
    //             this.state.darkKingHasShortCastlingRights)
    //     ) {
    //         if (shortCastleKingSafetySquares
    //             // .every(square => this.getOccupiedSquaresThatCanAttackThisSquare(square, false, [(playerCode === 'L' ? 'D' : 'L')]) // dupe logic TODO remove
    //             .every(square => this.getOccupiedSquaresThatCanAttackThisSquare(square, [(playerCode === 'L' ? 'D' : 'L')])
    //                 // .filter((square) => boardState[square].charAt(0) !== playerCode)
    //                 .length === 0
    //             )
    //         ) {
    //             console.log("Short castling is valid.");
    //             legalMoves.push(shortCastleRookStartingSquare);
    //         }
    //     }
    //     const longCastleRookStartingSquare = this.state.whiteToPlay ? 56 : 0;
    //     const longCastleKingSafetySquares = this.state.whiteToPlay ? [60, 59, 58] : [4, 3, 2];
    //     console.log("Checking long castling...");
    //     console.log(`\tRelevant BoardState: ${boardState.slice(longCastleRookStartingSquare + 1, kingStartingSquare)}`);
    //     if (boardState.slice(longCastleRookStartingSquare + 1, kingStartingSquare).every(pieceKey => pieceKey === '') &&
    //         // this.state.history.every(pastMove => !pastMove.JN.startsWith(String(longCastleRookStartingSquare).padStart(2, '0')))
    //         (this.state.whiteToPlay ?
    //         this.state.lightKingHasLongCastlingRights :
    //         this.state.darkKingHasLongCastlingRights)
    //     ) {
    //         if (longCastleKingSafetySquares
    //             // .every(square => this.getOccupiedSquaresThatCanAttackThisSquare(square, false, [(playerCode === 'L' ? 'D' : 'L')]) // dupe logic TODO remove 
    //             .every(square => this.getOccupiedSquaresThatCanAttackThisSquare(square, [(playerCode === 'L' ? 'D' : 'L')])
    //                 // .filter((square) => boardState[square].charAt(0) !== playerCode)
    //                 .length === 0
    //             )
    //         ) {
    //             console.log("Long castling is valid.");
    //             legalMoves.push(longCastleRookStartingSquare);
    //         }
    //     }

    //     if (squareId === kingStartingSquare) {
    //         console.log(legalMoves);
    //     } else if (kingStartingSquare !== 60 && kingStartingSquare !== 4) {
    //         console.log(kingStartingSquare);
    //     } else {
    //         console.log(squareId);
    //     }

    //     return legalMoves;
    // }

    // A MoveGenerator requires a `squareId` and may accept other optional args.
    // We type it as variadic so callers can pass only the required arg.
    //   type MoveGenerator = (squareId: number, ...args: any[]) => number[];

    //   validMoveMap: Record<string, MoveGenerator> = {
    // validMoveMap: Record<string, (squareId: number, ...args: any[]) => number[]> = {
    //     //   validMoveMap = {
    //     // // 'P': this.generatePawnValidMoves,
    //     // 'P': keycodeToComponent['P'].generatePieceValidMoves,
    //     // // 'N': this.generateKnightValidMoves,
    //     // 'N': keycodeToComponent['N'].generatePieceValidMoves,
    //     // 'B': this.generateBishopValidMoves,
    //     // 'R': this.generateRookValidMoves,
    //     // 'Q': this.generateQueenValidMoves,
    //     // 'K': this.generateKingValidMoves,
    // }

    getLegalMoves = (squareId: number): number[] => {
        const keycode = this.state.pieceKeys[squareId];
        if (keycode === undefined || keycode === "") {
            // console.log("The selected square has no piece on it, therefore there are no legal moves to make.");
            return [];
        }
        if (this.state.whiteToPlay && keycode.charAt(0) !== 'L') {
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
        const pieceCode: string = keycode.charAt(1);
        let validMoves: number[] = [];
        // if (['P','N','B','R','Q','K'].includes(pieceCode)) {
        if (constants.validPieces.includes(pieceCode)) {
            const keycodeMapKey = keycode as keyof typeof keycodeToComponent;
            const piece = keycodeToComponent[keycodeMapKey];
            // validMoves = keycodeToComponent[keycode].generatePieceValidMoves(squareId);
            // let extraArgs = {};
            // switch (pieceCode) {
                //     case 'K':
                //         extraArgs = {
                //             includeCastling: true,
                //             currentGameState: this,
                //         }
                // }
            // let functionArgs: any[] = [squareId, this.state.pieceKeys.slice()];
            const baseFunctionArgs: [number, string[]] = [squareId, this.state.pieceKeys.slice()];
            // let additionalFunctionArgs: [boolean?, string[]?, boolean?, Game?] = [undefined, undefined, undefined, undefined];
            let additionalFunctionArgs: [number[]?, {}?, boolean?, Game?] = [undefined, undefined, undefined, undefined];
            if (pieceCode === 'K') {
                // additionalFunctionArgs = [
                //     true, // includeNonCaptures 
                //     ['L','D'].filter(playerOption => playerOption !== keycode.charAt(0)), // includeCapturesOf
                //     true, // includeCastling
                //     this, // currentGameState ... this one is necessary 
                // ];
                additionalFunctionArgs = [
                    undefined, // directions
                    {}, // object
                    true, // includeCastling
                    this, // currentGameState
                ]
                // validMoves = (piece as Piece.King)
                // validMoves = (piece as King)
                // const kingPiece = (piece as unknown as LightKing) // ???? 
                // validMoves = kingPiece.generatePieceValidMoves(...baseFunctionArgs, ...additionalFunctionArgs)
                const kingPiece = keycode.charAt(0) === 'L' ? LightKing : DarkKing;
                validMoves = kingPiece.generatePieceValidMoves(...baseFunctionArgs, ...additionalFunctionArgs);
            } else {
                validMoves = piece.generatePieceValidMoves(...baseFunctionArgs);
            }
            // validMoves = piece.generatePieceValidMoves(
            //     squareId, 
            //     this.state.pieceKeys.slice(),
            //     true, // includeNonCaptures
            //     ['L','D'].filter(playerOption => playerOption !== keycode.charAt(0)), // includeCapturesOf ... would love to omit this argument
            //     // ...Object.values(extraArgs)
            // );
        } 
        // else if (pieceCode in this.validMoveMap) {
        //     validMoves = this.validMoveMap[pieceCode as keyof typeof this.validMoveMap](squareId);
        // }

        // console.log(`Generating valid moves that this ${pieceCode} can make...`);
        // const validMoves: number[] = pieceCode in this.validMoveMap ? this.validMoveMap[pieceCode as keyof typeof this.validMoveMap](squareId) : []; // use the default arguments, only supply squareId 
        // if (pieceCode === 'K') console.log(`Valid moves for this ${pieceCode} are: ${validMoves}`);
        const legalMoves = validMoves.filter((targetMove) => !this.wouldOwnKingBeInCheckAfterMove(squareId, targetMove));
        // if (pieceCode === 'K') console.log(`Legal moves after filtering out which valid moves would result in this player's king being capturable on the next move: ${legalMoves}`);
        return legalMoves;
    }

    // isKingInCheck = (player: 'w' | 'b' | 'L' | 'D', boardState: string[] = this.state.pieceKeys): boolean => {
    //     // maybe here we can easily set like a canBlock, canCapture, canEvade boolean state system ...
    //     // canBlock seems like the only tricky one, gotta check all piece moves 
    //     let kingPosition = this.state.whiteToPlay ?
    //         this.state.darkKingPosition :
    //         this.state.lightKingPosition
    //     if (player === 'w' || player === 'L') kingPosition = this.state.lightKingPosition;
    //     else if (player === 'b' || player === 'D') kingPosition = this.state.darkKingPosition;

    //     let attackingSquares = this.getOccupiedSquaresThatCanAttackThisSquare(
    //         kingPosition!, // assert that it will not be null. check this TODO 
    //         // false,
    //         [(this.state.whiteToPlay ? 'D' : 'L')], // dupe logic as prev parameter above TODO remove 
    //         // null,
    //         // null,
    //         boardState
    //     );

    //     return attackingSquares.length !== 0;
    //     // if attackingSquares.length > 1, it's a double check, can't possible block or capture out of it 
    //     // have to evade with the king, check if opponent attacks all of the squares around our king 
    //     // if attackingSquares.length === 1, we can first try to capture or make a line from the attackingSquare to our king
    //     // and see if we can put a piece on any of those squares in the line to block 
    // }

    isCheckmate = () => {

    }

    // isMoveEnPassant = (squareMovedFrom: number, squareMovedTo: number): boolean => {
    //     // TODO refactor, use this.state.enPassantTargetSquare 
    //     const pieceMoving = this.state.pieceKeys[squareMovedFrom];
    //     return (
    //         pieceMoving.charAt(1) === 'P' // piece moving is a pawn
    //         // && squareMovedFrom % 8 !== squareMovedTo % 8 // signifies that the pawn performed a capture (changed files) 
    //         // && this.state.pieceKeys[squareMovedTo] === '' // signifies that the capture was an en passant 
    //         && squareMovedTo === this.state.enPassantTargetSquare
    //     )
    // }

    // isMoveCastling = (squareMovedFrom: number, squareMovedTo: number): boolean => {
    //     const pieceMoving = this.state.pieceKeys[squareMovedFrom];
    //     return (
    //         pieceMoving.charAt(1) === 'K'
    //         && [60, 4].includes(squareMovedFrom) && [63, 56, 7, 0].includes(squareMovedTo)
    //     )
    // }

    wouldOwnKingBeInCheckAfterMove = (squareMovedFrom: number, squareMovedTo: number): boolean => {

        let ownKingPosition = this.state.whiteToPlay ? this.state.lightKingPosition : this.state.darkKingPosition;
        if (ownKingPosition === squareMovedFrom) ownKingPosition = squareMovedTo;
        // const tempBoardState = helpers.getNewPieceKeysCopyWithMoveApplied(this, squareMovedFrom, squareMovedTo);
        const tempBoardState = helpers.getNewPieceKeysCopyWithMoveApplied(this, squareMovedFrom, squareMovedTo);

        // const squaresWithPiecesThatCouldAttackOurKingAfterThisMove = this.getOccupiedSquaresThatCanAttackThisSquare(
        //     ownKingPosition!, // TODO check, assertion that king position won't be null
        //     // false,
        //     [(this.state.whiteToPlay ? 'D' : 'L')], // dupe logic as prev parameter above TODO remove 
        //     // null, // squareMovedFrom, // do this if we don't update state 
        //     // null,
        //     tempBoardState,
        // );

        // if (squareMovedTo === 7 || squareMovedTo === 63) {
        //     console.log(`After checking short castling:\nSquaresWithPiecesThatCouldAttackOurKingAfterThisMove: ${squaresWithPiecesThatCouldAttackOurKingAfterThisMove}`);
        // }

        // if (squaresWithPiecesThatCouldAttackOurKingAfterThisMove.length !== 0) {
        //     console.log(`This move would result in our king being in check from squares: ${squaresWithPiecesThatCouldAttackOurKingAfterThisMove}`);
            
        // }

        // return squaresWithPiecesThatCouldAttackOurKingAfterThisMove.length !== 0;

        return helpers.isKingInCheck(ownKingPosition, tempBoardState, this);

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

        //   const squaresWithPiecesThatCouldAttackOurKingAfterThisMove = this.getOccupiedSquaresThatCanAttackThisSquare(
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

        // const squaresWithPiecesThatCouldAttackOurKingAfterThisMove = this.getOccupiedSquaresThatCanAttackThisSquare(
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

    // getNewPieceKeysCopyWithMoveApplied = (squareMovedFrom: number, squareMovedTo: number): string[] => {
    //     const pieceMoving = this.state.pieceKeys[squareMovedFrom];
    //     let squareIdOfPawnCapturedViaEnPassant = null;
    //     let squareIdOfKingAfterCastling = null;
    //     let squareIdOfRookAfterCastling = null;
    //     let castlingRook = null;
    //     // copy the array before mutating so React sees a new reference
    //     let newPieceKeys = this.state.pieceKeys.slice();

    //     if (helpers.isMoveEnPassant(squareMovedFrom, squareMovedTo, this.state.pieceKeys)) {
    //         // alert("An en passant occurred...");
    //         squareIdOfPawnCapturedViaEnPassant = squareMovedTo + -8 * (pieceMoving.charAt(0) === 'L' ? -1 : 1);
    //         newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
    //         newPieceKeys[squareMovedFrom] = "";
    //         newPieceKeys[squareMovedTo] = pieceMoving;
    //     } else if (helpers.isMoveCastling(squareMovedFrom, squareMovedTo, this.state.pieceKeys)) {
    //         // indicates that the king is castling 
    //         let directionFromKing = 1;
    //         if (squareMovedTo < squareMovedFrom) directionFromKing = -1;
    //         castlingRook = this.state.pieceKeys[squareMovedTo];
    //         squareIdOfKingAfterCastling = squareMovedFrom + directionFromKing * 2;
    //         squareIdOfRookAfterCastling = squareMovedFrom + directionFromKing;
    //         newPieceKeys[squareMovedFrom] = "";
    //         newPieceKeys[squareMovedTo] = "";
    //         newPieceKeys[squareIdOfRookAfterCastling] = castlingRook;
    //         newPieceKeys[squareIdOfKingAfterCastling] = pieceMoving;
    //     } else {
    //         newPieceKeys[squareMovedFrom] = "";
    //         newPieceKeys[squareMovedTo] = pieceMoving;
    //     }

    //     return newPieceKeys; // , {squareIdOfPawnCapturedViaEnPassant, squareIdOfKingAfterCastling, squareIdOfRookAfterCastling};
    // }

    updateMoveHistory = (squareMovedFrom: number, squareMovedTo: number, boardState: string[]): void => {
        this.setState({
            ...this.state,
            history: this.state.history.concat([{
                pieceKeys: boardState,
                AN: this.generateMoveAN(squareMovedFrom, squareMovedTo), 
                // TODO generate Algebraic Notation for this move -- to do so, we need to know if any other 
                //   pieces of the same type would be able to make the same move 
                JN: helpers.generateMoveJN(squareMovedFrom, squareMovedTo),
                INN: helpers.generateMoveINN(squareMovedFrom, squareMovedTo),
                // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
            }]),
        });
    }

    undoLastMove = (): void => {
        console.log(`undoLastMove`);
        // TODO undo castling and rights, pawn promotions, king locations, etc. 
        const newPieceKeys = this.state.history[this.state.history.length - 1].pieceKeys;
        this.setState({
            ...this.state,
            history: this.state.history.slice(0, -1),
            whiteToPlay: !this.state.whiteToPlay, // this.state.history.length % 2 === 0,
            pieceKeys: newPieceKeys,
            // squareProps: this.state.history[this.state.history.length - 1].pieceKeys.map((pk, sqId) => {
            //   return {
            //     keycode: pk,
            //     id: sqId,
            //     isHighlighted: false,
            //     isAltHighlighted: false,
            //     isSelected: false,
            //     isAltSelected: false,
            //   }
            // }),
            squareProps: this.state.squareProps.map((oldSquareProp, squareId) => {
                return {
                    ...oldSquareProp,
                    keycode: newPieceKeys[squareId],
                    id: squareId,
                    isHighlighted: false,
                    isAltHighlighted: false,
                    isSelected: false,
                    isAltSelected: false,
                }
            }),
            plyNumber: this.state.plyNumber - 1,
        });

        // this.deselectAndRemoveHighlightFromAllSquares();
    }

    deselectAndRemoveHighlightFromAllSquares = (): void => {
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

    selectSquareAndHighlightAllLegalMoves = (squareToSelect: number, legalMovesToHighlight: number[]): void => {
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

    handleSquareClick = async (squareId: number): Promise<void> => {
        // console.log(this);
        // console.log(this instanceof React.Component)
        // await updateState(this, 'testState', 10);

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
            const isThisPlayersMove = this.state.whiteToPlay !== (this.state.pieceKeys[squareId]?.charAt(0) === 'D');
            const squaresToHighlight = isThisPlayersMove ? this.getLegalMoves(squareId) : [];
            this.selectSquareAndHighlightAllLegalMoves(squareId, squaresToHighlight);
            return;
        }

        // otherwise, a square is already selected, and we clicked on one of its legal move squares 
        // if (this.state.squareProps[squareId].isHighlighted) {
        // Move piece at selected square to clicked highlighted square
        const squareMovedFrom: number | null = this.state.squareSelected; // TODO by the time we get here in this method, squareMovedFrom can't be null 
        const squareMovedTo: number = squareId;
        const newPieceKeys = helpers.getNewPieceKeysCopyWithMoveApplied(this.state.pieceKeys, squareMovedFrom!, squareMovedTo);

        let squareOfPawnPromotion = null;

        // this.setState({...this.state, isKingInCheck: this.isKingInCheck()});
        // this.setState({...this.state, enPassantTargetSquare: null});

        if (this.state.pieceKeys[squareMovedFrom!].charAt(1) === 'K') {
            if (this.state.pieceKeys[squareMovedFrom!].charAt(0) === 'L') {
                // this.setState({...this.state, lightKingHasLongCastlingRights: false, lightKingHasShortCastlingRights: false});
                const newStateKVPs: { [key: string]: any } = {
                    "lightKingHasLongCastlingRights": false,
                    "lightKingHasShortCastlingRights": false,
                };
                await helpers.multiUpdateState(this, newStateKVPs);
                // await updateState(this, 'lightKingHasLongCastlingRights', false);
                // await updateState(this, 'lightKingHasShortCastlingRights', false);
            } else {
                // this.setState({...this.state, darkKingHasLongCastlingRights: false, darkKingHasShortCastlingRights: false});
                const newStateKVPs: { [key: string]: any } = {
                    "darkKingHasLongCastlingRights": false,
                    "darkKingHasShortCastlingRights": false,
                }
                await helpers.multiUpdateState(this, newStateKVPs);
            }
            if (!helpers.isMoveCastling(squareMovedFrom!, squareMovedTo, this.state.pieceKeys)) {
                if (newPieceKeys[squareMovedTo].charAt(0) === 'L') {
                    //   this.setState({...this.state, lightKingPosition: squareMovedTo});
                    await helpers.updateState(this, "lightKingPosition", squareMovedTo);
                } else {
                    //   this.setState({...this.state, darkKingPosition: squareMovedTo});
                    await helpers.updateState(this, "darkKingPosition", squareMovedTo);
                }
            } else {
                const directionFromKing = squareMovedFrom! < squareMovedTo ? 1 : -1;
                const squareIdOfKingAfterCastling = squareMovedFrom! + directionFromKing * 2;
                if (newPieceKeys[squareIdOfKingAfterCastling].charAt(0) === 'L') {
                    //   this.setState({...this.state, lightKingPosition: squareIdOfKingAfterCastling});
                    await helpers.updateState(this, "lightKingPosition", squareIdOfKingAfterCastling);
                } else {
                    //   this.setState({...this.state, darkKingPosition: squareIdOfKingAfterCastling});
                    await helpers.updateState(this, "darkKingPosition", squareIdOfKingAfterCastling);
                }
            }
        } else if (this.state.pieceKeys[squareMovedFrom!].charAt(1) === 'R') {
            // TODO we also lose castling rights if a piece *captures* the rook 
            if (this.state.pieceKeys[squareMovedFrom!].charAt(0) === 'L') {
                if (squareMovedFrom === 63) {
                    //   this.setState({...this.state, lightKingHasShortCastlingRights: false});
                    await helpers.updateState(this, "lightKingHasShortCastlingRights", false);
                } else if (squareMovedFrom === 56) {
                    //   this.setState({...this.state, lightKingHasLongCastlingRights: false});
                    await helpers.updateState(this, "lightKingHasLongCastlingRights", false);
                }
            } else {
                if (squareMovedFrom === 7) {
                    //   this.setState({...this.state, darkKingHasShortCastlingRights: false});
                    await helpers.updateState(this, "darkKingHasShortCastlingRights", false);
                } else if (squareMovedFrom === 0) {
                    //   this.setState({...this.state, darkKingHasLongCastlingRights: false});
                    await helpers.updateState(this, "darkKingHasLongCastlingRights", false);
                }
            }
        } else if (this.state.pieceKeys[squareMovedFrom!].charAt(1) === 'P') {
            if (Math.abs(squareMovedFrom! - squareMovedTo) === 16) {
                // double-square first move
                const enPassantTargetSquare = Math.floor((squareMovedFrom! + squareMovedTo) / 2);
                // this.setState({...this.state, enPassantTargetSquare: enPassantTargetSquare})
                await helpers.updateState(this, "enPassantTargetSquare", enPassantTargetSquare);
                // this MUST be set back to null, or updated to different square, on the very next ply
            }
            const isPromoting = Math.floor(squareMovedTo / 8) === (this.state.whiteToPlay ? 0 : 7);
            if (isPromoting) {
                // TODO implement UI, just auto-queen for now 
                // newPieceKeys is const, but can we change elements?? Yes, we can 

                // this.setState({
                //   ...this.state,
                //   squareProps: this.state.squareProps.map((sqProp, sqId) => {
                //     if (sqId !== squareMovedTo) return sqProp;
                //     return {
                //       ...sqProp,
                //       isPromoting: true,
                //     }
                //   })
                // });

                // this.state.squareProps[squareMovedTo] = this.setState({...this.state.squareProps[squareMovedTo], isPromoting: true});
                // newPieceKeys[squareMovedTo] = this.state.pieceKeys[squareMovedFrom].charAt(0) + 'Q';

                squareOfPawnPromotion = squareMovedTo;
            }
        }

        const nextMoveAN = this.generateMoveAN(squareMovedFrom!, squareMovedTo); // , newPieceKeys);
        const nextMoveJN = helpers.generateMoveJN(squareMovedFrom!, squareMovedTo);
        const nextMoveINN = helpers.generateMoveINN(squareMovedFrom!, squareMovedTo);

        // TODO there's a bug with castling, rook stopped showing up, seems like it's here somewhere ...
        // can i not setState twice back to back or something weird?? why is that happening? 
        // EDIT: no the issue was somewhere else, avoiding modifying state directly above resolved that issue. 
        // NOTE: *DO NOT CALL METHODS THAT REFERENCE STATE WHILE SETTING STATE* 
        if (squareOfPawnPromotion) {
            this.setState({
                ...this.state,
                squareProps: this.state.squareProps.map((squareProps, squareId) => {
                    if (squareId !== squareOfPawnPromotion) return squareProps;
                    return {
                        ...squareProps,
                        isPromoting: true,
                    }
                })
            });
            return;
        }
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
                    isPromoting: (squareId === squareOfPawnPromotion),
                }
            }),
            history: this.state.history.concat([{
                pieceKeys: newPieceKeys,
                AN: nextMoveAN, // generate Algebraic Notation for this move 
                JN: nextMoveJN, // Jared's Notation: How I misinterpreted INN, and just used squareIds from and to 
                INN: nextMoveINN, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
            }]),
        });

        // this.updateMoveHistory(squareMovedFrom, squareMovedTo, newPieceKeys);
    }

    handleSquareRightClick = (event: React.MouseEvent | null, squareId: number): void => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        // squareId provided from Square component
        // console.log('Right-click on square:', squareId, event);
        // If you need to call any DOM/test helpers, do so here. e.g. event.target.testEvent();


        // select an unselected square and highlight the legal moves for that piece on this turn 
        if (squareId !== this.state.squareAltSelected) {
            // default args for getOccupiedSquaresThatCanAttackThisSquare:
            //   includeSelfAttacks: true
            //   includeAttacksFrom: ['L','D']
            //   squareToImagineEmpty: null
            //   squareToImagineFriendly: null
            //   boardState: this.state.pieceKeys
            const squaresToAltHighlight = this.getOccupiedSquaresThatCanAttackThisSquare(squareId);
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

    handleUndoClick = (event?: React.SyntheticEvent | null): void => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        console.log(`handleUndoClick`);
        this.undoLastMove();
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
                    // promotionSquare={this.state.promotionSquare}
                    handleUndoClick={this.handleUndoClick}
                    handleRedoClick={() => { }}
                    handleResetClick={() => { }}
                    handleGetFENClick={this.generateBoardFEN}
                />
                <GameStatus
                    whiteToPlay={this.state.whiteToPlay}
                    history={this.state.history}
                />
                <GameNotes
                    zobristHash=''
                    metadata={{}}
                />

                {
                    // this.state.showNotes && (
                    //   <GameNotes />
                    // )
                }
            </div>
        );
    }
}
