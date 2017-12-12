import React, { Component } from 'react';
import Header from './Header';
import { connect } from "react-redux";
import firestoreDB from '../js/database';

var deleteState = 0;

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class PlayerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerImage: "https://firebasestorage.googleapis.com/v0/b/cse134-bfd99.appspot.com/o/anonymous.png?alt=media&token=ca24586f-2e60-425d-9cc7-6ed2c7276c4c",
      playerName: "",
      playerPosition: "",
      playerGoals: 0,
      playerFouls: 0,
      playerYellowCards: 0,
      playerRedCards: 0,
      playerShotsOnGoal: 0,
      playerCornerKicks: 0,
      playerPenaltyKicks: 0,
      playerThrowIns: 0,
      playerGamesPlayed: 0,
    };
    this.deletePlayer = this.deletePlayer.bind(this);
  }

  reduxLoaded(userProfile) {
    if (userProfile.player) {
      var player = userProfile.player;
      this.setState({
        playerImage: player.image,
        playerName: player.name,
        playerPosition: player.position,
        playerGoals: player.goals,
        playerFouls: player.fouls,
        playerYellowCards: player.yellowCards,
        playerRedCards: player.redCards,
        playerShotsOnGoal: player.shotsOnGoal,
        playerCornerKicks: player.cornerKicks,
        playerPenaltyKicks: player.penalties,
        playerThrowIns: player.throwIns,
        playerGamesPlayed: player.gamesPlayed,
      });
    }
    this.setState({
      admin: userProfile.admin,
    });
  }

  componentDidMount() {
    this.reduxLoaded(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userProfile !== nextProps.userProfile) {
      this.reduxLoaded(nextProps.userProfile);
    }
  }

  deletePlayer() {
    var deleteButton = document.getElementById('deletePlayer');
    if (deleteState === 0) {
      deleteButton.value = "Press again to confirm";
      deleteState = 1;
      setTimeout(function() {
        deleteState = 0;
        deleteButton.value = "Delete Player";
      }, 1000);
    } else {
      var player = this.props.userProfile.player;
      player.deleted = true;
      console.log(this.props.userProfile);
      console.log(this.props.userProfile.teamID);
      console.log(this.props.userProfile.player);
      firestoreDB.updatePlayer(this.props.userProfile.teamID, this.props.userProfile.player.id, player).then(function() {
        this.props.history.push('/players');
      }.bind(this));
    }
  }

  render() {
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/" logout/>
        <div className="outercontainer">
            <div className="playerpreview">
              <img id="playerImage" src={this.state.playerImage} alt="Player"></img>
              <h1 id="playerName">{this.state.playerName}&nbsp;</h1>
              <h2 id="playerPosition">{this.state.playerPosition}&nbsp;</h2>
            </div>
            <hr />
            <ul className="playerdetails">
              <li id="playerGoals">Goals: {this.state.playerGoals}</li>
              <li id="playerFouls">Fouls: {this.state.playerFouls}</li>
              <li id="playerYellowCards">Yellow Cards: {this.state.playerYellowCards}</li>
              <li id="playerRedCards">Red Cards: {this.state.playerRedCards}</li>
              <li id="playerShotsOnGoal">Shots on Goal: {this.state.playerShotsOnGoal}</li>
              <li id="playerCornerKicks">Corner Kicks: {this.state.playerCornerKicks}</li>
              <li id="playerPenaltyKicks">Penalty Kicks: {this.state.playerPenaltyKicks}</li>
              <li id="playerThrowIns">Throw ins: {this.state.playerThrowIns}</li>
              <li id="playerGamesPlayed">Games Played: {this.state.playerGamesPlayed}</li>
            </ul>
            <input type="button" id="editPlayer" className="editplayerbuttons" value="Edit Player" onClick={() => {window.location='editplayer.html';}} hidden={!this.state.admin}/>
            <input type="button" id="deletePlayer" className="editplayerbuttons" value="Delete Player" onClick={() => this.deletePlayer()} hidden={!this.state.admin}/>
        </div>
      </div>
    );
  }
}

export default connect(stateMap)(PlayerDetails);
