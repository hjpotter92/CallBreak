import React, { Component } from 'react';
import PlayerComponent from './Player';

export default class GameComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy: '',
      players: [],
      round: 0,
      error: ''
    };
  }

  displayError() {
    const { error } = this.state;
    return (<div>{error}</div>);
  }

  updateInputName(dummy) {
    this.setState({
      dummy
    });
  }

  newRound() {
    const { round } = this.state;
    this.setState({
      round: round + 1
    });
  }

  newPlayer() {
    const { players, dummy } = this.state;
    if (dummy.length <= 3 ) {
      this.setState({
        error: 'Name should be at least 3 characters'
      });
    } else {
      players.push({
        component: <PlayerComponent name={dummy} />
      })
      this.setState({
        players
      });
    }
  }

  render() {
    const { players } = this.state;
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
            placeholder="Enter name"
            onChange={e => {this.updateInputName(e.target.value)}}
          />
          <button onClick={() => {this.newPlayer()}}>Submit</button>
        </div>
      );
    } else {
      elements = (
        <div>
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
