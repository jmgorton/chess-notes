import React, { MouseEventHandler, ReactEventHandler } from 'react';

import GameStatus from './GameStatus.tsx';
import { GameNotes } from './GameNotes';
import Board, { DraggableDroppableBoard } from './Board.tsx';

// import { keycodeToComponent } from './Piece.tsx';

import * as helpers from '../utils/helpers.ts';
import * as constants from '../utils/constants.ts';

import {
    BoardProps,
    CastlingRights,
    // SquareProp,
    GameProps,
    GameState,
    HistoryItem,
    KingPositions,
    Move,
    PieceKey,
    PlayerKey,
    PromotionOptionsPieceKey,
    // HistoryItem,
    SquareKeycode,
} from '../utils/types.ts';
import BoardControlPanel from './BoardControlPanel.tsx';
import { keycodeToComponent, getPieceTypeByKeycode, getPieceElementByKeycode } from './Piece.tsx';

export default class Game extends React.Component<GameProps, GameState> {
    // backrankStartingPositions: string[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']; // can make chess960 later 
    // testCastlingFEN: string = 'r1bqk2r/pp1p1ppp/2n2n2/4p3/1b2P3/1N1B4/PPPN1PPP/R1BQK2R b KQkq - 0 0'; 
    // testLongCastlingFEN: string = 'r3k2r/pp3ppp/2n2n2/q1p1p3/4P1b1/P2BQ3/1PPB1PPP/R3K2R b KQkq - 0 0';
    // testPawnPromotionFEN: string = 'r3kr2/pp6/2q4p/2p1Pp2/7p/8/PP3PPP/R2QR1K w q - 0 0';
    // testPawnPromotionFEN: string = 'r1bqkbnr/pppp2Pp/2n1p3/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 0';
    // testCheckmateFEN: string = '2kr3r/pp3ppp/nq2pn2/2b5/P2N1P2/2P5/1PQ1N1PP/R1B2R1K b  - 0 0';
    // TODO debug: Passed an un-parsable string stateToLoad argument: 2kr3r/pp3ppp/nq2pn2/2b5/P2N1P2/2P5/1PQ1N1PP/R1B2R1K b  - 0 0
    // testPosition1FEN: string = 'r4rk1/pp1q1ppp/2np1n2/4p2b/2B1P3/PN2QP1P/1PPB2P1/R3K2R b KQ - 0 12'; 
    backrankStartingPositions: string[] = constants.defaultStartingBackRank;
    // startingFEN: string = this.testCheckmateFEN; // constants.defaultStartingFEN;
    startingFEN: string = '';
    boardSize: number = this.backrankStartingPositions.length;
    numSquares: number = this.boardSize ** 2;

