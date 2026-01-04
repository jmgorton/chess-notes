// Type definitions and interfaces 

import React, { MouseEventHandler, Ref } from 'react';
import Piece from '../components/Piece';

export type GameProps = Record<string, unknown>;

// export interface GameProps {
//     // variant: Variant;
//     // opponent: Opponent;
// }

export type PlayerKey = 'L' | 'D';

export type RoyalKey = 'LK' | 'LQ' | 'DK' | 'DQ';
export type NonKingPieces = 'Q' | 'R' | 'B' | 'N' | 'P';
export type KingPieces = 'K';

export type PiecePositions = {
    L: {
        [key in NonKingPieces]: Set<number>;
        // [key in KingPieces]: number;
    };
    D: {
        [key in NonKingPieces]: Set<number>;
    }
}

export type KingPositions = {
    L: number;
    D: number;
}

export type CastlingRights = {
    [key in RoyalKey]: boolean;
}

export interface GameState {
    pieceKeys: string[];
    // piecePositions: Map<string, Map<string, number[]>>;
    piecePositions?: { [player: string]: { [piece: string]: Set<number> }}; // number[] not as good 
    // piecePositions: PiecePositions;
    // kingPositions: KingPositions;
    kingPositions: { [key in PlayerKey]: number };
    pieceBitmaps?: { [player: string]: bigint };
    squareProps: SquareProp[];

    lightKingPosition: number; // TODO remove in lieu of piecePositions 
    darkKingPosition: number; // TODO remove 

    lightKingHasShortCastlingRights: boolean; // TODO remove in lieue of castlingRights 
    lightKingHasLongCastlingRights: boolean; 
    darkKingHasShortCastlingRights: boolean;
    darkKingHasLongCastlingRights: boolean; // TODO remove 

    // castlingRights: { [key: 'LK' | 'LQ' | 'DK' | 'DQ']: boolean }; // This doesn't work
    castlingRights?: { [key in RoyalKey]: boolean }; // This does work 
    // castlingRights: CastlingRights;

    // squares under attack by side
    // is it worth separating this further into squares attacked by piece? 
    // that could come back to bite me, e.g. if i want to track pins
    // this can also be done nicely with bitmaps ... stick to that for now 
    // Hmm... no, a huge speed-up would be achieved by mapping each piece
    // (probably by square id) to all pieces it makes contact with... 
    // maintaining this can actually get fairly complicated when you include 
    // weird moves like en-passant, promotions, and castling 

    squaresAttackedByWhite?: bigint;
    squaresAttackedByBlack?: bigint;

    enPassantTargetSquare: number | null;
    whiteToPlay: boolean;
    FEN: string;
    history: HistoryItem[];
    plyNumber: number;
    halfmoveClock: number;

    squareSelected?: number | null;
    squareAltSelected?: number | null;
    enableDragAndDrop?: boolean;
}

export interface GameStatusProps {
    whiteToPlay: boolean;
    history: HistoryItem[];
    handleUndoClick: (event?: React.SyntheticEvent | null) => void;
    handleRedoClick: (event?: React.SyntheticEvent | null) => void; 
    handleResetClick: (event?: React.MouseEvent | React.SyntheticEvent | undefined) => void;
}

export interface GameStatusState {

}

export interface BoardProps {
    squareProps: SquareProp[];
    handleSquareClick: (squareId: number, event?: Event) => Promise<void>; // (event: Event) => void; // ={this.handleSquareClick}
    handleSquareRightClick: (event: React.MouseEvent | null, squareId: number) => void; // (event: Event) => void; // ={this.handleSquareRightClick}
    boardSize: number; // ={this.boardSize}
    enableDragAndDrop: boolean;
    // promotionSquare={this.state.promotionSquare}
    handleUndoClick: () => void; // Function; ?? no, that makes it an object, I guess? // ={this.handleUndoClick}
    handleRedoClick: () => void; // ={() => { }}
    handleResetClick: () => void; // Function; // ={() => { }} 
    handleGetFENClick: (event?: React.SyntheticEvent | null, boardState?: string[]) => string;
    // (event?: React.SyntheticEvent | Event | null, boardState?: string[]) => string; // ={this.generateBoardFEN}
}

export interface BoardState {
    isFlipped: boolean;
}

export interface BoardControlPanelProps {
    onGetInfoClick: MouseEventHandler<HTMLButtonElement>; // | ((event: Event) => void) | undefined; 
    onUploadClick: MouseEventHandler<HTMLButtonElement>; // (event: Event) => void; 
    onDownloadClick: MouseEventHandler<HTMLButtonElement>; // (event: Event) => void; 
    onSendGameClick: MouseEventHandler<HTMLButtonElement>; // (event: Event) => void;
    onFlipBoard: MouseEventHandler<HTMLButtonElement>;
}

export interface BoardControlPanelState {

}

export interface SquareProp {
    keycode: string;
    id: number;
    color?: string; // not in Game SquareProp ?? 
    enableDragAndDrop?: boolean;
    droppableId?: string;
    forwardedRef?: Ref<HTMLButtonElement>;
    isHighlighted: boolean;
    isAltHighlighted: boolean;
    isSelected: boolean;
    isAltSelected: boolean;
    isPromoting: boolean;
    promotionSquare?: HTMLButtonElement;
    onSquareClick?: (squareId: number, event?: Event) => PromiseLike<void>; // Promise<void> // not in Game SquareProp ?? 
    onContextMenu?: (event: React.MouseEvent | null, squareId: number) => void; // not in Game SquareProp ?? 
}

export interface SquareState {
    // promotionPiecePicker: React.ReactElement | null;
    // promotionSquare?: HTMLButtonElement,
    // playerPromoting?: string,
}

// export type PieceProps = Record<string, unknown>; 
export interface PieceProps {

}

export type KingSpecificProps = { // or interface? 

}

export type PawnSpecificProps = {

}

// export type PieceState = Record<string, unknown>;

// export type Piece<PieceProps, PieceState> = {
//     props: PieceProps,
//     state: PieceState,
// }

export interface DraggableDroppableChild<T> {
    droppableId?: string;
    forwardedRef?: Ref<T>;
}

// export interface PieceProps {
//     forwardedRef: Ref<HTMLImageElement>;
// }

export interface Move {
    squareMovedFrom: number;
    squareMovedTo: number;
    pieceMoving: string; // Piece
}

export interface MoveEnPassant extends Move {
    squareOfPawnCapturedViaEnPassant: number;
}

export interface MoveCastling extends Move {

}

export interface MovePawnPromotion extends Move {
    // or Square, but do we have to attach the popper to the button ?? 
    promotionSquare: HTMLButtonElement; // Square (DNE yet) 
}

export interface HistoryItem {
    // pieceKeys: string[];
    gameStateSnapshot: GameStateSnapshotItem;
    AN: string | null;
    JN: string | null;
    INN: string | null;
}

// Omit pieceKeys or squareProps ?? minimal info contained in pieceKeys, squareProps can be reconstructed 
// Make a single prop item for board config or something, like squareSelected, etc. ?? 
export type GameStateSnapshotItem = Omit<GameState, 'squareProps' | 'history' | 'squareSelected' | 'squareAltSelected' | 'FEN'>;

export interface Variant {

}