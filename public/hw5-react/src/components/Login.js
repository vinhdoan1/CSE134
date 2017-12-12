import React, { Component } from 'react';
import logo from './../images/soccerball.png';
import '../js/database.js';
import '../js/helper.js';

//Import Components
import Header from'./Header';
import './../css/style.css';


class Login extends Component {
  render() {
    return (
      <div className="Login">
        <Header history={this.props.history} backButton homeLink="/" logout/>
        <h1 className="logo">TeamWatch</h1>
        <img id="logoimg" src={logo} alt="TeamWatch Logo"/>
        <form id="loginform" name="loginform" action="team.html">
            <input type="email" id="username" name="username" className="forminput" placeholder="Email"/>
            <input type="password" id="password" name="password" className="forminput" placeholder="Password"/>
            <input type="button" className="formbutton" value="Log In" onClick="authenticate(this.form);"/>
            <input type="button" className="formbutton" value="Sign Up" onClick="window.location='signup.html';"/>
        </form>
        <div className="message" id="loginmsg"> </div>
      </div>
    );
  }

  authenticate(form) {
    var username = form.username.value;
    var password = form.password.value;
    //var dummyemail = username + "@teamwatch.com";
    //Firebase auth
    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/invalid-email') {
        displayMessage("loginmsg", "error", "Invalid e-mail");
      }
      else if(errorCode == 'auth/user-not-found'){
        displayMessage("loginmsg", "error", "No user found with that e-mail");
      }
      else if(errorCode == 'wrong-password'){
        displayMessage("loginmsg", "error", "Wrong password");
      }
      else {
        displayMessage("loginmsg", "error", "There was a problem trying to sign in");
      }
    })
    .then(function(user) {
      if (user) {
        firestoreDB.getUser(user.uid).then(function(user) {
          mainState.setState("teamID", user.data().team);
          mainState.setState("admin", user.data().admin);
          mainState.setState('loggedIn', true);
          this.props.history.push('/team.html');
          // window.location='team.html';
        });
      }
    });
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
    displayMessage("checkinvmsg", "error", "Please enter a valid Team ID");
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
        displayMessage("checkinvmsg", "error", "Couldn't find team with that ID");
      }

    }).catch(function(error){
      displayMessage("checkinvmsg", "error", "Couldn't find team with that ID");
    });
  }
}

function signUpNonAdmin(){
  if(!validTeam){
    displayMessage("signupinvmsg", "error", "Please verify your team above");
  }
  else{
    var incomplete = false;
    var teamForm = document.getElementById('signupform_inv');
    var email = teamForm.elements['invemail'].value;
    var pass1 = teamForm.elements['invpass1'].value;
    var pass2 = teamForm.elements['invpass2'].value;
    incomplete = name == "" || email == "" || pass1 == "" || pass2 == "";
    if(incomplete){
      displayMessage("signupinvmsg", "error", "Please fill out all fields");
    }
    else{
      //check team
      var teamID = document.getElementById('inviteinput').value;
      if(teamID == ""){
        displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
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
            displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
          }

        }).catch(function(error){
          displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
        });
      }
    }
  }*/
