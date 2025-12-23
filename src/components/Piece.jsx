import React from 'react';

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

  testEvent() {
    alert("This is a test event from Piece");
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
        zindex="10"
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
  keycode = "LP";
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
  keycode = "DP";
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
  keycode = "LN";
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
  keycode = "DN";
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
  keycode = "LB";
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
  keycode = "DP";
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
  keycode = "LR";
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
  keycode = "DR";
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
  keycode = "LQ";
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
  keycode = "DQ";
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
  keycode = "LK";
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
  keycode = "DK";
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

export const keycodeToComponent = {
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

export default Piece;