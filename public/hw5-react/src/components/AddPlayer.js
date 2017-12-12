import React, { Component } from 'react';
import Header from './Header';
import { connect } from "react-redux";
import firestoreDB from '../js/database';
import helper from '../js/helper.js';

var imageSet = false;

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class AddPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerImage: "https://firebasestorage.googleapis.com/v0/b/cse134-bfd99.appspot.com/o/anonymous.png?alt=media&token=ca24586f-2e60-425d-9cc7-6ed2c7276c4c",
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.validatePlayerForm = this.validatePlayerForm.bind(this);
  }

  uploadImage() {
    helper.uploadLogo('playerimagefield','playerbuttonimg');
    imageSet = true;
  }

  validatePlayerForm() {
    var player = {
      name: "",
      position: "",
      image: "",
      number: 0,
      goals: 0,
      fouls: 0,
      yellowCards: 0,
      redCards: 0,
      shotsOnGoal: 0,
      cornerKicks: 0,
      penalties: 0,
      throwIns: 0,
      gamesPlayed: 0,
    };
    var incomplete = false;
    var playerForm = document.getElementById('addplayerform');
    player.name = playerForm.elements['playername'].value;
    player.number = playerForm.elements['playernumber'].value;
    player.position = playerForm.elements['playerposition'].value;
    if (imageSet) {
      player.image = document.getElementById('playerbuttonimg').src;
    }
    incomplete = player.name === "" || player.number === "" ||  player.position === "";
    if(incomplete){
      helper.displayMessage("addplayer_error", "error", "Please fill out all fields.");
    }
    else{
      helper.displayMessage("addplayer_error", "confirm", "Adding player...");
      firestoreDB.addNewPlayer(this.props.userProfile.teamID, player)
        .catch(function(e) {
        })
        .then(function() {
          window.location='players';
        });

    }
  }

  render() {
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <div className="outercontainer">
            <div className="playerpreview">
              <h2>Add Player</h2>
              <p>Upload a Picture:</p>
              <form id="addplayerpictureform">
                <input type="file" name="playerpic" accept="image/*" id="playerimagefield"></input>
                <input type="button" value="Upload" onClick={() => {this.uploadImage()}}></input>
              </form>
              <img id="playerbuttonimg" src={this.state.playerImage} alt="Player"></img>
            </div>
            <form className="playerform" id="addplayerform" name="addeventform">
                <input type="text" id="playername" className="addplayerformfield" placeholder="Enter Player Name"></input>
                <input type="number" id="playernumber" className="addplayerformfield" placeholder="Enter Player Number"></input>
                <input type="text" id="playerposition" className="addplayerformfield" placeholder="Enter Player Position"></input>
                <input type="button" className="addplayerbutton" value="Add Player" onClick={() => {this.validatePlayerForm()}}></input>
                <span className="message" id="addplayer_error"></span>
            </form>
          </div>
      </div>
    );
  }
}

export default connect(stateMap)(AddPlayer);