    constructor(props: GameProps) {
        super(props);

        //     // square props:
        //     //   color: not necessary, doesn't change, just use rank + file data in Board render method 
        //     //   keycode: the pieceKey ... if you think about it, this is not necessary either, data already in the pieceKeys state
        //     //   id: squareId [0-63] ... same with this one, data already stored in pieceKeys state by definition of their locations
        //     //   key: `${squareId}-${pieceKey}-${changeKey}`
        //     //     squareId is the id from 0-63 of the square
        //     //     pieceKey is the piece id, e.g. "LK" or "DP" ... it's also not necessary to make this a part of the key since we have the changeCode/changeKey
        //     //     changeKey is the number of times the square has been re-rendered, increments throughout the game 
        //     //       (each re-render also may or may not change the pieceKey)
        //     //   onSquareClick: the callback function for when the square is clicked
        //     //   isHighlighted: is the square highlighted (valid moves from squareSelected, if any) 
        //     //   isSelected: the square selected after the last click 

        // set this state info w helpers.initializeState(this);
        this.state = {
            pieceKeys: [],
            // piecePositions: {
            //     'D': {
            //         'B': new Set<number>([
            //             constants.BLACK_STARTING_PIECE_POSITIONS.KB,
            //             constants.BLACK_STARTING_PIECE_POSITIONS.QB,
            //         ]),
            //         'N': new Set([
            //             constants.BLACK_STARTING_PIECE_POSITIONS.KN,
            //             constants.BLACK_STARTING_PIECE_POSITIONS.QN,
            //         ]),
            //         'R': new Set([
            //             constants.BLACK_STARTING_PIECE_POSITIONS.KR,
            //             constants.BLACK_STARTING_PIECE_POSITIONS.QR,
            //         ]),
            //         'Q': new Set([constants.BLACK_STARTING_PIECE_POSITIONS.Q]),
            //         'P': new Set(constants.BLACK_STARTING_PIECE_POSITIONS.P),
            //     },
            //     'L': {
            //         'B': new Set<number>([
            //             constants.WHITE_STARTING_PIECE_POSITIONS.KB,
            //             constants.WHITE_STARTING_PIECE_POSITIONS.QB,
            //         ]),
            //         'N': new Set([
            //             constants.WHITE_STARTING_PIECE_POSITIONS.KN,
            //             constants.WHITE_STARTING_PIECE_POSITIONS.QN,
            //         ]),
            //         'R': new Set([
            //             constants.WHITE_STARTING_PIECE_POSITIONS.KR,
            //             constants.WHITE_STARTING_PIECE_POSITIONS.QR,
            //         ]),
            //         'Q': new Set([constants.WHITE_STARTING_PIECE_POSITIONS.Q]),
            //         'P': new Set(constants.WHITE_STARTING_PIECE_POSITIONS.P),
            //     },
            // },
            // TODO pieceIsAttackingMap,
            // TODO pieceIsAttackedByMap, 
            // pieceBitmaps: {},
            squareProps: [],
            kingPositions: {
                'L': -1,
                'D': -1,
            },
            squaresAttackedByBlack: 0n,
            squaresAttackedByWhite: 0n,
            attackerToDefenderMap: {},
            castlingRights: {
                LK: false,
                LQ: false,
                DK: false,
                DQ: false,
            },
            enPassantTargetSquare: null,
            squareSelected: null,
            squareSelectedLegalMoves: undefined,
            squareAltSelected: null,
            whiteToPlay: false,
            FEN: '',
            history: [],
            plyNumber: 0,
            halfmoveClock: 0, // TODO implement 50-ply rule 
            enableDragAndDrop: true,
            highlightLegalMoves: true,
            isBoardFlipped: false,
        }

        // not necessary ... because they are arrow functions 
        // more modern JS/TS method where `this` is lexically scoped to the class instance 
        // and doesn't need to be bound explicitly
        // this.handleSquareClick = this.handleSquareClick.bind(this);
        // this.handleSquareRightClick = this.handleSquareRightClick.bind(this);
        // this.handleUndoClick = this.handleUndoClick.bind(this);
    }

    componentDidMount(): void {
        if (this.startingFEN) {
            // this.generateBoardStateFromFen(this.startingFEN);
            helpers.initializeState(this, this.startingFEN);
        } else {
            helpers.initializeState(this);
        }
    }

    getLegalMoves = (squareId: number): number[] => {
        const keycode = this.state.pieceKeys[squareId];
        if (keycode === undefined || keycode === "") {
            return [];
        }
        const [playerCode, pieceCode] = keycode.split('');
        if (this.state.whiteToPlay && playerCode !== 'L') {
            return []; 
        }

        // TODO first, if we're in check, we have three options:
        //   1. capture the checking piece if possible
        //   2. block the checking piece if possible
        //   3. move the king if possible
        // If none of these are possible, it's checkmate
        // If we are in a *double* check, we *must* move the king. 

        let validMoves: number[] = [];

        if (constants.validPieces.includes(pieceCode)) {
            const keycodeMapKey = keycode as keyof typeof keycodeToComponent;
            const piece = keycodeToComponent[keycodeMapKey];
            // const piece = getPieceTypeByKeycode(keycodeMapKey); // for some reason, this makes the spread argument 
            // // in the piece.generatePieceValidMoveTargets method call error: spread arg must have tuple type 
            // // or be passed as a rest parameter ?? 
            const baseFunctionArgs: [number, string[]] = [squareId, this.state.pieceKeys.slice()];
            let additionalFunctionArgs: any[] = [];
            if (pieceCode === 'K') {
                // let additionalFunctionArgs: [number[]?, {}?, boolean?, Game?] = [undefined, undefined, undefined, undefined];
                additionalFunctionArgs = [
                    undefined, // directions
                    {}, // un-named object input (distance, validators, etc.)
                    true, // includeCastling
                    this, // currentGameState
                ]
            } else if (pieceCode === 'P') {
                additionalFunctionArgs = [
                    undefined, // directions 
                    {}, // object with distance, validators, includeNonCaptures, includeCapturesOf
                    this.state.enPassantTargetSquare || undefined, // enPassantTargetSquare
                ];
            }
            validMoves = piece.generatePieceValidMoveTargets(...baseFunctionArgs, ...additionalFunctionArgs)
        } 

        const legalMoves = validMoves.filter((targetMove) => {
            const move: Move = {
                squareMovedFrom: squareId,
                squareMovedTo: targetMove,
                pieceMoving: pieceCode as PieceKey,
                playerMoving: playerCode as PlayerKey,
            }
            return !helpers.wouldOwnKingBeInCheckAfterMove(
                move,
                // squareId, 
                // targetMove, 
                this
            )
        });

        return legalMoves;
    }

