import { useState } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router';
import Home from './components/Home';
import Game1 from './components/Game1';
import Game2 from './components/Game2';
import Game3 from './components/Game3';
import Game4 from './components/Game4';
import Game5 from './components/Game5';
import Game6 from './components/Game6';
import Game7 from './components/Game7';
import Game8 from './components/Game8';
import Game9 from './components/Game9';
import Game10 from './components/Game10';
import Game11 from './components/Game11';
import Game12 from './components/Game12';

function App() {

  return (
    <BrowserRouter>
    <nav className='flex flex-row flex-wrap gap-4 justify-center p-3 border-b'>
      <Link to="/">Home</Link>
      <p>|</p>
      <Link to="/game1">Tic-Tac-Toe</Link> 
      <p>|</p>
      <Link to="/game2">2048</Link> 
      <p>|</p>
      <Link to="/game3">Black Jack</Link>
      <p>|</p>
      <Link to="/game4">Wordle</Link>
      <p>|</p>
      <Link to="/game5">Rock Paper Scissor</Link>
      <p>|</p>
      <Link to="/game6">Connect 4</Link>
      <p>|</p>
      <Link to="/game7">Minesweeper</Link>
      <p>|</p>
      <Link to="/game8">15 Puzzle</Link>
      <p>|</p>
      <Link to="/game9">Snake</Link>
      <p>|</p>
      <Link to="/game10">Tetris</Link>
      <p>|</p>
      <Link to="/game11">Flag Guessr</Link>
      <p>|</p>
      <Link to="/game12">Flappy Bird</Link>
    </nav>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game1" element={<Game1 />} />
      <Route path="/game2" element={<Game2 />} />
      <Route path="/game3" element={<Game3 />} />
      <Route path="/game4" element={<Game4 />} />
      <Route path="/game5" element={<Game5 />} />
      <Route path="/game6" element={<Game6 />} />
      <Route path="/game7" element={<Game7 />} />
      <Route path="/game8" element={<Game8 />} />
      <Route path="/game9" element={<Game9 />} />
      <Route path="/game10" element={<Game10 />} />
      <Route path="/game11" element={<Game11 />} />
      <Route path="/game12" element={<Game12 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
