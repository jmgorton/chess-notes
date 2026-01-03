// Type definitions and interfaces 

import React, { MouseEventHandler, Ref } from 'react';

export type GameProps = Record<string, unknown>;

// export interface GameProps {
//     // variant: Variant;
//     // opponent: Opponent;
// }

export interface GameState {
    pieceKeys: string[];
    squareProps: SquareProp[];

    lightKingPosition: number;
    darkKingPosition: number;
    lightKingHasShortCastlingRights: boolean;
    lightKingHasLongCastlingRights: boolean;
    darkKingHasShortCastlingRights: boolean;
    darkKingHasLongCastlingRights: boolean;
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

export type PieceProps = Record<string, unknown>;

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