    getNewGameHistoryItem = (movePlayed: Move): HistoryItem => { // void 
        const { squareProps, history, squareSelected, squareSelectedLegalMoves, squareAltSelected, ...filteredGameState} = this.state; // destructure state to take snapshot of partial state
        // removed FEN from filtered props 
        const { squareMovedFrom, squareMovedTo } = movePlayed;
        const newGameHistoryItem: HistoryItem = {
            gameStateSnapshot: { ...filteredGameState },
            AN: helpers.generateMoveAN(movePlayed, this),
            JN: helpers.generateMoveJN(movePlayed),
            INN: helpers.generateMoveINN(movePlayed),
        };
        return newGameHistoryItem;
    }

    getNewKingPositionsAndCastlingRights = (move: Move, castlingRights?: CastlingRights): {
        castlingRights?: CastlingRights,
        kingPositions?: KingPositions,
        // [key: string]: any,
    } => {
        const { squareMovedFrom, squareMovedTo, pieceMoving, playerMoving } = move;
        // if we don't have any input argument, try to pull from state,
        // if no state is found, assume all were true 
        if (!castlingRights) {
            if (this.state.castlingRights) {
                castlingRights = this.state.castlingRights;
            } else {
                castlingRights = {
                    LQ: true,
                    LK: true,
                    DQ: true,
                    DK: true,
                }
            }
        }
        // let newStateKVPs: { [key: string]: any } = {};
        let newStateKVPs: {
            castlingRights: CastlingRights,
            kingPositions: KingPositions,
            // [key: string]: any,
        } = {
            // todo remove castlingRights from function arg, use state? 
            castlingRights, // will this update with assignments to castlingRights, or do i have to assign at the end? 
            kingPositions: this.state.kingPositions,
        };
        let kingPositions: KingPositions = this.state.kingPositions;
        if (pieceMoving === 'K') {
            castlingRights[`${playerMoving}K`] = false;
            castlingRights[`${playerMoving}Q`] = false;
            if (!helpers.isMoveCastling(move)) {
                kingPositions[playerMoving] = squareMovedTo;
            } else {
                const directionFromKing = squareMovedFrom < squareMovedTo ? 1 : -1;
                const squareIdOfKingAfterCastling = squareMovedFrom + directionFromKing * 2;
                kingPositions[playerMoving] = squareIdOfKingAfterCastling;
            }
            newStateKVPs.kingPositions = kingPositions;
        }

        // TODO use constants, anticipate variants 
        if (pieceMoving === 'R' || [63, 56, 7, 0].includes(squareMovedTo)) {
            if (
                (playerMoving === 'L' && squareMovedFrom === 63) ||
                (playerMoving === 'D' && squareMovedTo === 63)
            ) {
                castlingRights.LK = false;
            } else if (
                (playerMoving === 'L' && squareMovedFrom === 56) ||
                (playerMoving === 'D' && squareMovedTo === 56)
            ) {
                castlingRights.LQ = false;
            } else if (
                (playerMoving === 'D' && squareMovedFrom === 7) ||
                (playerMoving === 'L' && squareMovedTo === 7)
            ) {
                castlingRights.DK = false;
            } else if (
                (playerMoving === 'D' && squareMovedFrom === 0) ||
                (playerMoving === 'L' && squareMovedTo === 0)
            ) {
                castlingRights.DQ = false;
            }
            // newStateKVPs.castlingRights = castlingRights; 
            // // TODO necessary since we assigned func arg to return obj at the start? Idts... we'll see 
            // // seems like no 
        }
        return newStateKVPs;
    }

