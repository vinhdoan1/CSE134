import React, { Component } from 'react';
import firebase from '../js/firebase.js'
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
//assets
import logo from './../images/soccerball.png';

//Import Components
import Header from'./Header';
import './../css/style.css';
// import { Redirect } from 'react-router-dom';

class Login extends Component {
  constructor(){
    super();
    this.state = {
      signedIn : false
    };
    this.authenticate = this.authenticate.bind(this);
  }

  render() {
    // if(this.state.signedIn){
    //   this.props.history.push('/team');
    //   return null;
    // }
    // else{
      return (
        <div className="Login">
          <Header history={this.props.history} backButton homeLink="/" logout/>
          <h1 className="logo">TeamWatch</h1>
          <img id="logoimg" src={logo} alt="TeamWatch Logo"/>
          <form id="loginform" name="loginform" action="team.html">
              <input type="email" id="username" name="username" className="forminput" placeholder="Email"/>
              <input type="password" id="password" name="password" className="forminput" placeholder="Password"/>
              <input type="button" className="formbutton" value="Log In" onClick={()=> this.authenticate()}/>
              <input type="button" className="formbutton" value="Sign Up"/>
          </form>
          <div className="message" id="loginmsg"> </div>
        </div>
      );
    // }
    
  }

  authenticate() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    //var dummyemail = username + "@teamwatch.com";
    //Firebase auth
    console.log(this);
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
    .then(function(user) {
      if(user){
        this.props.history.push('/team');
      }
      
      // if (user) {
      //   firestoreDB.getUser(user.uid).then(function(user) {
      //     // mainState.setState("teamID", user.data().team);
      //     // mainState.setState("admin", user.data().admin);
      //     // mainState.setState('loggedIn', true);
      //     // console.log(this);

      //     // this.props.history.push('/team.html');
      //     // window.location='team.html';
      //   });
      // }
    }.bind(this));
  }
}

export default Login;

/*
function createTeam() {
  var incomplete = false;
  var teamForm = document.getElementById('signupform');
  var name = document.getElementById('teaminput').value;
  var email = teamForm.elements['teamEmail'].value;
  var pass1 = teamForm.elements['teamPass1'].value;
  var pass2 = teamForm.elements['teamPass2'].value;
  var picture = document.getElementById('newteam_teamimg').src;
  incomplete = name == "" || email == "" || pass1 == "" || pass2 == "";
  var signup_error = document.getElementById('signup_error');
  if(incomplete){
    signup_error.innerText = "Please fill out all fields."
  } else if (pass1 != pass2) {
    signup_error.innerText =  "Passwords do not match."
  }
  else{
    firebase.auth().createUserWithEmailAndPassword(email, pass1)
    .then(function (user) {
      // successful account creation
      signup_error.innerText = "";
      firestoreDB.addTeam(name, picture).then(function(teamData) {
        var teamKey = teamData.id;
        firestoreDB.addUser(user.uid, teamKey, true).then(function(userKey) {
          mainState.setState("teamID", teamKey);
          mainState.setState("admin", true);
          window.location='team.html';
        });
      });
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        signup_error.innerText = "Account already in use."
      } else if (errorCode === 'auth/invalid-email') {
        signup_error.innerText = "Email not valid."
      } else if (errorCode === 'auth/weak-password') {
        signup_error.innerText = "Password not valid."
      }
    });
  }
}

var validTeam = false;
function checkTeam(){
  document.getElementById('hiddendiv').hidden = true;
  hideMessage("checkinvmsg");
  var teamID = document.getElementById('inviteinput').value;
  if(teamID == ""){
    helper.displayMessage("checkinvmsg", "error", "Please enter a valid Team ID");
  }
  else{
    firestoreDB.getTeam(teamID).then(function(team){
      if(team.exists){
        var teamData = team.data();
        validTeam = true;
        document.getElementById("signupinv_teamname").innerHTML="<b>" + teamData.name +"</b>";
        document.getElementById("signupinv_teamlogo").src=teamData.logo;
        document.getElementById('hiddendiv').hidden = false;
      }
      else{
        helper.displayMessage("checkinvmsg", "error", "Couldn't find team with that ID");
      }

    }).catch(function(error){
      helper.displayMessage("checkinvmsg", "error", "Couldn't find team with that ID");
    });
  }
}

function signUpNonAdmin(){
  if(!validTeam){
    helper.displayMessage("signupinvmsg", "error", "Please verify your team above");
  }
  else{
    var incomplete = false;
    var teamForm = document.getElementById('signupform_inv');
    var email = teamForm.elements['invemail'].value;
    var pass1 = teamForm.elements['invpass1'].value;
    var pass2 = teamForm.elements['invpass2'].value;
    incomplete = name == "" || email == "" || pass1 == "" || pass2 == "";
    if(incomplete){
      helper.displayMessage("signupinvmsg", "error", "Please fill out all fields");
    }
    else{
      //check team
      var teamID = document.getElementById('inviteinput').value;
      if(teamID == ""){
        helper.displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
      }
      else{
        firestoreDB.getTeam(teamID).then(function(team){
          if(team.exists){
            //create user
            firebase.auth().createUserWithEmailAndPassword(email, pass1).then(function (user) {
              firestoreDB.addUser(user.uid, teamID, false).then(function(userKey) {
                  mainState.setState("teamID", teamID);
                  mainState.setState("admin", false);
                  window.location='team.html';
              });
            });
          }
          else{
            helper.displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
          }

        }).catch(function(error){
          helper.displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
        });
      }
    }
  }*/
