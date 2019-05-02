import React, { Component } from 'react';

class Home extends Component {

  state = {
    number: 0
  };

  handleClick = () => {
    this.setState({
      number: this.state.number + 1
    });
    console.log(this.state.number);
  };

  render() {
    return (
      <div>
        <h1>HELLO, HOME PAGE</h1>
        <h2>number: {this.state.number}</h2>
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}

export default Home;