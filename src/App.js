import React from 'react';
import './App.css';

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

// Use public resources so filenames remain predictable in production.
// Put the PNGs in `public/resources` and reference them via PUBLIC_URL.
const PUBLIC = process.env.PUBLIC_URL || '';

const keycodeToIcon = {
  'LR': PUBLIC + '/resources/rlt60.png',
  'LP': PUBLIC + '/resources/plt60.png',
  'LB': PUBLIC + '/resources/blt60.png',
  'LN': PUBLIC + '/resources/nlt60.png',
  'LQ': PUBLIC + '/resources/qlt60.png',
  'LK': PUBLIC + '/resources/klt60.png',
  'DR': PUBLIC + '/resources/rdt60.png',
  'DP': PUBLIC + '/resources/pdt60.png',
  'DB': PUBLIC + '/resources/bdt60.png',
  'DN': PUBLIC + '/resources/ndt60.png',
  'DQ': PUBLIC + '/resources/qdt60.png',
  'DK': PUBLIC + '/resources/kdt60.png',
}

const DIR = {
  N: -8,
  S: 8,
  E: 1,
  W: -1,
  NW: -9,
  NE: -7,
  SW: 7,
  SE: 9,
}

// const validPieces = ['R','N','B','Q','K','P'];
// const validPlayers = ['L','D'];

class Piece extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    // }
    this.handleClick = this.handleClick.bind(this);
    // if (this.state.piececode === 'Q') alert("Piece constructor"); 
  }

  handleClick() {
    // alert("Clicked on a piece: " + this.state.playercode + this.state.piececode + 
    //   " (icon: " + this.state.icon + " | " + keycodeToIcon[this.state.playercode + this.state.piececode]);
  }

  render() {
    return (
      <img 
        src={this.icon} 
        // src={keycodeToIcon[this.state.playercode + this.state.piececode]}
        alt={this.alt} 
        // alt={this.state.playercode + this.state.piececode}
        className="piece" 
        onClick={this.handleClick} 
        zIndex="10"
        // onClick={() => props.onClick(props.id)} // commented out to avoid piece click interfering with square click for now ...
        // both Piece and Square have the same onClick prop passed down from Board via Square
        // onClick={props.onClick} // i think this would pass the event object, not the square id ...
      />
    );
  }
}

class Pawn extends Piece {
  alt = "Pawn";
  piececode = "P";

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   hasMoved: false,
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  // handleClick() {
  //   const squareId = this.props.id;
  //   this.props.onPawnClick(squareId);
  // }
}

class LightPawn extends Pawn {
  alt = "Light Pawn";
  playercode = "L";
  // keycode = "LP";
  icon = keycodeToIcon["LP"];

  // legalMoves = [-8, -16, -7, -9];

  moveDirections = [-8];
  // moveDistance = 2;
  captureDirections = [-7, -9];

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   // hasMoved: false,
    //   // moveDistance: 2,
    //   moves: [-8],
    //   // playercode: "L",
    //   // keycode: "LP",
    //   // icon: keycodeToIcon["LP"],
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // // highlight two squares in front, if legal moves 
    // const squareId = this.props.id;
    // this.props.onPawnClick(squareId);
    super.handleClick();
  }
}

class DarkPawn extends Pawn {
  alt = "Dark Pawn";
  playercode = "D";
  icon = keycodeToIcon["DP"];

  // legalMoves = [8, 16, 7, 9];
  moveDirections = [8];
  // moveDistance = 2; // put in state and alter after first move 
  captureDirections = [7, 9]; // also use state to handle en passant ?? No, but we do need history of moves 

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   playercode: "D",
    //   icon: keycodeToIcon["DP"],
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // highlight two squares in front, if legal moves, considering orientation of board 
    // get id of this piece
    // set isHighlighted state of pieces with id+8, id+16 to true
    super.handleClick();
  }
}

