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

// Note: The below pattern validates the structure and allowed characters of a FEN string but does not check for logical game rules, 
// such as valid run-length encoding (e.g., a rank can sum to more than 8 squares with a simple regex) or if the position is even legal within the rules of chess. 
export const googleGeminiMatcher: RegExp = 
    /^(((?<PiecePlacement>([pnbrqkPNBRQK1-8]+\/){7}[pnbrqkPNBRQK1-8]+))\s(?<SideToMove>[bw])\s(?<Castling>-|[KQkq]+)\s(?<EnPassant>-|[a-h][36])\s(?<HalfMoveClock>\d+)\s(?<FullMoveNumber>\d+))$/;

// starting position in Forsyth-Edwards Notation 
export const defaultStartingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; 

// default starting back rank order
export const defaultStartingBackRank: string[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
