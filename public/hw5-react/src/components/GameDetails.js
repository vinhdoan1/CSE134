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
class GameDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerImage: "https://firebasestorage.googleapis.com/v0/b/cse134-bfd99.appspot.com/o/anonymous.png?alt=media&token=ca24586f-2e60-425d-9cc7-6ed2c7276c4c",
      gamedetails_date: "",
      gamedetails_time: "",
      gamedetails_location: "",
      firstteamimage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
      firstteam: "",
      secondteamimage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
      secondteam: "",
      gamesdetails_goals: 0,
      gamesdetails_shotsongoals: 0,
      gamesdetails_cornerkicks: 0,
      gamesdetails_penalties: 0,
      gamesdetails_goalsop: 0,
      gamesdetails_shotsongoalsop: 0,
      gamesdetails_cornerkicksop: 0,
      gamesdetails_penaltiesop: 0,
    };
    this.deleteGame = this.deleteGame.bind(this);
  }

  reduxLoaded(userProfile) {
    if (userProfile.game) {
      var game = userProfile.game;
      this.setState({
        gamedetails_date: game.date,
        gamedetails_time: game.time,
        gamedetails_location: game.location,
        secondteamimage: game.opponent.logo,
        secondteam: game.opponent.name,
        gamesdetails_goals: 0,
        gamesdetails_shotsongoals: 0,
        gamesdetails_cornerkicks: 0,
        gamesdetails_penalties: 0,
        gamesdetails_goalsop: 0,
        gamesdetails_shotsongoalsop: 0,
        gamesdetails_cornerkicksop: 0,
        gamesdetails_penaltiesop: 0,
      });
      firestoreDB.getTeam(userProfile.teamID).then(function (teamData){
        var team = teamData.data();
        this.setState({
          firstteamimage: team.logo,
          firstteam: team.name,
        });
      }.bind(this));
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

  deleteGame() {
    var deleteButton = document.getElementById('gamedetails_delete');
    if (deleteState === 0) {
      deleteButton.value = "Press again to confirm";
      deleteState = 1;
      setTimeout(function() {
        deleteState = 0;
        deleteButton.value = "Delete Game";
      }, 1000);
    } else {
      var game = this.props.userProfile.game;
      delete game.opponent;
      game.active = false;
      firestoreDB.updateGame(this.props.userProfile.teamID, this.props.userProfile.game.id, game).then(function() {
        this.props.history.push('/schedule');
      }.bind(this));
    }
  }

  render() {
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <div className="outercontainer2">
          <button type="button" id="addeventbutton" onClick={() => {window.location='addevent.html';}} hidden={!this.state.admin}>+</button>
          <h3 id="gamedetails_date">{this.state.gamedetails_date}</h3>
          <h3 id="gamedetails_time">{this.state.gamedetails_time}</h3>
          <h4 id="gamedetails_location">{this.state.gamedetails_location}</h4>
            <div id="gamedetails_details">
              <div id="firstdiv">
                <img id="teamimgdetailfirst" src={this.state.firstteamimage} alt="No Logo"></img>
                <p id="firstteam">{this.state.firstteam}</p>
              </div>
              <span>VS.</span>
              <div id="seconddiv">
                <img id="teamimgdetailsecond" src={this.state.secondteamimage} alt="No Logo"></img>
                <p id="secondteam">{this.state.secondteam}</p>
              </div>
            </div>
            <hr />
            <div id="gamedetails_stats">
              <div id="gamedetailfirst">
                <ul>
                  <li>
                    Goals: <span id="gamesdetails_goals">{this.state.gamesdetails_penalties}</span>
                  </li>
                  <li>
                    Shots on Goal: <span id="gamesdetails_shotsongoals">{this.state.gamesdetails_shotsongoals}</span>
                  </li>
                  <li>
                    Corner Kicks: <span id="gamesdetails_cornerkicks">{this.state.gamesdetails_cornerkicks}</span>
                  </li>
                  <li>
                    Penalties: <span id="gamesdetails_penalties">{this.state.gamesdetails_penalties}</span>
                  </li>
                </ul>
              </div>
              <div id="gamedetailsecond">
                <ul>
                  <li>
                    Goals: <span id="gamesdetails_goalsop">{this.state.gamesdetails_goalsop}</span>
                  </li>
                  <li>
                    Shots on Goal: <span id="gamesdetails_shotsongoalsop">{this.state.gamesdetails_shotsongoalsop}</span>
                  </li>
                  <li>
                    Corner Kicks: <span id="gamesdetails_cornerkicksop">{this.state.gamesdetails_cornerkicksop}</span>
                  </li>
                  <li>
                    Penalties: <span id="gamesdetails_penaltiesop">{this.state.gamesdetails_penaltiesop}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div id="gamedetails_options">
              <input type="checkbox" id="gamedetails_checkbox" onChange={() => {console.log("markGameComplete(this);")}}/><span>Game Complete</span>
              <input type="button" id="gamedetails_collectstats" className="gamedetailbutton" value="View Event Feed" onClick={() => {window.location='addevent'}}/>
              <input type="button" id="gamedetails_edit" className="gamedetailbutton" value="Edit Game Details" onClick={() => {window.location='editgame'}} hidden={!this.state.admin}/>
              <input type="button" id="gamedetails_delete" className="gamedetailbutton" value="Delete Game" onClick={() => {this.deleteGame()}} hidden={!this.state.admin}/>
            </div>
        </div>
      </div>
    );
  }
}

export default connect(stateMap)(GameDetails);
