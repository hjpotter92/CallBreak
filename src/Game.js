import React, { Component, createRef } from 'react';
import PlayerComponent from './Player';

export default class GameComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy: '',
      players: [],
      inputValues: [],
      round: 0,
      gameState: 'new',
      error: ''
    };
    this.resetInput();
  }

  resetInput() {
    this.setState({
      inputValues: Array(4).fill(0)
    });
  }

  buttonText() {
    const { gameState } = this.state;
    switch (gameState) {
      default:
      case 'new':
        return 'Start new round';
      case 'call':
        return 'Set call values';
      case 'hand':
        return 'Set hand values';
      case 'compute':
        return 'Compute score';
    }
  }

  displayError() {
    const { error } = this.state;
    return (<div>{error}</div>);
  }

  showPlayers() {
    const { players } = this.state;
    return players.map(e => e.component);
  }

  updateInputName(dummy) {
    this.setState({
      dummy
    });
  }

  gameStateClick() {
    let { round, gameState, players, error, inputValues } = this.state;
    const refs = players.map(e => e.ref.current);
    switch (gameState) {
      case 'new':
        if (round > 0)
          refs.forEach(p => p.updateRound());
        round = round + 1;
        gameState = 'call';
        break;
      case 'call':
        let calls = inputValues;
        const validCalls = calls.every(v => v >= 2),
              sumCalls = calls.reduce((a, b) => a + b, 0);
        if (!validCalls) {
          error = 'All players should at least have a call value of 2';
        } else if (sumCalls > 13) {
          error = 'Sum of call values should not exceed 13';
        } else {
          error = '';
          gameState = 'hand';
          refs.forEach((p, i) => p.setCall(inputValues[i]));
          this.resetInput();
        }
        break;
      case 'hand':
        let hands = inputValues;
        const validHands = hands.every(v => v >= 0),
              sumHands = hands.reduce((a, b) => a + b, 0);
        if (!validHands) {
          error = 'Hands value should be a positive number or 0';
        } else if (sumHands > 13) {
          error = 'Sum of hands should not exceed 13';
        } else {
          error = '';
          gameState = 'compute';
          refs.forEach((p, i) => p.setHand(inputValues[i]));
          this.resetInput();
        }
        break;
      case 'compute':
        refs.forEach(p => p.computeScore());
        gameState = 'new';
        break;
      default:
        error = 'Entered unknown state.';
        gameState = 'new';
        break;
    }
    this.setState({
      error,
      round,
      gameState
    });
  }

  newPlayer() {
    const { players, dummy } = this.state;
    if (dummy.length <= 2 ) {
      this.setState({
        error: 'Name should be at least 3 characters'
      });
    } else {
      const ref = createRef();
      players.push({
        ref,
        component: <PlayerComponent name={dummy} ref={ref} />
      })
      this.setState({
        players,
        error: '',
        dummy: ''
      });
    }
  }

  setPlayerValue(index, value) {
    const { inputValues } = this.state;
    inputValues[index] = parseInt(value);
    this.setState({
      inputValues
    });
  }

  render() {
    const { players, dummy, round, inputValues } = this.state;
    let elements = null;
    if (players.length < 4) {
      elements = (
        <div>
          <p>
            Please enter player #{players.length + 1}'s name
          </p>
          <input
            name="playerName"
            type="text"
            value={dummy}
            placeholder="Enter name"
            onChange={e => {this.updateInputName(e.target.value)}}
          />
          <button onClick={() => {this.newPlayer()}}>Submit</button>
        </div>
      );
    } else {
      elements = (
        <div>
          <h2>Round {round}</h2>
          <p>
            <input type="number" max="13" value={inputValues[0]} onChange={e => {this.setPlayerValue(0, e.target.value);}} required />
            <input type="number" max="13" value={inputValues[1]} onChange={e => {this.setPlayerValue(1, e.target.value);}} required />
            <input type="number" max="13" value={inputValues[2]} onChange={e => {this.setPlayerValue(2, e.target.value);}} required />
            <input type="number" max="13" value={inputValues[3]} onChange={e => {this.setPlayerValue(3, e.target.value);}} required />
          </p>
          <div>
            <button onClick={() => this.gameStateClick()}>
              {this.buttonText()}
            </button>
          </div>
          <div>{this.showPlayers()}</div>
        </div>
      );
    }
    return (
      <div>
        {this.displayError()}
        {elements}
      </div>
    );
  }
}