    deselectAndRemoveHighlightFromAllSquares = (): void => {
        this.setState({
            ...this.state,
            squareSelected: null,
            squareSelectedLegalMoves: undefined,
            squareAltSelected: null,
            squareIdOfPawnPromotion: undefined,
            squareProps: this.state.squareProps.map((oldProps) => {
                return {
                    ...oldProps,
                    isHighlighted: false,
                    isSelected: false,
                    isAltHighlighted: false,
                    isAltSelected: false,
                    isPromoting: false,
                    // squareIdOfPawnPromotion: undefined,
                    promotionSquare: undefined,
                }
            }),
        });
    }

    selectSquareAndHighlightAllLegalMoves = (squareToSelect: number, legalMovesToHighlight: number[]): void => {
        this.setState({
            ...this.state,
            squareSelected: squareToSelect,
            squareSelectedLegalMoves: new Set<number>(legalMovesToHighlight),
            squareAltSelected: null,
            squareIdOfPawnPromotion: undefined,
            squareProps: this.state.squareProps.map((oldProps, squareId) => {
                const shouldHighlight = this.state.highlightLegalMoves && legalMovesToHighlight.includes(squareId);
                const shouldSelect = (squareId === squareToSelect);
                return {
                    ...oldProps,
                    isHighlighted: shouldHighlight,
                    isSelected: shouldSelect,
                    isAltHighlighted: false,
                    isAltSelected: false,
                    isPromoting: false,
                    // squareIdOfPawnPromotion: undefined,
                    promotionSquare: undefined,
                }
            }),
        });
    }

    applyMoveAndUpdateState = (move: Move) => {
        const { squareMovedFrom, squareMovedTo, pieceMoving } = move;
        const newPieceKeys = helpers.getNewPieceKeysCopyWithMoveApplied(this.state.pieceKeys, move);
        // const newFEN = helpers.generateFENFromGameState()
        // TODO be able to generate FEN from relevant state objects, allow method to use future board state 
        // TODO try removing castlingRights argument below 
        const { castlingRights, kingPositions } = this.getNewKingPositionsAndCastlingRights(move); 
        
        let enPassantTargetSquare: number | null = null;
        if (pieceMoving === 'P' && Math.abs(squareMovedFrom! - squareMovedTo) === 16) {
            enPassantTargetSquare = Math.floor((squareMovedFrom! + squareMovedTo) / 2);
        }

        let newHalfmoveClock = this.state.halfmoveClock + 1;
        if (pieceMoving === 'P' || this.state.pieceKeys[squareMovedTo] !== '') {
            newHalfmoveClock = 0;
        }

        const newHistoryItem = this.getNewGameHistoryItem(move);

        const newFEN = helpers.generateFENFromGameState({
            pieceKeys: newPieceKeys,
            whiteToPlay: !this.state.whiteToPlay,
            castlingRights,
            enPassantTargetSquare,
            halfmoveClock: newHalfmoveClock,
            plyNumber: this.state.plyNumber + 1,
        })
        // TODO maintain piecePositions, bitmaps etc. and be sure to factor in pawn promotions to new pieces 

        this.setState({
            ...this.state,
            pieceKeys: newPieceKeys as SquareKeycode[],
            squareProps: this.state.squareProps.map((squareProps, squareId) => {
                const newKeycode = newPieceKeys[squareId];
                return {
                    ...squareProps,
                    keycode: newKeycode,
                    isHighlighted: false,
                    isAltHighlighted: false,
                    isSelected: false,
                    isAltSelected: false,
                    isPromoting: false,
                    // squareIdOfPawnPromotion: undefined,
                    promotionSquare: undefined, 
                }
            }),
            FEN: newFEN,
            castlingRights, // we already based our input on this.state.castlingRights, no worry of lost info here?? 
            kingPositions: kingPositions || this.state.kingPositions,
            squareSelected: null,
            squareSelectedLegalMoves: undefined,
            squareAltSelected: null,
            squareIdOfPawnPromotion: undefined,
            whiteToPlay: !this.state.whiteToPlay,
            plyNumber: this.state.plyNumber + 1,
            halfmoveClock: newHalfmoveClock,
            enPassantTargetSquare, // when you use the same name as the state variable, it automatically unwraps 
            history: this.state.history.concat([newHistoryItem]),
        });
    }

