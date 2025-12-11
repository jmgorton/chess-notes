import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

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

const validPieces = ['R','N','B','Q','K','P'];
const validPlayers = ['L','D'];

class Piece extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    }
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
        // src={this.state.icon} 
        src={keycodeToIcon[this.state.playercode + this.state.piececode]}
        // alt={this.state.alt} 
        alt={this.state.playercode + this.state.piececode}
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
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      alt: "Pawn", // not mutable, don't put in state ?? 
      piececode: "P",
    }
    // this.handleClick = this.handleClick.bind(this);
  }
}

class LightPawn extends Pawn {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "L",
      keycode: "LP",
      icon: keycodeToIcon["LP"],
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // highlight two squares in front, if legal moves 
    const squareId = this.props.id;
    this.props.onPawnClick(squareId);
  }
}

class DarkPawn extends Pawn {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "D",
      icon: keycodeToIcon["DP"],
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // highlight two squares in front, if legal moves, considering orientation of board 
    // get id of this piece
    // set isHighlighted state of pieces with id+8, id+16 to true
  }
}

class Knight extends Piece {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      alt: "Knight",
      piececode: "N",
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    super.handleClick();
    // alert("Clicked on a Knight");
  }
}

class LightKnight extends Knight {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "L",
      icon: keycodeToIcon["LN"],
    }
  }
}

class DarkKnight extends Knight {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "D",
      icon: keycodeToIcon["DN"],
    }
  }
}

class Bishop extends Piece {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      alt: "Bishop",
      piececode: "B",
    }
  }
}

class LightBishop extends Bishop {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "L",
      icon: keycodeToIcon["LB"],
    }
  }
}

class DarkBishop extends Bishop {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "D",
      icon: keycodeToIcon["DB"],
    }
  }
}

class Rook extends Piece {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      alt: "Rook",
      piececode: "R",
    }
  }
}

class LightRook extends Rook {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "L",
      icon: keycodeToIcon["LR"],
    }
  }
}

class DarkRook extends Rook {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "D",
      icon: keycodeToIcon["DR"],
    }
  }
}

class Queen extends Piece {
  alt = "Queen";
  piececode = "Q";

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     ...this.state,
  //     isSelected: false, // this.props.isSelected || false,
  //   }
  // }
}

class LightQueen extends Queen {
  alt = "Light Queen";
  playercode = "L";
  icon = keycodeToIcon["LQ"];

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     ...this.state,
  //   }
  // }
}

class DarkQueen extends Queen {
  alt = "Dark Queen";
  playercode = "D";
  icon = keycodeToIcon["DQ"];

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     ...this.state,
  //     playercode: "D",
  //     // piececode: "Q",
  //     icon: keycodeToIcon["DQ"],
  //     alt: "Dark Queen",
  //   }
  // }
}

class King extends Piece {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      alt: "King",
      piececode: "K",
    }
  }
}

class LightKing extends King {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "L",
      icon: keycodeToIcon["LK"],
    }
  }
}

class DarkKing extends King {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      playercode: "D",
      icon: keycodeToIcon["DK"],
    }
  }
}

// function Square(props) {

//   // let onClick = () => {
//   //   alert("Square " + props.id + " clicked.");
//   // }

//   return (
//     <button 
//       className={"square " + props.color + (props.isHighlighted ? " highlighted" : "")} 
//       // onClick={(props.playercode && props.piececode) ? () => onClick() : () => {}} 
//       // onClick={props.onClick}
//       onClick={() => props.onClick(props.id)}
//       key={props.id}
//     >

//       {/* {props.value} */}
//       {/* <img src={require("./rook.png")} alt="Rook"/> */}
//       {/* {props.value ? <Piece value={props.value}/> : null} */}
//       {/* {props.value && validPieces.includes(props.value) ? React.createElement(keycodeToComponent[props.value], props) : null} */}
//       {
//         props.playercode && props.piececode && ['L','D'].includes(props.playercode) && validPieces.includes(props.piececode) 
//           // ? React.createElement(Piece, props)
//           ? React.createElement(keycodeToComponent[props.piececode], props)
//           : null
//       }
      
//     </button>
//   );
// }

// function DarkSquare(props) {
//   return (
//     <Square
//       // value={props.value}
//       {...props}
//       // playercode={props.playercode}
//       // piececode={props.piececode}
//       // onClick={props.onClick}
//       // id={props.id}
//       color="dark"
//     />
//   );
// }

// function LightSquare(props) {
//   return (
//     <Square
//       // value={props.value}
//       {...props}
//       // playercode={props.playercode}
//       // piececode={props.piececode}
//       // onClick={props.onClick}
//       // id={props.id}
//       color="light"
//     />
//   );
// }

