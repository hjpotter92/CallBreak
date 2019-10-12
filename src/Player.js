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

  getCall() {
    const { call } = this.state;
    return call;
  }

  getHand() {
    const { hand } = this.state;
    return hand;
  }

  setCall(call) {
    this.setState({ call });
  }

  setHand(hand) {
    this.setState({ hand });
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
    const { hand, call, totalScore } = this.state;
    let score = 0;
    if ((call > hand) || ((call + 2) < hand)) {
      score = Math.max(call, hand) * -10;
    } else if (call >= 7) {
      score = 140;
    } else {
      score = call * 10 + 2 * (hand - call);
    }
    this.setState({
      currentScore: score,
      totalScore: totalScore + score
    });
  }

  render() {
    const { name, totalScore, call, hand } = this.state;
    return (
      <div>
        <p>{name}</p>
        <p>Score: {totalScore}</p>
        <p>Current call: {call}</p>
        <p>Current hand: {hand}</p>
      </div>
    );
  }
};
