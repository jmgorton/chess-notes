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

// starting position in Forsyth-Edwards Notation 
export const defaultStartingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; 