class Knight extends Piece {
  alt = "Knight";
  piececode = "N";

  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   alt: "Knight",
    //   piececode: "N",
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    super.handleClick();
    // alert("Clicked on a Knight");
  }
}

class LightKnight extends Knight {
  alt = "Light Knight";
  playercode = "L";
  icon = keycodeToIcon["LN"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LN"],
  //   // }
  // }
}

class DarkKnight extends Knight {
  alt = "Dark Knight";
  playercode = "D";
  icon = keycodeToIcon["DN"];
  
  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DN"],
  //   // }
  // }
}

class Bishop extends Piece {
  alt = "Bishop";
  piececode = "B";

  moveDirections = [-9, -7, 7, 9];
  moveDistance = 7; // or length of board

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "Bishop",
  //   //   piececode: "B",
  //   // }
  // }
}

class LightBishop extends Bishop {
  alt = "Light Bishop";
  playercode = "L";
  icon = keycodeToIcon["LB"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LB"],
  //   // }
  // }
}

class DarkBishop extends Bishop {
  alt = "Dark Bishop";
  playercode = "D";
  icon = keycodeToIcon["DB"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DB"],
  //   // }
  // }
}

class Rook extends Piece {
  alt = "Rook";
  piececode = "R";

  moveDirections = [-8, -1, 1, 8];
  moveDistance = 7; // or length of board 

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "Rook",
  //   //   piececode: "R",
  //   // }
  // }
}

class LightRook extends Rook {
  alt = "Light Rook";
  playercode = "L";
  icon = keycodeToIcon["LR"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LR"],
  //   // }
  // }
}

class DarkRook extends Rook {
  alt = "Dark Rook";
  playercode = "D";
  icon = keycodeToIcon["DR"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DR"],
  //   // }
  // }
}

class Queen extends Piece {
  alt = "Queen";
  piececode = "Q";

  moveDirections = [-9, -8, -7, -1, 1, 7, 8, 9];
  moveDistance = 7; // or length of board 

  // possibleMoves = [-63, -56, -54, -49, -45, -36, -35, -28, -27, -21, -18, -14, -9, -7, 7, ]
  // possibleMoves = [
  //   [-63, -54, -45, -36, -27, -18, -9],
  //   [-56, -48, -40, -32, -24, -16, -8],
  //   [-49, -42, -35, -28, -21, -14, -7],
  // ]

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   isSelected: false, // this.props.isSelected || false,
  //   // }
  // }
}

class LightQueen extends Queen {
  alt = "Light Queen";
  playercode = "L";
  icon = keycodeToIcon["LQ"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   // }
  // }
}

class DarkQueen extends Queen {
  alt = "Dark Queen";
  playercode = "D";
  icon = keycodeToIcon["DQ"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DQ"],
  //   //   alt: "Dark Queen",
  //   // }
  // }
}

class King extends Piece {
  alt = "King";
  piececode = "K";

  // possibleMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
  moveDirections = [-9, -8, -7, -1, 1, 7, 8, 9];
  moveDistance = 1;

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   alt: "King",
  //   //   piececode: "K",
  //   // }
  // }
}

class LightKing extends King {
  alt = "Light King";
  playercode = "L";
  icon = keycodeToIcon["LK"];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "L",
  //   //   icon: keycodeToIcon["LK"],
  //   // }
  // }
}

class DarkKing extends King {
  alt = "Dark King";
  playercode = "D";
  icon = keycodeToIcon["DK"];

  // possibleMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
  // hmm... some of the validators need to know the layout of the other pieces on the board 
  // moveValidators = [
  //   (target) => target >= 0 && target < 64, // on board
  // ];

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   ...this.state,
  //   //   playercode: "D",
  //   //   icon: keycodeToIcon["DK"],
  //   // }
  // }
}

const keycodeToComponent = {
  // '': div => <div></div>,
  // 'R': Rook,
  // 'N': Knight,
  // 'B': Bishop,
  // 'Q': Queen,
  // 'K': King,
  // 'P': Pawn,
  'LP': LightPawn,
  'LN': LightKnight,
  'LB': LightBishop,
  'LR': LightRook,
  'LQ': LightQueen,
  'LK': LightKing,
  'DP': DarkPawn,
  'DN': DarkKnight,
  'DB': DarkBishop,
  'DR': DarkRook,
  'DQ': DarkQueen,
  'DK': DarkKing,
};

class Square extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   ...this.state,
    //   isHighlighted: this.props.isHighlighted || false,
    //   isSelected: this.props.isSelected || false,
    // }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // this.setState(prevState => ({
    //   ...prevState,
    //   isSelected: !prevState.isSelected,
    // }));

    // if (this.props.keycode === "LP") {
    //   // alert("This is a pawn square, id: " + this.props.id);
    //   this.props.onPawnClick(this.props.id);
    // }

    this.props.onSquareClick(this.props.id);
  }