const keycodeToComponent = {
  'R': Rook,
  'N': Knight,
  'B': Bishop,
  'Q': Queen,
  'K': King,
  'P': Pawn,
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
    this.state = {
      ...this.state,
      isHighlighted: this.props.isHighlighted || false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      ...prevState,
      isHighlighted: !prevState.isHighlighted,
    }));

    if (this.props.keycode === "LP") {
      // alert("This is a pawn square, id: " + this.props.id);
      this.props.onPawnClick(this.props.id);
    }
  }

  render() {
    return (
      <button 
        className={"square " + this.state.color + ((this.state.isHighlighted || this.props.isHighlighted) ? " highlighted" : "")} 
        // onClick={() => props.onClick(props.id)} // prop onClick 
        onClick={() => this.handleClick()} 
        key={this.props.id}
      >
        {
          this.props.keycode && this.props.keycode in keycodeToComponent 
          // this.props.playercode && this.props.piececode && ['L','D'].includes(this.props.playercode) && validPieces.includes(this.props.piececode) 
            // ? React.createElement(Piece, props)
            // ? React.createElement(keycodeToComponent[this.props.playercode + this.props.piececode], {
            ? React.createElement(keycodeToComponent[this.props.keycode], {
                ...this.props,
                // onPawnClick: this.props.onPawnClick,
              })
            : null
        }
      </button>
    );
  }
}

class LightSquare extends Square {
  constructor(props) {
    super(props);
    this.state = {
      color: "light",
    }
  }
}

class DarkSquare extends Square {
  constructor(props) {
    super(props);
    this.state = {
      color: "dark"
    }
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squareComponents: this.props.squares.map((square, index) => {
        // keycodeToComponent[square]
        const rank = Math.floor(index / 8);
        const file = index % 8; 

        let squareProps = {
          keycode: square,
          id: index,
          key: index,
          onPawnClick: this.handlePawnClick,
          // onPawnClick: this.handlePawnClick.bind(this),
        }

        return ((rank + file) % 2 === 0) ? <LightSquare {...squareProps} /> : <DarkSquare {...squareProps} />;
      }),
      boardRanks: Math.sqrt(this.props.squares.length),
    }

    // let ranks = []
    // for (let i = 0; i < 64; i+=8) {
    //   ranks.push(this.props.squares.slice(i, i+8));
    // }

