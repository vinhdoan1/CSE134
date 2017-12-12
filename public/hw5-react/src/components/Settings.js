import React, {Component} from 'react';
import { connect } from 'react-redux';
import { login } from "../actions/";
import firebase from '../js/firebase.js';
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
import Header from './Header';

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};

class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      needsReauth: false,
      hidden: true,
      userEmail: "",
    }
    this.populateSettingsPage = this.populateSettingsPage.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.reauthenticate = this.reauthenticate.bind(this);
    this.copyTeamIDToClipboard = this.copyTeamIDToClipboard.bind(this);
  }

  render() {
    return (
      <div>
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <div>
          <h1>Settings</h1>
          <div id="accountsettings" className="settingsdiv">
            <h3>Account Settings</h3>
            <input type="email" id="newemail" className="settingsinput" placeholder="E-mail"/>
            <div id="reauth" hidden={!this.state.needsReauth}>
              <p id="reauth_msg">Please verify your password to continue:</p>
              <input type="password" id="reauth_pw" className="settingsinput" placeholder="Current Password"/>
            </div>
            <input type="button" className="settingsbutton" value="Change Email" onClick={()=> this.updateEmail()}/>
            <div className="message" id="settingsmsg_newemail"> </div>
            <form id="settings_pwform">
              <input type="password" id="newpassword" className="settingsinput" placeholder="New Password"/>
              <input type="password" id="confirmnewpassword" className="settingsinput" placeholder="Confirm New Password"/>
              <input type="password" id="oldpassword" className="settingsinput" placeholder="Current Password"/>
              <input type="button" className="settingsbutton" value="Change Password" onClick={()=>this.updatePassword()}/>
            </form>
            <div className="message" id="settingsmsg_newpassword"> </div>
          </div>
          <div id="teammanagementsettings" className="settingsdiv" hidden={this.state.hideAdmin}>
            <h3>Team Management Settings</h3>
            <input type="button" className="settingsbutton" value="Edit Team Information" onClick={()=> this.props.history.push('/editteam')}/>
            <input type="button" className="settingsbutton" value="Manage Opponents List" onClick={()=> this.props.history.push('/editopponents')}/>
          </div>
          <div id="inviteusers" className="settingsdiv">
            <h3>Invite Users</h3>
            <p>Share your Team ID:</p>
            <p style={{color: 'blue'}} id="teamidinvite"></p>
            <input type="button" className="settingsbutton" value="Copy TeamID" onClick={()=> this.copyTeamIDToClipboard()}/>
            <div className="message" id="invitemsg"></div>
          </div>
        </div>  
      </div>
    );
  }

  populateSettingsPage(userProfile){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        document.getElementById('newemail').value=user.email;
        document.getElementById('teamidinvite').innerHTML = userProfile.teamID;
      }
    });
  }

  componentDidMount() {
    this.setState({hidden: !this.props.userProfile.admin});
    this.populateSettingsPage(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userProfile !== nextProps.userProfile) {
      this.setState({hidden: !nextProps.userProfile.admin});
      this.populateSettingsPage(nextProps.userProfile);
    }
  }
  
  copyTeamIDToClipboard(){
    var textArea = document.createElement("textarea");
    textArea.value = document.getElementById("teamidinvite").innerHTML;
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.select();
    var successful = document.execCommand('copy');
    if(successful){
      helper.displayMessage("invitemsg", "confirm", "Team ID Copied!");
    }
  }
  
  updateEmail(){
    helper.hideMessage('settingsmsg_newemail');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if(this.state.needsReauth){
          var reauthPW = document.getElementById('reauth_pw').value;
          if(reauthPW === ""){
            helper.displayMessage("settingsmsg_newemail", "error", "Please enter your password");
          }
          else{
            this.reauthenticate(user.email, reauthPW, "email");
          }
        }
        else{
          var newEmail = document.getElementById('newemail').value;
          if(newEmail === user.email){
            helper.displayMessage("settingsmsg_newemail", "error", "E-mail is the same as old e-mail")
          } 
          else {
            user.updateEmail(newEmail).then(function() {
              helper.displayMessage("settingsmsg_newemail", "confirm", "E-mail updated");
            }).catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === 'auth/email-already-in-use') {
                helper.displayMessage("settingsmsg_newemail", "error", "E-mail already linked to an account.");
              } else if (errorCode === 'auth/invalid-email') {
                helper.displayMessage("settingsmsg_newemail", "error", "Invalid e-mail");
              } else if (errorCode === 'auth/requires-recent-login'){
                this.setState({needsReauth: true});
              } else{
                helper.displayMessage("settingsmsg_newemail", "error", "Something went wrong :(");
                console.log(error);
              }
            }.bind(this));
          }
        }
      }
    }.bind(this));  
  }
  
  updatePassword(){
    helper.hideMessage('settingsmsg_newpassword');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var newPassword = document.getElementById('newpassword').value;
        var confirmNewPassword = document.getElementById('confirmnewpassword').value;
        var oldPassword = document.getElementById('oldpassword').value;
        if(oldPassword == ""){
          helper.displayMessage("settingsmsg_newpassword", "error", "Please enter your old password");
        } else if(newPassword != confirmNewPassword){
          helper.displayMessage('settingsmsg_newpassword', "error", "Passwords don't match")
        } else{
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
          user.reauthenticateWithCredential(credential).then(function() {
            user.updatePassword(newPassword).then(function() {
              helper.displayMessage("settingsmsg_newpassword", "confirm", "Password updated");
              document.getElementById('settings_pwform').reset();
            }).catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === 'auth/weak-password') {
                helper.displayMessage("settingsmsg_newpassword", "error", "Password must be at least 6 characters");
              } else if (errorCode === 'auth/requires-recent-login'){
                this.reauthenticate(user.email, oldPassword, "password");
              }
            });
          }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              helper.displayMessage("settingsmsg_newpassword", "error", "Wrong password");
            }
            else{
              helper.displayMessage("settingsmsg_newpassword", "error", "Something went wrong");
            }
          });
        }
      }
    });  
  }
  
  reauthenticate(email, password, action){
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    var msg = (action === "email") ? "settingsmsg_newemail" : "settingsmsg_newpassword";
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.reauthenticateWithCredential(credential).then(function() {
          if(action === "email"){
            this.setState({needsReauth: false});
            this.updateEmail();
          }
          else if(action === "password"){
            // updatePassword();
          }
        }.bind(this)).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
           helper.displayMessage(msg, "error", "Wrong password");
          }
          else{
            console.log(error);
            helper.displayMessage(msg, "error", "Something went wrong");
          }
        }.bind(this));
      }
    }.bind(this));
  }
}

export default connect(stateMap)(Settings);