  render() {
    return (
      <button 
        className={"square " + this.color + 
          ((this.props.isHighlighted) ? " highlighted" : "") + 
          (this.props.isSelected ? " selected" : "")} // this.state.isSelected
        // onClick={() => props.onClick(props.id)} // prop onClick 
        onClick={() => this.handleClick()} 
        key={this.props.id}
        // key={`${this.props.id}-${this.props.pieceCode}-0`} // update this key??? 
      >
        {
          // this.props.keycode && this.props.keycode in keycodeToComponent 
          // // this.props.playercode && this.props.piececode && ['L','D'].includes(this.props.playercode) && validPieces.includes(this.props.piececode) 
          //   // ? React.createElement(Piece, props)
          //   // ? React.createElement(keycodeToComponent[this.props.playercode + this.props.piececode], {
          //   ? React.createElement(keycodeToComponent[this.props.keycode], {
          //       ...this.props,
          //       // onPawnClick: this.props.onPawnClick,
          //     })
          //   : null
          // // this.props.children
          this.props.children
        }
      </button>
    );
  }
}

class LightSquare extends Square {
  color = "light";
}

class DarkSquare extends Square {
  color = "dark";
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squareComponents: this.props.squares.map((square, index) => {
  //       // keycodeToComponent[square]
  //       const rank = Math.floor(index / 8);
  //       const file = index % 8; 

  //       let squareProps = {
  //         keycode: square,
  //         id: index,
  //         key: index,
  //         // onPawnClick: this.handlePawnClick,
  //         onSquareClick: this.handleSquareClick, 
  //         // onPawnClick: this.handlePawnClick.bind(this),
  //         // include props to a square about the squares it can move to or might find relevant?? or all squares??? 
  //       }

  //       return ((rank + file) % 2 === 0) ? <LightSquare {...squareProps} /> : <DarkSquare {...squareProps} />;
  //     }),
  //     boardSize: Math.sqrt(this.props.squares.length),
  //     squareSelected: null,
  //   }
  // }

  render() {
    return (
      <div>
        {
          Array.from({ length: this.props.boardSize }, (_, rankIndex) => (
            <div className="board-row" key={rankIndex}>
              {
                this.props.squareComponents.slice(
                  rankIndex * this.props.boardSize, // start
                  rankIndex * this.props.boardSize + this.props.boardSize // end
                )// .map((squareComponent) => squareComponent)
                // .map((squareComponent) => {
                //   // squareComponent.children = this.props.children;
                //   return React.cloneElement(squareComponent, { ...squareComponent.props, children: this.props.children }); // , key: `${squareComponent.props.keycode}` });
                // })
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class Game extends React.Component {
  backrankStartingPositions = ['R','N','B','Q','K','B','N','R']; // can make chess960 later 
  boardSize = this.backrankStartingPositions.length;
  numSquares = this.boardSize ** 2;

  constructor(props) {
    // move the board state up here to more easily track history and handle moves like en passant, castling, etc. 
    super(props);

    let startingConfig = Array(64).fill("");
    startingConfig.fill("DP", 8, 16);
    startingConfig.splice(0, 8, ...this.backrankStartingPositions.map((piece) => "D" + piece));

    startingConfig.fill("LP", 48, 56);
    startingConfig.splice(56, 8, ...this.backrankStartingPositions.map((piece) => "L" + piece));

    // const squareProps = {
    //   // keycode: square,
    //   // id: index,
    //   // key: index,
    //   // onPawnClick: this.handlePawnClick,
    //   onSquareClick: this.handleSquareClick, 
    //   // onPawnClick: this.handlePawnClick.bind(this),
    //   // include props to a square about the squares it can move to or might find relevant?? or all squares??? 
    // }

    this.state = {
      pieceKeys: startingConfig,
      // TODO refactor this state again, don't store components in state, just store full data context 
      //   and generate components in render method 
      squareComponents: startingConfig.map((square, index) => {
        // keycodeToComponent[square]
        const rank = Math.floor(index / 8);
        const file = index % 8;
        const squareProps = {
          keycode: square,
          id: index,
          key: `${index}-${square}-0`,
          onSquareClick: this.handleSquareClick,
          // children: null,
        }
        let children = null;
        if (square !== "") children = React.createElement(keycodeToComponent[square], squareProps);
        return ((rank + file) % 2 === 0) 
          ? <LightSquare {...squareProps} children={children} /> 
          : <DarkSquare {...squareProps} children={children} /> 
      }),
      // boardSize: this.boardSize,
      squareSelected: null,
      whiteToPlay: true,
      history: [{
        // squares: Array(64).fill(null),
        pieceKeys: startingConfig, // full state of keycodes on board at this move
        AN: null, // Algebraic Notation
        INN: null, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
      }],
      // historyAN: [], // Algebraic Notation 
      // historyINN: [], // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4) 
      stepNumber: 0,
    }
  }

  generatePawnLegalMoves = (squareId) => {
    if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") return [];
    const [playerCode, pieceCode] = this.state.pieceKeys[squareId].split('');
    if (this.state.whiteToPlay && playerCode === 'D') return []; // not this player's turn
    if (pieceCode !== 'P') return []; // not a pawn 

    const pawnMultiplier = playerCode === 'L' ? 1 : -1;
    const pawnStartingRank = playerCode === 'L' ? 6 : 1;
    const currRank = Math.floor(squareId / 8);
    const currFile = squareId % 8;
    let pawnMoves = [];

    if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier] === "") pawnMoves.push(squareId + DIR.N * pawnMultiplier); // one square forward
    if (currRank === pawnStartingRank && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier * 2] === "") pawnMoves.push(squareId + DIR.N * pawnMultiplier * 2); // two squares forward from starting position
    if (currFile !== 0) { // pawn is not on a file
      if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.W] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.W].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // capture to the north/south west
      if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].INN === `${squareId + DIR.N * pawnMultiplier * 2 + DIR.W}${squareId + DIR.W}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.W); // en passant capture to the north/sout west
    }
    if (currFile !== 7) { // pawn is not on h file 
      if (this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E] !== "" && this.state.pieceKeys[squareId + DIR.N * pawnMultiplier + DIR.E].charAt(0) !== playerCode) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // capture to the north/south east
      if (this.state.history.length > 0 && this.state.history[this.state.history.length - 1].INN === `${squareId + DIR.N * pawnMultiplier * 2 + DIR.E}${squareId + DIR.E}`) pawnMoves.push(squareId + DIR.N * pawnMultiplier + DIR.E); // en passant capture to the north/south east
    }

    return pawnMoves;
  }

  getLegalMoves = (squareId) => {
    if (this.state.pieceKeys[squareId] === undefined || this.state.pieceKeys[squareId] === "") return [];
    if (this.state.whiteToPlay && this.state.pieceKeys[squareId]?.charAt(0) === 'D') return []; // not this player's turn 

    const square = this.state.squareComponents[squareId];
    const piece = square.props.children;
    // alert(`Square: ${JSON.stringify(square)}\nPiece: ${JSON.stringify(piece)}`);
    const playerCode = this.state.pieceKeys[squareId].charAt(0);
    const pieceCode = this.state.pieceKeys[squareId].charAt(1);

    switch (pieceCode) {
      case 'P':
        // // Legal pawn moves 
        // let pawnMoves = [-8, -7, -9];
        // // let pawnMoves = piece.state.moves;
        // if (playerCode === 'L' && Math.floor(squareId / 8) === 6 || playerCode === 'D' && Math.floor(squareId / 8) === 1) pawnMoves.push(-16); // two-square opening move
        // if (playerCode === 'D') pawnMoves = pawnMoves.map(move => -move);
        // let pawnValidators = [
        //   (target) => target >= 0 && target < 64, // on board
        //   (target) => ![8, 16].includes(Math.abs(squareId - target)) || this.state.pieceKeys[target] === "", // not occupied
        //   (target) => ![7, 9].includes(Math.abs(squareId - target)) 
        //     || (this.state.pieceKeys[target] !== "" && this.state.pieceKeys[target]?.charAt(0) !== this.state.pieceKeys[squareId].charAt(0))
        //     // || (this.state.history[-1].INN === `${squareId-17}${squareId-1}` || this.state.history[-1].INN === `${squareId-15}${squareId+1}`),
        // ];
        // // let legalMoves = [];
        // // pawnMoves.forEach(move => {
        // //   const targetSquare = squareId + move;
        // //   const legalMove = pawnValidators.every(validator => validator(targetSquare));
        // //   if (legalMove) {
        // //     legalMoves.push(targetSquare);
        // //   }
        // // })
        // // return legalMoves;
        // return pawnMoves
        //   .map((move) => move + squareId)
        //   .filter((target) => pawnValidators.every(validator => validator(target)));
        return this.generatePawnLegalMoves(squareId);
      case 'N':
        // Legal knight moves
        const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
        const knightValidators = [
          (target) => target >= 0 && target < 64, // on board
          (target) => Math.abs((target % 8) - (squareId % 8)) <= 2, // file difference <= 2
          (target) => Math.abs(Math.floor(target / 8) - Math.floor(squareId / 8)) <= 2, // rank difference <= 2
          (target) => this.state.pieceKeys[target] === "" || this.state.pieceKeys[target]?.charAt(0) !== this.state.pieceKeys[squareId].charAt(0),
        ];
        let knightLegalMoves = [];
        knightMoves.forEach(move => {
          const targetSquare = squareId + move;
          const legalMove = knightValidators.every(validator => validator(targetSquare));
          if (legalMove) {
            knightLegalMoves.push(targetSquare);
          }
        });
        return knightLegalMoves;
      // case 'B':

      default:
        return [];
    }    
  }

  handleSquareClick = (squareId) => {
    const squareToSelect = squareId;
    // clicking on a square for the first time (no square selected yet) 
    if (this.state.squareSelected === null || this.state.squareSelected !== squareToSelect) { // disallow multi-piece selection for now 
      if (this.state.squareComponents[squareToSelect].props.isHighlighted) {
        // Move piece to clicked square
        // TODO here we also need to handle en passant captures, where the piece being captured is not on the square
        //   that the pawn ends up on ... 
        const squareMovedFrom = this.state.squareSelected;
        const squareMovedTo = squareToSelect;
        const pieceMoving = this.state.pieceKeys[squareMovedFrom];
        let squareIdOfPawnCapturedViaEnPassant = null;
        let newPieceKeys = this.state.pieceKeys;
        newPieceKeys[squareMovedFrom] = "";
        newPieceKeys[squareMovedTo] = pieceMoving;
        if (pieceMoving.charAt(1) === 'P' // piece moving is a pawn
          && squareMovedFrom % 8 !== squareMovedTo % 8 // signifies that the pawn performed a capture (changed files) 
          && this.state.pieceKeys[squareMovedTo] === '' // signifies that the capture was an en passant 
        ) {
          squareIdOfPawnCapturedViaEnPassant = squareMovedTo + DIR.N * (pieceMoving.charAt(0) === 'L' ? 1 : -1);
          newPieceKeys[squareIdOfPawnCapturedViaEnPassant] = "";
        }
        this.setState({
          ...this.state,
          squareSelected: null,
          whiteToPlay: !this.state.whiteToPlay,
          squareComponents: this.state.squareComponents.map((el, idx) => {
            // let children = null;
            // if (newPie !== "") children = React.createElement(keycodeToComponent[square], squareProps);
            let newKeycode = el.keycode;
            const [oldSquareId, oldPieceId, oldChangeCode] = el.key?.split('-');
            // console.log(`oldSquareId: ${oldSquareId}\toldPieceId: ${oldPieceId}\t${oldChangeCode}\n`);
            // let newChildren = el.children; 
            if (idx === squareMovedFrom || idx === squareMovedTo || idx === squareIdOfPawnCapturedViaEnPassant) {
              // const [oldSquareId, oldPieceId, oldChangeCode] = el.props.key?.split('-');
              const newKey = `${oldSquareId}-${newKeycode}-${oldChangeCode ? oldChangeCode + 1 : 0}`;
              newKeycode = (idx === squareMovedTo) ? pieceMoving : "";
              const newChildren = (idx === squareMovedTo) ? React.createElement(keycodeToComponent[pieceMoving], el.props) : null; // TODO el.props is the props from the square that previously had no piece on it
              return React.cloneElement(el, 
                {
                  ...el.props, 
                  keycode: newKeycode, 
                  isHighlighted: false, 
                  isSelected: false, 
                  key: newKey,
                  children: newChildren,
                }
              );
            } 
            return React.cloneElement(el, 
              {
                ...el.props, 
                keycode: newKeycode, 
                isHighlighted: false, 
                isSelected: false, 
                // key: `${el.props.id}-0`, 
                key: `${idx}-${newKeycode}-${oldChangeCode ? oldChangeCode + 1 : 0}`
                // children: {newChildren} 
              }
            );
          }),
          pieceKeys: newPieceKeys,
          history: this.state.history.concat([{
            pieceKeys: newPieceKeys,
            AN: null, // TODO generate Algebraic Notation for this move 
            INN: `${squareMovedFrom}${squareMovedTo}`, // International Numeric Notation (Computer Notation, e.g. 5254 == e2->e4)
          }]),
        })
      } else {
        // select an unselected square and highlight the legal moves for that piece on this turn 
        // const isThisPlayersMove = this.state.whiteToPlay ^ this.state.pieceKeys[squareToSelect]?.charAt(0) === 'D';
        // const squaresToHighlight = isThisPlayersMove ? this.getLegalMoves(squareId) : [];
        const squaresToHighlight = this.getLegalMoves(squareToSelect);
        this.setState({
          ...this.state,
          squareSelected: squareToSelect,
          squareComponents: this.state.squareComponents.map((el, idx) => {
            const shouldHighlight = squaresToHighlight.includes(idx);
            const shouldSelect = (idx === squareToSelect);
            // if (shouldHighlight || shouldSelect) {
            //   const newKey = `${el.props.id}-${shouldHighlight ? '1' : '0'}`;
            //   return React.cloneElement(el, {...el.props, isHighlighted: shouldHighlight, isSelected: shouldSelect, key: newKey }); // !el.props.isHighlighted
            // } else {
            //   return el;
            // }
            const newKey = `${idx}-${el.props.id}-${shouldHighlight ? '1' : '0'}`;
            return React.cloneElement(el, { ...el.props, isHighlighted: shouldHighlight, isSelected: shouldSelect, key: newKey });
          }),
        })
      }
    } else if (this.state.squareSelected === squareToSelect) {
      // Deselect the square and any highlighted legal moves 
      // const squaresToClear = this.getLegalMoves(squareId);
      // for now, let's just clear all highlights too 
      this.setState({
        ...this.state,
        squareSelected: null,
        squareComponents: this.state.squareComponents.map((el, idx) => {
          return React.cloneElement(el, {...el.props, isHighlighted: false, isSelected: false, key: `${idx}-${el.props.id}-0` });
        }),
      });
    } else {

    }
  }

  // const [] = React.useState

  // TODO take this logic and put it somewhere else... was being used, not anymore 
  // handleClick(i) {
  //   // alert("Prop handler click on square " + i);

  //   const squares = this.state.squares;

  //   // also don't really know what i was doing here much ... 
  //   // const history = this.state.history.slice(0, this.state.stepNumber + 1);
  //   // // console.log(history);
  //   // const current = history[history.length - 1];
  //   // const squares = current.squares.slice();
  //   // // if (calculateWinner(squares) || squares[i]) {

  //   // this.setState({
  //   //   history: history.concat([{
  //   //     squares: squares,
  //   //   }]),
  //   //   squares: squares,
  //   //   stepNumber: history.length,
  //   //   whiteToPlay: !this.state.whiteToPlay,
  //   // });

  //   this.setState({
  //     ...this.state,
  //     history: this.state.history.concat([{
  //       squares: squares,
  //     }]),
  //     squares: squares,
  //     stepNumber: this.state.history.length,
  //     whiteToPlay: !this.state.whiteToPlay,
  //   })
  // }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      whiteToPlay: (step % 2) === 0,
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            // squares={current.squares}
            pieceKeys={this.state.pieceKeys}
            squareComponents={this.state.squareComponents}
            boardSize={this.boardSize}
            // onClick={(i) => this.handleClick(i)} // only place we pass down handleClick into onClick prop 
            // onPawnClick={(squareId) => this.handlePawnClick(squareId)}
          />
        </div>
        <GameStatus 
          whiteToPlay={this.state.whiteToPlay}
          history={this.state.history}
        />
        {/* <div id="navbar">
          <Nav />
        </div> */}
      </div>
    );
  }
}

class GameStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  // gameHistory = this.props.history;
  // const current = history[this.state.stepNumber];
  // const squares = current.squares;

  moves = this.props.history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  render() {
    const winner = null; //calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.props.whiteToPlay ? 'White' : 'Black');
    }

    return (
      <div className="game-info">
        <div>{status}</div>
        <ol>{this.moves}</ol>
      </div>
    )
  }
}

// function Nav() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//             <li>
//               <Link to="/users">Users</Link>
//             </li>
//           </ul>
//         </nav>

//         {/* A <Switch> looks through its children <Route>s and
//             renders the first one that matches the current URL. 
//             Updated <Switch> to <Routes> in React Router v6. */}
//         <Routes>
//           <Route path="/about" element={<About />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/" element={<Home />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>




    <Game />



    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">Home</Link>
    //         </li>
    //         <li>
    //           <Link to="/about">About</Link>
    //         </li>
    //         <li>
    //           <Link to="/users">Users</Link>
    //         </li>
    //       </ul>
    //     </nav>

    //     {/* A <Switch> looks through its children <Route>s and
    //         renders the first one that matches the current URL. 
    //         Updated <Switch> to <Routes> in React Router v6. */}
    //     <Routes>
    //       <Route path="/about" element={<About />} />
    //       <Route path="/users" element={<Users />} />
    //       <Route path="/" element={<Home />} />
    //     </Routes>
    //   </div>
    // </Router>
  );
}

export default App;

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Users() {
//   return <h2>Users</h2>;
// }
