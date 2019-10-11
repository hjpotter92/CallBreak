import React from 'react';
import GameComponent from './Game';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{height: '40%'}} />
        <GameComponent />
      </header>
    </div>
  );
}

export default App;