    // handleSquareClick = async (squareId: number, event?: Event): Promise<void> => {
    handleSquareClick = (squareId: number, event?: Event): void => {
        // clicking the same square again removes all highlighting and selections 
        if (this.state.squareSelected === squareId) {
            this.deselectAndRemoveHighlightFromAllSquares();
            return;
        }
        // otherwise, we're either clicking on a square for the first time, or clicking on a different square 
        // disallow multi-piece selection for now 

        // if we clicked on an un-highlighted and unselected square square
        // we're either clicking on a square for the first time, 
        // or a square that is not a legal move of whichever piece/square is highlighted,
        // then we just apply the selection and highlighting to prepare for the next click
        // if (this.state.squareSelected === null || !this.state.squareProps[squareId].isHighlighted) {
        if (this.state.squareSelected === null || !this.state.squareSelectedLegalMoves?.has(squareId)) {
            // select an unselected and unhighlighted square and highlight the legal moves for that piece on this turn 
            const isThisPlayersMove = this.state.whiteToPlay !== (this.state.pieceKeys[squareId]?.charAt(0) === 'D');
            // console.log(this.state.enPassantTargetSquare);
            const squaresToHighlight = isThisPlayersMove ? this.getLegalMoves(squareId) : [];
            this.selectSquareAndHighlightAllLegalMoves(squareId, squaresToHighlight);
            return;
        }

        // otherwise, a square is already selected, and we clicked on one of its legal move squares 
        // Move piece at selected square to clicked highlighted square
        // *UNLESS* it is a pawn promotion, then we just update the isPromoting prop without moving the piece 
        // or making other state updates, just yet (until we know what it promotes to)

        // by the time we get here in this method, squareMovedFrom can't be null 
        const squareMovedFrom: number = this.state.squareSelected!; 
        const squareMovedTo: number = squareId;
        const [playerMoving, pieceMoving] = this.state.pieceKeys[squareMovedFrom].split('');

        const isPromoting = pieceMoving === 'P' && Math.floor(squareMovedTo / 8) === (this.state.whiteToPlay ? 0 : 7);
        if (isPromoting) {
            this.handleAttemptPawnPromotion(squareMovedTo, event);
            return;
        }

        // if we make it here, we are applying a legal move to the board and updating state 
        const movePlayed: Move = {
            squareMovedFrom,
            squareMovedTo,
            pieceMoving: pieceMoving as PieceKey,
            playerMoving: playerMoving as PlayerKey,
        }
        this.applyMoveAndUpdateState(movePlayed);
        return;
    }

    handleSquareRightClick = (event: React.MouseEvent | null, squareId: number): void => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        // squareId provided from Square component
        // console.log('Right-click on square:', squareId, event);
        // If you need to call any DOM/test helpers, do so here. e.g. event.target.testEvent();


