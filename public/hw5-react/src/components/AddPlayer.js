import React, { Component } from 'react';
import Header from './Header';
import { connect } from "react-redux";
import firestoreDB from '../js/database';

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

  }

  validatePlayerForm() {

  }

  render() {
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/" logout/>
        <div className="outercontainer">
            <div className="playerpreview">
              <h2>Add Player</h2>
              <p>Upload a Picture:</p>
              <form id="addplayerpictureform">
                <input type="file" name="playerpic" accept="image/*" id="playerimagefield"></input>
                <input type="button" value="Upload" onClick={this.uploadImage()}></input>
              </form>
              <img id="playerbuttonimg" src={this.state.playerImage} alt="Player Image"></img>
            </div>
            <form className="playerform" id="addplayerform" name="addeventform">
                <input type="text" id="playername" className="addplayerformfield" placeholder="Enter Player Name"></input>
                <input type="number" id="playernumber" className="addplayerformfield" placeholder="Enter Player Number"></input>
                <input type="text" id="playerposition" className="addplayerformfield" placeholder="Enter Player Position"></input>
                <span className="error-text" id="addplayer_error"></span>
                <input type="button" className="addplayerbutton" value="Add Player" onClick={this.validatePlayerForm()}></input>
            </form>
          </div>
      </div>
    );
  }
}

export default connect(stateMap)(AddPlayer);
