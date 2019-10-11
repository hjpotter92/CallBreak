import React, { Component } from 'react';

export default class PlayerComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name: props.name,
      rounds: [],
      hand: 0,
      call: 0,
      currentScore: 0,
      totalScore: 0
    };
  }

  getTotalScore() {
    return this.state.totalScore;
  }

  updateRound() {
    const { hand, call, currentScore, rounds } = this.state;
    rounds.push({
      call: call,
      hand: hand,
      score: currentScore
    });
    this.setState({
      rounds,
      call: 0,
      hand: 0,
      currentScore: 0
    });
  }

  computeScore() {
    const { hand, call } = this.state;
    let score = 0;
    if ((call > hand) || ((call + 2) < hand)) {
      score = hand * -10;
    } else if (call >= 7) {
      score = 140;
    } else {
      score = call * 10 + 2 * (hand - call);
    }
    this.setState({
      currentScore: score
    });
  }

  render() {
    const { name, totalScore, call } = this.state;
    return (
      <div>
        <p>{name}</p>
        <p>{totalScore}</p>
        <p>{call}</p>
      </div>
    );
  }
};