        // select an unselected square and highlight the legal moves for that piece on this turn 
        if (squareId !== this.state.squareAltSelected) {
            const squaresToAltHighlight = helpers.getOccupiedSquaresThatCanAttackThisSquare(
                squareId,
                ['L','D'],
                this.state.pieceKeys.slice(),
            );
            this.setState({
                ...this.state,
                squareSelected: null,
                squareSelectedLegalMoves: undefined,
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

    handleAttemptPawnPromotion = (squareMovedTo: number, event?: Event) => {
        // TODO check for auto-queen first, if so just create the Move object and apply it 
        let squareIdOfPawnPromotion: number | null = null;
        squareIdOfPawnPromotion = squareMovedTo;
        let promotionSquare: HTMLButtonElement | undefined; // to use as anchor for promotion piece picker 
        // set to null if it was already set ... trying to get promotion piece picker to show back up if user aborts and then tries again ... SUCCESS 
        if (this.state.squareProps[squareIdOfPawnPromotion].promotionSquare) {
            promotionSquare = undefined;
        } else if (event && event.currentTarget instanceof HTMLButtonElement) {
            promotionSquare = event?.currentTarget;
        }
        this.setState({
            ...this.state,
            squareProps: this.state.squareProps.map((squareProps, squareId) => {
                return {
                    ...squareProps,
                    isPromoting: (squareId === squareIdOfPawnPromotion && promotionSquare !== undefined),
                    // squareIdOfPawnPromotion,
                    promotionSquare: (squareId === squareIdOfPawnPromotion) ? promotionSquare : undefined,
                }
            }),
            squareIdOfPawnPromotion,
        });
    }

    // this is the second stage of pawn promotion, after the user selected which piece to promote to. 
    // these squares have a different onSquareClick handler that propagates back up here 
    // first stage is displaying the piece picker, or auto-queening if the setting is configured
    handlePawnPromotionPieceSelected = (pieceSelected: string) => {
        // console.log(`Handling promotion from Game: squareId: ${squareId}; pieceSelected: ${pieceSelected}; event: ${event}`);
        // treat this as a move as is done above in handleSquareClick, updating all necessary state 
        // squareId is NOT relevant info... // TODO remove squareId and event from passed parameters 
        const squareMovedFrom: number = this.state.squareSelected!; 
        const squareMovedTo: number = this.state.squareIdOfPawnPromotion!; // store squareIdOfPawnPromotion in state
        // const [playerMoving, pieceMoving] = this.state.pieceKeys[squareMovedFrom].split('');
        const playerMoving = this.state.pieceKeys[squareMovedFrom].charAt(0);
        const pieceToPromoteTo = pieceSelected;
        const movePlayed: Move = {
            squareMovedFrom,
            squareMovedTo,
            pieceMoving: pieceToPromoteTo as PieceKey,
            playerMoving: playerMoving as PlayerKey,
            promotingTo: pieceSelected as PromotionOptionsPieceKey,
        }

        this.applyMoveAndUpdateState(movePlayed);
    }

    undoLastMove = (): void => {
        if (!this.state.history || this.state.history.length === 0) return;

        const lastHistoryItem = this.state.history.pop(); // TODO don't get rid of it,
        // // maybe make side-lines or store analysis positions ... highlight current move in history list 
        if (!lastHistoryItem) return;
        
        const newHistory = this.state.history.slice();

        this.setState({
            ...lastHistoryItem.gameStateSnapshot,
            history: newHistory,
            squareSelected: null,
            squareSelectedLegalMoves: undefined,
            squareAltSelected: null,
            // FEN: '',
            squareProps: lastHistoryItem.gameStateSnapshot.pieceKeys.map((keycode, index) => {
                return {
                    keycode: keycode,
                    id: index,
                    isHighlighted: false,
                    isAltHighlighted: false,
                    isSelected: false,
                    isAltSelected: false,
                    isPromoting: false,
                    // squareIdOfPawnPromotion: undefined,
                    promotionSquare: undefined,
                }
            }),
            squareIdOfPawnPromotion: undefined,
        });
    }

    handleUndoClick = (event?: React.SyntheticEvent | null): void => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();

        if (!this.state.history || this.state.history.length === 0) return;
        this.undoLastMove();
    }

    handleRedoClick = (event?: React.SyntheticEvent | null): void => {
        console.error("Not implemented");
        // throw Error("Not implemented");
    }

    handleResetClick = (event?: React.MouseEvent | React.SyntheticEvent | undefined): void => {
        helpers.initializeState(this);
    }

    handleSendGameClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
            event.stopPropagation();
        }
        // // if (this.props.handleUndoClick) this.props.handleUndoClick(); // this.props.handleUndoClick(event);
        // this.setState({
        //     ...this.state,
        //     enableDragAndDrop: !this.state.enableDragAndDrop,
        // })
    }

