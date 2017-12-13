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

class EditTeam extends Component{
  constructor(props){
    super(props);
    this.populateEditTeamPage = this.populateEditTeamPage.bind(this);
    this.updateTeam = this.updateTeam.bind(this);
  }

  render(){
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <h2 id="h2">Edit Team Information</h2>
        <div id="changenamecontainer">
          <p>Team Name:</p>
          <input type="text" id="newteamname" className="settingsinput" placeholder="Team Name"/>
        </div>
        <div id="changelogocontainer">
          <p>Team Logo:</p>
          <div className="fileuploadcontainer">
            <input className="logoupload" id="editteam_logoupload" type="file"/>
            <input type="button" value="Upload" onClick={()=>helper.uploadLogo('editteam_logoupload','editteam_teamimg')}/>
          </div>
          <div className="teamimgcontainer">
            <img className="teamimg" id="editteam_teamimg" src={helper.defaultLogo} alt="Team Logo"/>
          </div>
        </div>
        <input type="button" className="settingsbutton" value="Update Team Information" onClick={()=>this.updateTeam()}/>
        <div className="message" id="editteammsg"></div>
      </div>
    );
  }

  componentDidMount() {
    this.populateEditTeamPage(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userProfile !== nextProps.userProfile) {
      this.populateEditTeamPage(nextProps.userProfile);
    }
  }

  populateEditTeamPage(userProfile){
    var teamID = userProfile.teamID;
    if(teamID !== ""){
      firestoreDB.getTeam(teamID).then(function(team){
        var teamData = team.data();
        document.getElementById('newteamname').value = teamData.name;
        document.getElementById('editteam_teamimg').src = teamData.logo;
      })
    }
  }

  updateTeam(){
    var teamID = this.props.userProfile.teamID;
    if(teamID !== ""){
      firestoreDB.getTeam(teamID).then(function(team){
        var teamData = team.data();
        var newTeamName = document.getElementById('newteamname').value;
        newTeamName = newTeamName.replace(/\s+/g, '');
    
        var changesMade = false;
        if(newTeamName !== teamData.name && newTeamName != ""){
          teamData.name = newTeamName;
          changesMade = true;
        }
        var newTeamLogo = document.getElementById('editteam_teamimg').src;
        if(newTeamLogo !== teamData.logo){
          teamData.logo = newTeamLogo;
          changesMade = true;
        }
        if(newTeamName === ""){
          helper.displayMessage("editteammsg", "error", "Team name cannot be empty");
        }
        else{
          helper.hideMessage('editteammsg');
          if(changesMade){
            firestoreDB.setTeam(teamID, teamData);
            helper.displayMessage("editteammsg", "confirm", "Team information updated");
          }
        }  
      });
    }
  }

}

export default connect(stateMap)(EditTeam);

