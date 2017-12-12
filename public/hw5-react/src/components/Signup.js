import React, { Component } from 'react';
import Header from './Header';

class Signup extends Component {
  render() {
    return (
      <div>
        <Header history={this.props.history} backButton homeLink="/login" logout/>
        <div>
          <h1>Sign Up</h1>
          <h3>What type of user are you?</h3>
          <div>
            <button type="button" className="signupbutton" onClick={()=> this.props.history.push('/signupcoach')}>
              I am a Team Manager/Coach.<br/>(Create a new team)
            </button>
            <button type="button" className="signupbutton" onClick={()=> this.props.history.push('/signupfan')}>
              I am a Player/Fan.<br/>(Sign up by Team ID)
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;