    // this.setState(prevState => ({
    //   ...prevState,
    //   boardRanks: ranks,
    // }))
  }

  handlePawnClick = (squareId) => {
    // alert("Pawn clicked on square " + squareId);
    const oneSquareAhead = squareId - 8;
    const twoSquaresAhead = squareId - 16;

    // alert("Should update props for squares:\n\t" + 
    //   oneSquareAhead + " (props: " + JSON.stringify(this.state.squareComponents[oneSquareAhead]?.props) + ")" + 
    //   "\n\t" + twoSquaresAhead + " (props: " + JSON.stringify(this.state.squareComponents[twoSquaresAhead]?.props) + ")");

    // Clone each square element, set `isHighlighted` true for the two target squares,
    // clear highlights for others. Change the element `key` so Square remounts and
    // picks up the `isHighlighted` prop in its constructor.
    const newSquareComponents = this.state.squareComponents.map((el, idx) => {
      const shouldHighlight = (idx === oneSquareAhead) || (idx === twoSquaresAhead);
      if (shouldHighlight) {
        const newKey = `${el.props.id}-${shouldHighlight ? '1' : '0'}`;
        return React.cloneElement(el, {...el.props, isHighlighted: true, key: newKey });
      } else {
        return el;
      }
      // const newKey = `${el.props.id}-${shouldHighlight ? '1' : '0'}`;
      // return React.cloneElement(el, { ...el.props, isHighlighted: shouldHighlight, key: newKey });
    });

    this.setState({
      ...this.state,
      squareComponents: newSquareComponents,
    });

    // alert("Should have updated props for squares:\n\t" + 
    //   oneSquareAhead + " (props: " + JSON.stringify(this.state.squareComponents[oneSquareAhead]?.props) + ")" + 
    //   "\n\t" + twoSquaresAhead + " (props: " + JSON.stringify(this.state.squareComponents[twoSquaresAhead]?.props) + ")");
  }

  // handlePawnClick(squareId) {
  //   const squares = this.state.squares.slice();
  //   // Clear all previous highlights
  //   squares.forEach((square, index) => {
  //     if (square.includes("X")) {
  //       squares[index] = square.replace("X", "");
  //     }
  //   });
    
  //   // For light pawn moving forward: subtract 8 for one square, subtract 16 for two squares
  //   const oneSquareAhead = squareId - 8;
  //   const twoSquaresAhead = squareId - 16;
    
  //   // // Mark the two possible destination squares
  //   // if (oneSquareAhead >= 0) {
  //   //   squares[oneSquareAhead] = (squares[oneSquareAhead] || "") + "X";
  //   // }
  //   // if (twoSquaresAhead >= 0) {
  //   //   squares[twoSquaresAhead] = (squares[twoSquaresAhead] || "") + "X";
  //   // }
    
  //   this.setState({
  //     ...this.state,
  //     squares: squares,
  //   });
  // }

  // renderSquare(i) {
  //   return this.state.squareComponents[i];
  //   // let file = i % 8;
  //   // let rank = Math.floor(i / 8);

  //   // let props = {
  //   //   playercode: this.props.squares[i]?.charAt(0),
  //   //   piececode: this.props.squares[i]?.charAt(1),
  //   //   // isHighlighted: this.props.squares[i]?.includes("X"),
  //   //   // isHighlighted: this.state?.squares[i]?.includes("X"),
  //   //   // onClick: (i) => this.props.onClick(i), // only place the onClick Board prop is passed down as a prop to LightSquare/DarkSquare 
  //   //   id: i,
  //   //   // onPawnClick: this.handlePawnClick,
  //   // }

  //   // return ((file + rank) % 2 === 0) ? <LightSquare {...props} /> : <DarkSquare {...props} />; 

  //   // if ((file + rank) % 2 === 0) {
  //   //   return (
  //   //     <LightSquare
  //   //       // value={this.props.squares[i]}
  //   //       playercode={this.props.squares[i].charAt(0)}
  //   //       piececode={this.props.squares[i].charAt(1)}
  //   //       onClick={() => this.props.onClick(i)}
  //   //       id={i}
  //   //     >
  //   //       {/* if (this.props.squares[i] === "R") {
  //   //         <img src={rook} alt="rook"/>
  //   //       } */}
  //   //     </LightSquare>
  //   //   );
  //   // } else {
  //   //   return (
  //   //     <DarkSquare
  //   //       // value={this.props.squares[i]}
  //   //       playercode={this.props.squares[i].charAt(0)}
  //   //       piececode={this.props.squares[i].charAt(1)}
  //   //       onClick={() => this.props.onClick(i)}
  //   //       id={i}
  //   //     />
  //   //   );
  //   // }
  // }

  // renderRank(squares) {
  //   return (
  //     <div className="board-row">
  //       {squares}
  //     </div>
  //   );
  // }

  render() {
    // var board = [];
    // var rank = [];
    // for (var i = 0; i < 8; i++) {
    //   for (var j = 0; j < 8; j++) {
    //     rank.push(this.renderSquare((8 * i) + j));
    //   }
    //   board.push(this.renderRank(rank));
    //   rank = [];
    // }

    // return (
    //   <div>
    //     {board}
    //   </div>
    // );

    return (
      <div>
        {
          // this.state.boardRanks.map((squares, rankIndex) => (
          //   <div className="board-row" key={rankIndex}>
          //     {squares}
          //   </div>
          // ))
          // let boardLength = Math.sqrt(this.state.squareComponents.length);
          Array.from({ length: this.state.boardRanks }, (_, rankIndex) => (
            <div className="board-row" key={rankIndex}>
              {
                this.state.squareComponents.slice(rankIndex * this.state.boardRanks, rankIndex * this.state.boardRanks + this.state.boardRanks)
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    let startingConfig = Array(64).fill("");
    startingConfig.fill("DP", 8, 16);
    startingConfig[0] = startingConfig[7] = "DR";
    startingConfig[1] = startingConfig[6] = "DN";
    startingConfig[2] = startingConfig[5] = "DB";
    startingConfig[3] = "DQ";
    startingConfig[4] = "DK";

    startingConfig.fill("LP", 48, 56);
    startingConfig[56] = startingConfig[63] = "LR";
    startingConfig[57] = startingConfig[62] = "LN";
    startingConfig[58] = startingConfig[61] = "LB";
    startingConfig[59] = "LQ";
    startingConfig[60] = "LK";

    this.state = {
      history: [{
        // squares: Array(64).fill(null),
        squares: startingConfig,
      }],
      squares: startingConfig,
      whiteToPlay: true,
      stepNumber: 0,
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

  //   if (squares[i]) {
  //     squares[i] = "X";
  //   } else {
  //     // squares[i] = this.state.whiteToPlay ? 'X' : 'O';
  //     // test highlighting/selecting an empty square 
  //     squares[i] = "X"; // temporary placeholder to mean highlighted 
  //   }


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
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // const squares = current.squares;
    const winner = null; //calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.whiteToPlay ? 'White' : 'Black');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            // squares={current.squares}
            squares={this.state.squares}
            // onClick={(i) => this.handleClick(i)} // only place we pass down handleClick into onClick prop 
            // onPawnClick={(squareId) => this.handlePawnClick(squareId)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div id="navbar">
          <Nav />
        </div>
      </div>
    );
  }
}

function Nav() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. 
            Updated <Switch> to <Routes> in React Router v6. */}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

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

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
