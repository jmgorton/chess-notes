import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

// eslint-disable-next-line
import rook from './rook.png';

function Piece(props) {
  return (
    // <img src={rook} alt="Rook" />
    // <img className="piece" src="./rook.png" alt="Rook" />
    <img src={require('./rook.png')} alt="Rook" />
  );
}

function Square(props) {
  return (
    <button className={"square " + props.color} onClick={props.onClick} key={props.id}>
      {/* {props.value} */}
      {/* <img src={require("./rook.png")} alt="Rook"/> */}
      <Piece />
    </button>
  );
}

function DarkSquare(props) {
  return (
    <Square
      value={props.value}
      onClick={props.onClick}
      id={props.id}
      color="dark"
    />
  );
}

function LightSquare(props) {
  return (
    <Square
      value={props.value}
      onClick={props.onClick}
      id={props.id}
      color="light"
    />
  );
}

class Board extends React.Component {

  renderSquare(i) {
    let file = i % 8;
    let rank = Math.floor(i / 8);

    if ((file + rank) % 2 === 0) {
      return (
        <LightSquare
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          id={i}
        >
          {/* if (this.props.squares[i] === "R") {
            <img src={rook} alt="rook"/>
          } */}
        </LightSquare>
      );
    } else {
      return (
        <DarkSquare
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          id={i}
        />
      );
    }
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

    let startingConfig = Array(64).fill("P", 8, 16);
    startingConfig[0] = startingConfig[7] = "R";
    startingConfig[1] = startingConfig[6] = "N";
    startingConfig[2] = startingConfig[5] = "B";
    startingConfig[3] = "Q";
    startingConfig[4] = "K";

    startingConfig.fill("P", 48, 56);
    startingConfig[56] = startingConfig[63] = "R";
    startingConfig[57] = startingConfig[62] = "N";
    startingConfig[58] = startingConfig[61] = "B";
    startingConfig[59] = "Q";
    startingConfig[60] = "K";

    this.state = {
      history: [{
        // squares: Array(64).fill(null),
        squares: startingConfig,
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // console.log(history);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // if (calculateWinner(squares) || squares[i]) {
    if (squares[i]) {
      squares[i] = null;
    } else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
    }
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
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
      status = 'Next player: ' + (this.state.xIsNext ? 'White' : 'Black');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
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
