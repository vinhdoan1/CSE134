import React, { Component } from 'react';
import { connect } from "react-redux";
import firebase from '../js/firebase.js'
import firestoreDB from '../js/database';
import helper from '../js/helper.js';
//Assets
import logo from './../images/soccerball.png';
//Components
import Header from'./Header';
import { login } from "../actions/";


const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
    this.authenticate = this.authenticate.bind(this);
  }

  render() {
      return (
        <div className="Login">
          <h1 className="logo">TeamWatch</h1>
          <img id="logoimg" src={logo} alt="TeamWatch Logo"/>
          <form id="loginform" name="loginform" action="team.html">
              <input type="email" id="username" name="username" className="forminput" placeholder="Email"/>
              <input type="password" id="password" name="password" className="forminput" placeholder="Password"/>
              <input type="button" className="formbutton" value="Log In" onClick={()=> this.authenticate()}/>
              <input type="button" className="formbutton" value="Sign Up" onClick={()=> this.props.history.push('/signup')}/>
          </form>
          <div className="message" id="loginmsg"> </div>
        </div>
      );
    // }

  }

  authenticate() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/invalid-email') {
        helper.displayMessage("loginmsg", "error", "Invalid e-mail");
      }
      else if(errorCode === 'auth/user-not-found'){
        helper.displayMessage("loginmsg", "error", "No user found with that e-mail");
      }
      else if(errorCode === 'auth/wrong-password'){
        helper.displayMessage("loginmsg", "error", "Wrong email password combination");
      }
      else {
        helper.displayMessage("loginmsg", "error", "There was a problem trying to sign in");
        console.log(errorMessage);
      }
    })
    .then(function(loggedUser) {
      if (!loggedUser) {
        return;
      }
      firestoreDB.getUser(loggedUser.uid).then(function (userData) {
        if(userData){
          var user = userData.data();
          var userProf = {}
          userProf.teamID = user.team;
          userProf.admin = user.admin;
          this.props.dispatch(login(userProf));
          this.props.history.push('/team');
        }
      }.bind(this));
    }.bind(this));
  }
}

export default connect(stateMap)(Login);
