import React, {Component} from 'react';
import { connect } from 'react-redux';
import { login } from "../actions/";
import firebase from '../js/firebase.js';
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
//Components
import Header from './Header';

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};

class SignupFan extends Component {
  constructor(props){
    super(props);
    this.state = {
      validTeam : false
    }
    this.checkTeam = this.checkTeam.bind(this);
    this.signUpNonAdmin = this.signUpNonAdmin.bind(this);
  }

  render(){
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/login" logout/>
        <div id="teaminputcontainer">
          <h1>Sign Up</h1>
          <p>Enter a Team ID</p>
          <input type="text" id="inviteinput" placeholder="TeamID"/>
          <button id="checkbutton" type="button" onClick={()=>this.checkTeam()}>Check</button>
          <div className="message" id="checkinvmsg">  </div>
        </div>
        <div id="hiddendiv" hidden>
            <p>You are signing up to watch:</p>
            <p id="signupinv_teamname"><b>Team Name</b>!</p>
            <div className="teamimgcontainer">
              <img className="teamimg" id="signupinv_teamlogo" src="" alt="Team Logo"/>
            </div>
        </div>
        <form id="signupform_inv" name="signupform" action="team.html">
          <input type="email" className="forminput" placeholder="E-mail" id="invemail"/>
          <input type="password" className="forminput" placeholder="Password" id="invpass1"/>
          <input type="password" className="forminput" placeholder="Confirm Password" id="invpass2"/>
          <input type="button" className="formbutton" value="Sign Up" onClick={()=>this.signUpNonAdmin()}/>
          <div className="message" id="signupinvmsg"> </div>
        </form>
      </div>
    );
  }

  checkTeam(){
    document.getElementById('hiddendiv').hidden = true;
    helper.hideMessage("checkinvmsg");
    var teamID = document.getElementById('inviteinput').value;
    if(teamID === ""){
      helper.displayMessage("checkinvmsg", "error", "Please enter a valid Team ID");
    }
    else{
      firestoreDB.getTeam(teamID)
      .catch(function(error){
        helper.displayMessage("checkinvmsg", "error", "Couldn't find team with that ID");
        console.log(error.message);
      })
      .then(function(team){
        if(team.exists){
          var teamData = team.data();
          this.setState({validTeam: true});
          document.getElementById("signupinv_teamname").innerHTML="<b>" + teamData.name +"</b>";
          document.getElementById("signupinv_teamlogo").src=teamData.logo;
          document.getElementById('hiddendiv').hidden = false;
        }
        else{
          helper.displayMessage("checkinvmsg", "error", "Couldn't find team with that ID");
        }
      }.bind(this));
    }
  }

  signUpNonAdmin(){
    if(!this.state.validTeam){
      helper.displayMessage("signupinvmsg", "error", "Please verify your team above");
    }
    else{
      var incomplete = false;
      var teamForm = document.getElementById('signupform_inv');
      var email = teamForm.elements['invemail'].value;
      var pass1 = teamForm.elements['invpass1'].value;
      var pass2 = teamForm.elements['invpass2'].value;
      incomplete = email === "" || pass1 === "" || pass2 === "";
      if(incomplete){
        helper.displayMessage("signupinvmsg", "error", "Please fill out all fields");
      }
      else if(pass1 !== pass2){
        helper.displayMessage("signupinvmsg", "error", "Passwords must match");
      }
      else{
        //check team
        var teamID = document.getElementById('inviteinput').value;
        if(teamID === ""){
          helper.displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
        }
        else{
          firestoreDB.getTeam(teamID)
          .catch(function(error){
            helper.displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
          })
          .then(function(team){
            if(team.exists){
              //create user
              firebase.auth().createUserWithEmailAndPassword(email, pass1)
              .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                  helper.displayMessage("signupinvmsg", "error", "E-mail already in use");
                } else if (errorCode === 'auth/invalid-email') {
                  helper.displayMessage("signupinvmsg", "error", "Invalid email");
                } else if (errorCode === 'auth/weak-password') {
                  helper.displayMessage("signupinvmsg", "error", "Password must be at least 6 characters");
                }
                else{
                  helper.displayMessage("signupinvmsg", "error", "There was a problem signing up");
                  console.log(errorMessage);
                }
              })
              .then(function (user) {
                if(user){
                  firestoreDB.addUser(user.uid, teamID, false).then(function(userKey) {
                    var userProf = {};
                    userProf.teamID = teamID;
                    userProf.admin = false;
                    this.props.dispatch(login(userProf)); 
                    this.props.history.push('/team');
                  }.bind(this));
                }
              }.bind(this));
            }
            else{
              helper.displayMessage("signupinvmsg", "error", "Please enter a valid Team ID");
            }
          }.bind(this));
        }
      }
    }
  }
}
export default connect(stateMap)(SignupFan);
