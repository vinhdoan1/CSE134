import React, {Component} from 'react';
import firebase from '../js/firebase.js';
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
//Assets
import defaultLogo from '../images/default.jpg';
//Components
import Header from './Header';

class SignupCoach extends Component {
  constructor(props){
    super(props);
    this.signUpAdmin = this.signUpAdmin.bind(this);
  }

  render(){
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/" logout/>
        <h1>Sign Up</h1>
        <h3>Enter your team's name:</h3>
        <input type="text" id="teaminput" placeholder="Team Name"/>
        <div className="fileuploadcontainer">
          <p>Upload Logo:</p> 
          <input className="logoupload" id="newteam_logoupload" type="file"/>
          <input type="button" value="Upload" onClick={()=> helper.uploadLogo('newteam_logoupload','newteam_teamimg')}/>
        </div>
        <div className="teamimgcontainer">
          <img className="teamimg" id="newteam_teamimg" src={defaultLogo} alt="Team Logo"/>
        </div>
        <form id="signupform" name="signupform">
          <input type="email" className="forminput" placeholder="E-mail" id="teamEmail"/>
          <input type="password" className="forminput" placeholder="Password" id="teamPass1"/>
          <input type="password" className="forminput" placeholder="Confirm Password" id="teamPass2"/>
          <span className="error-text" id="signup_error"></span>
          <input type="button" className="formbutton" value="Sign Up" onClick={()=> this.signUpAdmin()}/>
          <div className="message" id="signupcoachmsg"> </div>
        </form>
      </div>
    );
  }

  signUpAdmin(){
    var incomplete = false;
    var teamForm = document.getElementById('signupform');
    var name = document.getElementById('teaminput').value;
    var email = teamForm.elements['teamEmail'].value;
    var pass1 = teamForm.elements['teamPass1'].value;
    var pass2 = teamForm.elements['teamPass2'].value;
    var picture = document.getElementById('newteam_teamimg').src;
    incomplete = name === "" || email === "" || pass1 === "" || pass2 === "";

    if(incomplete){
      helper.displayMessage("signupcoachmsg", "error", "Please fill out all fields");
    } else if (pass1 !== pass2) {
      helper.displayMessage("signupcoachmsg", "error", "Passwords do not match");
    }
    else{
      firebase.auth().createUserWithEmailAndPassword(email, pass1)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          helper.displayMessage("signupcoachmsg", "error", "E-mail already in use");
        } else if (errorCode === 'auth/invalid-email') {
          helper.displayMessage("signupcoachmsg", "error", "Invalid email");
        } else if (errorCode === 'auth/weak-password') {
          helper.displayMessage("signupcoachmsg", "error", "Password must be at least 6 characters");
        }
        else{
          helper.displayMessage("signupcoachmsg", "error", "There was a problem signing up");
          console.log(errorMessage);
        }
      })
      .then(function (user) {
        // successful account creation
        helper.hideMessage("signupcoachmsg");
        firestoreDB.addTeam(name, picture).then(function(teamData) {
          var teamKey = teamData.id;
          firestoreDB.addUser(user.uid, teamKey, true).then(function(userKey) {
            // mainState.setState("teamID", teamKey);
            // mainState.setState("admin", true);
            // window.location='team.html';
            console.log("sign up success");
            this.props.history.push('/team');
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }
  }
}
export default SignupCoach;