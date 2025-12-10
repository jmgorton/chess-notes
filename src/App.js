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

const keycodeToComponent = {
  'R': Rook,
  'N': Knight,
  'B': Bishop,
  'Q': Queen,
  'K': King,
  'P': Pawn,
};

const validPieces = ['R','N','B','Q','K','P'];

function Piece(props) {
  return (
    // <img src={rook} alt="Rook" />
    // <img className="piece" src="./rook.png" alt="Rook" />
    // <img src={keycodeToIcon[props.keycode]} alt={props.alt} className="piece" />
    <img 
      src={keycodeToIcon[props.playercode + props.piececode]} 
      alt={props.alt} 
      className="piece" 
      // onClick={() => props.onClick(props.id)} // commented out to avoid piece click interfering with square click for now ...
      // both Piece and Square have the same onClick prop passed down from Board via Square
      // onClick={props.onClick} // i think this would pass the event object, not the square id ...
    />
  );
}

function King(props) {
  return (
    <Piece
      // icon="./pawn.jpeg"
      {... props}
      alt="King"
      // keycode="K"
    />
  )
}

function Queen(props) {
  return (
    <Piece
      // icon="./pawn.jpeg"
      {... props}
      alt="Queen"
      // keycode="Q"
    />
  )
}

function Rook(props) {
  return (
    // <img src={require("./rook.png")} alt="Rook" className="piece" />
    <Piece
      // icon="./rook.png"
      {... props}
      alt="Rook"
      // keycode="R"
    />
  );
}

function Bishop(props) {
  return (
    <Piece
      // icon="./pawn.jpeg"
      {... props}
      alt="Bishop"
      // keycode="B"
    />
  )
}

function Knight(props) {
  return (
    <Piece
      // icon="./pawn.jpeg"
      {... props}
      alt="Knight"
      // keycode="N"
    />
  )
}

function Pawn(props) {
  return (
    <Piece
      // icon="./pawn.jpeg"
      {... props}
      alt="Pawn"
      // keycode="P"
    />
  )
}

function Square(props) {

  // let onClick = () => {
  //   alert("Square " + props.id + " clicked.");
  // }

  return (
    <button 
      className={"square " + props.color + (props.isHighlighted ? " highlighted" : "")} 
      // onClick={(props.playercode && props.piececode) ? () => onClick() : () => {}} 
      // onClick={props.onClick}
      onClick={() => props.onClick(props.id)}
      key={props.id}
    >

      {/* {props.value} */}
      {/* <img src={require("./rook.png")} alt="Rook"/> */}
      {/* {props.value ? <Piece value={props.value}/> : null} */}
      {/* {props.value && validPieces.includes(props.value) ? React.createElement(keycodeToComponent[props.value], props) : null} */}
      {
        props.playercode && props.piececode && ['L','D'].includes(props.playercode) && validPieces.includes(props.piececode) 
          // ? React.createElement(Piece, props)
          ? React.createElement(keycodeToComponent[props.piececode], props)
          : null
      }
      
    </button>
  );
}

function DarkSquare(props) {
  return (
    <Square
      // value={props.value}
      {...props}
      // playercode={props.playercode}
      // piececode={props.piececode}
      // onClick={props.onClick}
      // id={props.id}
      color="dark"
    />
  );
}

function LightSquare(props) {
  return (
    <Square
      // value={props.value}
      {...props}
      // playercode={props.playercode}
      // piececode={props.piececode}
      // onClick={props.onClick}
      // id={props.id}
      color="light"
    />
  );
}

class Board extends React.Component {

  renderSquare(i) {
    let file = i % 8;
    let rank = Math.floor(i / 8);

    let props = {
      playercode: this.props.squares[i]?.charAt(0),
      piececode: this.props.squares[i]?.charAt(1),
      // isHighlighted: this.props.squares[i]?.includes("X"),
      isHighlighted: this.state?.squares[i]?.includes("X"),
      onClick: (i) => this.props.onClick(i), // only place the onClick Board prop is passed down as a prop to LightSquare/DarkSquare 
      id: i,
    }

    return ((file + rank) % 2 === 0) ? <LightSquare {...props} /> : <DarkSquare {...props} />; 

    // if ((file + rank) % 2 === 0) {
    //   return (
    //     <LightSquare
    //       // value={this.props.squares[i]}
    //       playercode={this.props.squares[i].charAt(0)}
    //       piececode={this.props.squares[i].charAt(1)}
    //       onClick={() => this.props.onClick(i)}
    //       id={i}
    //     >
    //       {/* if (this.props.squares[i] === "R") {
    //         <img src={rook} alt="rook"/>
    //       } */}
    //     </LightSquare>
    //   );
    // } else {
    //   return (
    //     <DarkSquare
    //       // value={this.props.squares[i]}
    //       playercode={this.props.squares[i].charAt(0)}
    //       piececode={this.props.squares[i].charAt(1)}
    //       onClick={() => this.props.onClick(i)}
    //       id={i}
    //     />
    //   );
    // }
  }

  renderRank(squares) {
    return (
      <div className="board-row">
        {squares}
      </div>
    );
  }

  render() {
    var board = [];
    var rank = [];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        rank.push(this.renderSquare((8 * i) + j));
      }
      board.push(this.renderRank(rank));
      rank = [];
    }

    return (
      <div>
        {board}
      </div>
    );
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

  handleClick(i) {
    alert("Prop handler click on square " + i);

    const squares = this.state.squares;

    // also don't really know what i was doing here much ... 
    // const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // // console.log(history);
    // const current = history[history.length - 1];
    // const squares = current.squares.slice();
    // // if (calculateWinner(squares) || squares[i]) {

    if (squares[i]) {
      squares[i] = "X";
    } else {
      // squares[i] = this.state.whiteToPlay ? 'X' : 'O';
      // test highlighting/selecting an empty square 
      squares[i] = "X"; // temporary placeholder to mean highlighted 
    }


    // this.setState({
    //   history: history.concat([{
    //     squares: squares,
    //   }]),
    //   squares: squares,
    //   stepNumber: history.length,
    //   whiteToPlay: !this.state.whiteToPlay,
    // });

    this.setState({
      ...this.state,
      history: this.state.history.concat([{
        squares: squares,
      }]),
      squares: squares,
      stepNumber: this.state.history.length,
      whiteToPlay: !this.state.whiteToPlay,
    })
  }

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
            onClick={(i) => this.handleClick(i)} // only place we pass down handleClick into onClick prop 
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
