export const DIR: { [key: string]: number } = {
    N: -8,
    S: 8,
    E: 1,
    W: -1,
    NW: -9,
    NE: -7,
    SW: 7,
    SE: 9,
};

export const validPieces: string[] = ['R','N','B','Q','K','P'];
export const validPlayers: string[] = ['L','D'];

export enum PLAYER {
    WHITE = 'L', 
    BLACK = 'D',
};

export const defaultBoardSize: number = 8;

// starting position in Forsyth-Edwards Notation 
export const defaultStartingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; 

// default starting back rank order
export const defaultStartingBackRank: string[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
