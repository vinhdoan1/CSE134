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

class EditOpponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      opponent: undefined,
    }
    this.populateOpponentData = this.populateOpponentData.bind(this);
    this.updateOpponent = this.updateOpponent.bind(this);
  }

  render(){
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <h2 id="h2">Edit Opponent Information</h2>
        <div id="changenamecontainer">
          <p>Opponent Name:</p>
          <input type="text" id="newopname" className="settingsinput" placeholder="Opponent Name"/>
        </div>
        <div id="changelogocontainer">
          <p>Opponent Logo:</p>
          <div className="fileuploadcontainer">
            <input className="logoupload" id="editop_logoupload" type="file"/>
            <input type="button" value="Upload" onClick={()=>helper.uploadLogo('editop_logoupload','editop_teamimg')}/>
          </div>
          <div className="teamimgcontainer">
            <img className="teamimg" id="editop_teamimg" src={helper.defaultLogo} alt="Team Logo"/>
          </div>
        </div>
        <input type="button" className="settingsbutton" value="Update Opponent Information" onClick={()=> this.updateOpponent()}/>
        <input type="button" className="settingsbutton" id="deleteopponentbtn" value="Delete Opponent" onClick={()=>this.deleteOpponent()}/>
        <div className="message" id="editopmsg"> </div>
      </div>
    );
   
  }

  componentDidMount() {
    this.populateOpponentData(this.props.userProfile);
    this.setState({opponent: this.props.userProfile.opponent});
    // this.reduxLoaded(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userProfile !== nextProps.userProfile) {
      this.populateOpponentData(nextProps.userProfile);
      this.setState({opponent: nextProps.userProfile.opponent});
    }
  }

  populateOpponentData(userProfile){
    if(userProfile.opponent){
      var opponent = userProfile.opponent;
      document.getElementById('newopname').value = opponent.name;
      document.getElementById('editop_teamimg').src = opponent.logo;
    }
  }
  
  
  updateOpponent(){
    var changesMade = false;
    var newOpName = document.getElementById('newopname').value;
    var newOpLogo = document.getElementById('editop_teamimg').src;
    var teamID = this.props.userProfile.teamID;
    var opID = this.state.opponent.opID;

    if(this.state.opponent){
      console.log(this.state.opponent.name);
      // console.log(this.state.opponent.logo);
      if(newOpName != this.state.opponent.name){
        this.state.opponent.name  = newOpName;
        changesMade = true;
      }
      if(newOpLogo != this.state.opponent.logo){
        this.state.opponent.logo = newOpLogo;
        changesMade = true;
      }
      if(newOpName === ""){
        helper.displayMessage("editopmsg", "error", "Opponent team name cannot be empty");
      }
      else{
        helper.hideMessage('editopmsg');
        if(changesMade){
          var newOpponent = {
            name: this.state.opponent.name,
            logo: this.state.opponent.logo
          };
          firestoreDB.setOpponent(teamID, opID, newOpponent).then(function(){
            this.props.dispatch(setOpponent(newOpponent));
            helper.displayMessage("editopmsg", "confirm", "Opponent information updated");
          }.bind(this));
        }
      }
      console.log(changesMade);
    }
  }
  
  
  deleteOpponent(){
    var opID = this.state.opponent.opID;
    var teamID = this.props.userProfile.teamID;
    if(teamID){
      firestoreDB.deleteOpponent(teamID,opID)
      .catch(function(error){
        helper.displayMessage("editopmsg", "error", "There was a problem trying to delete opponent");
        console.log(error);
      })
      .then(function(){
        this.props.history.push('/manageopponents');
      }.bind(this));
    }
  }
}


export default connect(stateMap)(EditOpponent);