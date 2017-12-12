import React, { Component } from 'react';
import Header from './Header';

class Test extends Component {
  render() {
    return (
      <div className="App">
        <Header history={this.props.history} backButton homeLink="/" logout/>
        <p className="App-intro">
          LMAOOOO
        </p>
      </div>
    );
  }
}

export default Test;

