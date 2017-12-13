import React, {Component} from 'react';
import { connect } from 'react-redux';
import { login } from "../actions/";
import firebase from '../js/firebase.js';
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
import Header from './Header';
import { userInfo } from 'os';
import { firestore } from 'firebase';
import {setOpponent } from '../actions';

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};

class AddOpponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      opponent: undefined,
    }
    this.validateAddOpponentForm = this.validateAddOpponentForm.bind(this);
  }

  render(){
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <h1>Add Opponent Team</h1>
        <h3>Enter the opponent team's name:</h3>
        <input type="text" id="opteaminput" placeholder="Team Name"/>
        <div className="fileuploadcontainer">
          <span>Upload Logo:</span> <input className="logoupload" id="opponent_logoupload" type="file"/>
          <input type="button" value="Upload" onClick={()=>helper.uploadLogo('opponent_logoupload', 'opponent_teamimg')}/>
        </div>
        <div className="teamimgcontainer">
          <img className="teamimg" id="opponent_teamimg" src={helper.defaultLogo} alt="Team Logo"/>
        </div>
        <input type="button" className="formbutton" value="Add Opponent" onClick={()=> this.validateAddOpponentForm()}/>
        <div className="message" id="addopmsg"></div>
      </div>
    );
   
  }
  
  validateAddOpponentForm(){
    var incomplete = false;
    var opponent = {
      name: "",
      logo: "",
      active: true
    }
    opponent.name = document.getElementById('opteaminput').value;
    incomplete = opponent.name == "";

    var opLogo = document.getElementById('opponent_teamimg').src;
    if(opLogo != ""){
      opponent.logo = opLogo;
    }
    if(incomplete){
      helper.displayMessage("addopmsg", "error", "Please fill out a team name");
    }
    else{
      helper.hideMessage("addopmsg");
      this.addOpponent(opponent).then(function(){
        this.props.history.goBack();
      }.bind(this));
    }
  }

  addOpponent(opponent){
    var teamID = this.props.userProfile.teamID;
    return firestoreDB.addOpponent(teamID, opponent.name, opponent.logo);
  }
}


export default connect(stateMap)(AddOpponent);