import React from 'react';

import {
  useOutlet,
  useNavigate,
  Link,
} from 'react-router-dom';

import Game from '../components/Game.tsx';

export default function Play({}) {
  // return <Game />
  const outlet = useOutlet();

  return (
    <>
      <h2>Play</h2>
      <div>
        <ul>
          <li>Online</li>
          <ul>
            <li>Random Match</li>
            <li>Challenge Friends</li>
          </ul>
          <li>Local Multiplayer</li>
          <li>Bot</li>
          {/* technically the same as local multiplayer...? */}
          {/* <li>Solo</li> */}
        </ul>
        <h3>Options</h3>
        Variant:
        <ul>
          (Choose a variant)
          <li>Blind</li>
          <li>Fog of War</li>
          <li>Hand & Brain (4-player)</li>
          <li>Duck Chess</li>
          <li>Atomic Chess</li>
          <li>Bughouse</li>
        </ul>
      </div>
      {/* <button>Start Game</button> */}
      {/* <Link to={`:game`}>Start Game</Link> */}
      <button><Link to={`1`}>Start Game</Link></button>
      {
        outlet
      }
    </>
    
  )
}

