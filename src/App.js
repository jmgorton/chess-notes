import React from 'react';
import './App.css';

import { Nav } from './components/Nav.tsx';

// function Root() {
//   return (
//     <>
//       <div id="sidebar" style={{background: 'white'}}>
//         {/* <h1>React Router Contacts</h1>
//         <div>
//           <form id="search-form" role="search">
//             <input
//               id="q"
//               aria-label="Search contacts"
//               placeholder="Search"
//               type="search"
//               name="q"
//             />
//             <div
//               id="search-spinner"
//               aria-hidden
//               hidden={true}
//             />
//             <div
//               className="sr-only"
//               aria-live="polite"
//             ></div>
//           </form>
//           <form method="post">
//             <button type="submit">New</button>
//           </form>
//         </div> */}
//         <nav>
//           <ul>
//             <li>
//               <a href={`/home`}>Home</a>
//             </li>
//             <li>
//               <a href={`/about`}>About</a>
//             </li>
//             <li>
//               <a href={`/users`}>Users</a>
//             </li>
//             <li>
//               <a href={`/play`} disabled={true}>Play</a>
//             </li>
//             <li>
//               <a href={`/study`}>Study</a>
//             </li>
//           </ul>
//         </nav>
//       </div>
//       <div id="detail"></div>
//     </>
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

    <div className="App">
      <div id="navbar">
        <Nav />
      </div>
      {/* <Game /> */}
    </div>

  );
}

export default App;
