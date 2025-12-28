// import GameProps from '../components/Game';
// import GameState from '../components/Game';

// // ********* GETTERS *********
// // ***** and generators *****

// this method is called before this move is applied to state, still current player's turn 
// IS DEPENDENT ON CURRENT BOARD STATE 
// export const generateMoveAN = (component: React.Component<GameProps, GameState>, squareMovedFrom: number, squareMovedTo: number): string => { // , futureBoardState = this.state.pieceKeys) => {
//     // TODO error handling 
//     if (!component) {
//         console.error("Component was null or undefined in helpers#generateMoveAN");
//         throw new Error('Component was null or undefined');
//     }
//     if (!component.state) {
//         console.error("Component argument had no state attribute in helpers#generateMoveAN");
//         throw new Error('Component has no state attribute');
//     }
//     if (!component.state.pieceKeys) {
//         console.error("Component state had no pieceKeys attribute in helpers#generateMoveAN");
//         throw new Error('Component has no pieceKeys state');
//     }
//     const futureBoardState = component.getNewPieceKeysCopyWithMoveApplied(squareMovedFrom, squareMovedTo);
//     const currentBoardState = component.state.pieceKeys.slice();
//     let [playerCode, pieceCode] = currentBoardState[squareMovedFrom].split(''); // [null, null]; // futureBoardState[squareMovedTo].split('');
//     if (playerCode === null && pieceCode === null) { // null !== undefined ... SMH 
//       // this shouldn't happen, remnant of previous approach 
//       [playerCode, pieceCode] = futureBoardState[squareMovedTo].split('');
//     }

//     const isEnPassantCapture = component.isMoveEnPassant(squareMovedFrom, squareMovedTo); // uses current board state, move not applied yet 
//     const isCapture = (currentBoardState[squareMovedTo] !== '' || isEnPassantCapture ? 'x' : ''); 
//     const opponent = component.state.whiteToPlay ? 'b' : 'w';
//     const isCheck = component.isKingInCheck(opponent, futureBoardState) ? '+' : ''; // TODO or checkmate 
//     // const isPawnPromotion = '=[Q,R,B,N]'; // TODO implement 

//     const destinationFile = 'abcdefgh'.charAt(squareMovedTo % 8);
//     const destinationRank = 8 - Math.floor(squareMovedTo / 8); // remember that our 0-63 is kind of backwards, and 0-indexed 

//     const movesThatNecessitateFurtherClarification = component.getSquaresWithPiecesThatCanAttackThisSquare(squareMovedTo, true, null, null, futureBoardState) // get all pieces incl. self-attacks 
//       .filter((squareId: number) => futureBoardState[squareId].charAt(0) === playerCode) // filter out non-self-attacks (opponent attacks)
//       .filter((squareId: number) => futureBoardState[squareId].charAt(1) === pieceCode) // get only self-attacks from the same type of piece 
//       .filter((squareId: number) => squareId !== squareMovedFrom); // state issue TODO fix ... including this piece 

//     // console.log(movesThatNecessitateFurtherClarification);

//     if (movesThatNecessitateFurtherClarification.length === 0) {
//       if (pieceCode === 'P') {
//         if (isCapture !== '') {
//           const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
//           return `${sourceFile}x${destinationFile}${destinationRank}${isCheck}`;
//         }
//         return `${destinationFile}${destinationRank}${isCheck}`;
//       }
//       return `${pieceCode}${isCapture}${destinationFile}${destinationRank}${isCheck}`;
//     } else {
//       // if (movesThatNecessitateFurtherClarification.length > 1) {
//       //   // this can actually be kind of complicated, for example if one or some of the pieces are pinned, 
//       //   // or promoting several pawns to knights and all (up to 4) attack the same square but have different rank *and* file
//       //   // for rooks, bishops, (even queens? no...) just default with sourceFile,
//       //   // use sourceRank if necessary due to duplicate identical sourceFile options, or use both of both have dupes 
//       //   const sourceFile
//       //   return 
//       // }
//       const sourceFile = 'abcdefgh'.charAt(squareMovedFrom % 8);
//       const sourceRank = 8 - Math.floor(squareMovedFrom / 8);
//       let dupeSourceFiles = false;
//       let dupeSourceRanks = false;
//       // for (const altMove in movesThatNecessitateFurtherClarification.items()) {
//       for (let i = 0; i < movesThatNecessitateFurtherClarification.length; i++) {
//         const altMove = movesThatNecessitateFurtherClarification[i];
//         // check if piece move is actually legal here??? could expose a check 
//         // if (this.wouldOwnKingBeInCheckAfterMove(altMove, squareMovedTo)) continue; 
//         const altSourceFile = 'abcdefgh'.charAt(altMove % 8);
//         const altSourceRank = 8 - Math.floor(altMove / 8);
//         dupeSourceFiles = dupeSourceFiles || (sourceFile === altSourceFile);
//         dupeSourceRanks = dupeSourceRanks || (sourceRank === altSourceRank);
//         // console.log(`\tPiece at ${altMove} results in dupeSourceFiles:${dupeSourceFiles} (file:${altSourceFile}) and dupeSourceRanks:${dupeSourceRanks} (rank:${altSourceRank})`);
//       }
//       const pieceClarification = dupeSourceFiles ? (dupeSourceRanks ? `${sourceFile}${sourceRank}` : `${sourceRank}`) : `${sourceFile}`;
//       return `${pieceCode}${pieceClarification}${isCapture}${destinationFile}${destinationRank}${isCheck}`;
//     }
// }

// not dependent on current board state
export const generateMoveJN = (squareMovedFrom: number, squareMovedTo: number): string => {
    return `${String(squareMovedFrom).padStart(2, '0')}${String(squareMovedTo).padStart(2, '0')}`;
}

// not dependent on current board state
export const generateMoveINN = (squareMovedFrom: number, squareMovedTo: number): string => {
    // squareMovedFrom, squareMovedTo passed in as squareId values from 0-63
    const fromRank = Math.floor(squareMovedFrom / 8); // TODO ranks are backwards 
    const fromFile = squareMovedFrom % 8;
    const toRank = Math.floor(squareMovedTo / 8); // TODO ranks are backwards 
    const toFile = squareMovedTo % 8;
    return `${fromRank}${fromFile}${toRank}${toFile}`;
}

// export const getNewPieceKeysCopyWithMoveApplied = (component: React.Component<any, any>, squareMovedFrom: number, squareMovedTo: number): string[] => {
//     const pieceMoving = component.state.pieceKeys[squareMovedFrom];
//     let squareIdOfPawnCapturedViaEnPassant = null;
//     let squareIdOfKingAfterCastling = null;
//     let squareIdOfRookAfterCastling = null;
//     let castlingRook = null;
//     // copy the array before mutating so React sees a new reference
//     let newPieceKeys = component.state.pieceKeys.slice();

//     if (component.isMoveEnPassant(squareMovedFrom, squareMovedTo)) {
//         // alert("An en passant occurred...");
//         squareIdOfPawnCapturedViaEnPassant = squareMovedTo + -8 * (pieceMoving.charAt(0) === 'L' ? -1 : 1);
//         newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
//         newPieceKeys[squareMovedFrom] = "";
//         newPieceKeys[squareMovedTo] = pieceMoving;
//     } else if (component.isMoveCastling(squareMovedFrom, squareMovedTo)) {
//         // indicates that the king is castling 
//         let directionFromKing = 1;
//         if (squareMovedTo < squareMovedFrom) directionFromKing = -1;
//         castlingRook = component.state.pieceKeys[squareMovedTo];
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

// // ********* SETTERS *********

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