    // handleRedoClick(event: Event) {
    // handleUploadClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    handleUploadClick = (FENstring: string, event?: React.SyntheticEvent) => {
        if (FENstring && helpers.doesStringMatchPatternFEN(FENstring)) {
            const newStateKVPs = helpers.getNewBoardStateKVPsFromFen(FENstring);
            this.setState({
                ...newStateKVPs as GameState, // TODO use Partial?? 
            })
        } else {
            console.warn(`Invalid FEN string provided: ${FENstring}`);
        }
    }

    handleDownloadClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
        // console.log('Board#handleResetClick');

        // this.props.handleResetClick();
    }

    handleGetInfoClick: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
        if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
        event.stopPropagation();
        }

        // helpers.generateFENFromGameState(this);
        // TODO popup 
    }

    flipBoard: MouseEventHandler<HTMLButtonElement> = (event) => { // (event: Event) {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
            event.stopPropagation();
        }
        // console.log("Flipping board...");
        this.setState({
            ...this.state,
            isBoardFlipped: !this.state.isBoardFlipped, 
        })
    }

    handleUpdateSettings = (key: string, newValue?: any) => {
        if (!(key in this.state)) return;
        const oldValue: any = this.state[key as keyof GameState];
        console.log(`Updating game.state.${key} from ${oldValue} to ${newValue}`);
        if (newValue) {
            this.setState({
                ...this.state,
                [key]: newValue,
            });
        } else {
            if (typeof oldValue === 'boolean') {
                this.setState({
                    ...this.state,
                    [key]: !oldValue,
                });
            } else {
                console.warn(`Updating game state for a non-boolean value with no newValue provided. 
                    Setting ${key} state property to undefined... This may cause problems with type mismatches.
                    This is not advised.`);
                this.setState({
                    ...this.state,
                    [key]: undefined,
                });
            }
        }
    }

    // handleGoToMoveClick

    render() {
        // boardPropHandlers: ((...args: any[]) => any)[] = [];
        // let boardPropHandlers: { [handlerName: string]: any } = {};
        let boardPropHandlers: Partial<BoardProps> = {};
        boardPropHandlers.handleSquareClick = this.handleSquareClick;
        boardPropHandlers.handleSquareRightClick = this.handleSquareRightClick;
        boardPropHandlers.onPromote = this.handlePawnPromotionPieceSelected;
        boardPropHandlers.handleUndoClick = this.handleUndoClick;
        boardPropHandlers.handleRedoClick = this.handleRedoClick;
        boardPropHandlers.handleResetClick = this.handleResetClick;
        boardPropHandlers.handleGetFENClick = (() => helpers.generateFENFromGameState(this)); 
        // let boardPropVars: { [propName: string]: any } = {};
        let boardPropVars: Partial<BoardProps> = {};
        boardPropVars.squareProps = this.state.squareProps;
        boardPropVars.boardSize = 'boardSize' in this ? this.boardSize as number : 8;
        boardPropVars.isBoardFlipped = this.state.isBoardFlipped;
        boardPropVars.enableDragAndDrop = this.state.enableDragAndDrop;
        const boardProps: BoardProps = { ...boardPropHandlers, ...boardPropVars } as BoardProps; 
        // turn partials back into whole ... TODO always verify all props are present... 
        // const boardToRender: Element = this.state.enableDragAndDrop ? DraggableDroppableBoard(boardProps) : React.createElement(Board, boardProps); // new Board(boardProps); // Board | typeof DraggableDroppableBoard (Element) ?? 
        return (
            <div className="game">
                <div className="board-container">
                    {/* {
                        boardToRender
                    } */}
                    {
                        this.state.enableDragAndDrop ? (<DraggableDroppableBoard {...boardProps} />) : (<Board {...boardProps}/>)
                    }
                    <BoardControlPanel
                        onGetInfoClick={this.handleGetInfoClick}
                        onUpdateSettings={this.handleUpdateSettings}
                        onUploadClick={this.handleUploadClick}
                        onDownloadClick={this.handleDownloadClick}
                        currentFEN={this.state.FEN}
                        onSendGameClick={this.handleSendGameClick}
                        onFlipBoard={this.flipBoard}
                        enableDragAndDrop={this.state.enableDragAndDrop}
                        highlightLegalMoves={this.state.highlightLegalMoves}
                    />
                </div>
                <GameStatus
                    whiteToPlay={this.state.whiteToPlay}
                    history={this.state.history}
                    handleUndoClick={this.handleUndoClick}
                    handleRedoClick={this.handleRedoClick}
                    handleResetClick={this.handleResetClick}
                />
                <GameNotes
                    zobristHash=''
                    metadata={{}}
                />
            </div>
        );
    }
}
