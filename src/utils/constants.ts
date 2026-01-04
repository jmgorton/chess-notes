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

export const BLACK_STARTING_PIECE_POSITIONS = {
    KR: 0,
    KN: 1,
    KB: 2,
    Q: 3,
    K: 4,
    QB: 5,
    QN: 6,
    QR: 7,
    P: [8,9,10,11,12,13,14,15],
}

export const WHITE_STARTING_PIECE_POSITIONS = {
    KR: 63,
    KN: 62,
    KB: 61,
    K: 60,
    Q: 59,
    QB: 58,
    QN: 57,
    QR: 56,
    P: [48,49,50,51,52,53,54,55],
}

export const STARTING_BITMAPS = {
    L: {
        P: 0x000000000000ff00n, // 6th (7th) rank full of 1s
        N: 0x0000000000000042n,
        B: 0x0000000000000024n,
        R: 0x0000000000000081n,
        Q: 0x0000000000000010n,
        K: 0x0000000000000008n,
    },
    D: {
        P: 0x00ff000000000000n, // 1st (2nd) rank full of 1s
        N: 0x2400000000000000n,
        B: 0x4200000000000000n,
        R: 0x1800000000000000n,
        Q: 0x1000000000000000n,
        K: 0x0800000000000000n,
    }
}

export const defaultBoardSize: number = 8;

// Note: The below pattern validates the structure and allowed characters of a FEN string but does not check for logical game rules, 
// such as valid run-length encoding (e.g., a rank can sum to more than 8 squares with a simple regex) or if the position is even legal within the rules of chess. 
export const googleGeminiMatcher: RegExp = 
    /^(((?<PiecePlacement>([pnbrqkPNBRQK1-8]+\/){7}[pnbrqkPNBRQK1-8]+))\s(?<SideToMove>[bw])\s(?<Castling>-|[KQkq]+)\s(?<EnPassant>-|[a-h][36])\s(?<HalfMoveClock>\d+)\s(?<FullMoveNumber>\d+))$/;

// starting position in Forsyth-Edwards Notation 
export const defaultStartingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; 

// default starting back rank order
export const defaultStartingBackRank: string[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
