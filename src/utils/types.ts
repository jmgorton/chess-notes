// Type definitions and interfaces 

import React, { MouseEventHandler } from 'react';

export type GameProps = Record<string, unknown>;

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
    squareSelected: number | null;
    squareAltSelected: number | null;
    whiteToPlay: boolean;
    FEN: string;
    history: HistoryItem[];
    plyNumber: number;
    //   testState: number;
}

export interface BoardProps {
    squareProps: SquareProp[];
    handleSquareClick: (squareId: number) => Promise<void>; // (event: Event) => void; // ={this.handleSquareClick}
    handleSquareRightClick: (event: React.MouseEvent | null, squareId: number) => void; // (event: Event) => void; // ={this.handleSquareRightClick}
    boardSize: number; // ={this.boardSize}
    // promotionSquare={this.state.promotionSquare}
    handleUndoClick: () => void; // Function; ?? no, that makes it an object, I guess? // ={this.handleUndoClick}
    handleRedoClick: () => void; // ={() => { }}
    handleResetClick: () => void; // Function; // ={() => { }} 
    handleGetFENClick: (event?: React.SyntheticEvent | null, boardState?: string[]) => string;
    // (event?: React.SyntheticEvent | Event | null, boardState?: string[]) => string; // ={this.generateBoardFEN}
}

export interface BoardState {

}

export interface BoardControlPanelProps {
    onUndoClick: MouseEventHandler<HTMLButtonElement>; // | ((event: Event) => void) | undefined; 
    onRedoClick: MouseEventHandler<HTMLButtonElement>; // (event: Event) => void; 
    onResetClick: MouseEventHandler<HTMLButtonElement>; // (event: Event) => void; 
    onGetFENClick: MouseEventHandler<HTMLButtonElement>; // (event: Event) => void;
}

export interface BoardControlPanelState {

}

export interface SquareProp {
    keycode: string;
    id: number;
    color?: string; // not in Game SquareProp ?? 
    isHighlighted: boolean;
    isAltHighlighted: boolean;
    isSelected: boolean;
    isAltSelected: boolean;
    isPromoting: boolean;
    onSquareClick?: (squareId: number) => PromiseLike<void>; // Promise<void> // not in Game SquareProp ?? 
    onContextMenu?: (event: React.MouseEvent | null, squareId: number) => void; // not in Game SquareProp ?? 
}

export interface SquareState {

}

// Type definitions TODO specify with detail 
export type PieceProps = Record<string, unknown>;

export interface HistoryItem {
    pieceKeys: string[];
    AN: string | null;
    JN: string | null;
    INN: string | null;
}