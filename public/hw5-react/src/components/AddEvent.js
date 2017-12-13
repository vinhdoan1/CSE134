import React, { Component } from 'react';
import Header from './Header';
import firestoreDB from '../js/database';
import { connect } from "react-redux";

var gameSet = false;

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      players: [],
      playersMap: {},
    };
    this.reduxLoaded = this.reduxLoaded.bind(this);
    this.addStat = this.addStat.bind(this);
  }

  reduxLoaded(userProfile) {
    if (userProfile.game) {
      firestoreDB.getStats(userProfile.teamID, userProfile.game.id).then(function(statData) {
        var stats = [];
        statData.forEach(function (stat) {
          stats.push(stat.data());
        })
        this.setState({
          events: stats,
        });
      }.bind(this));

      firestoreDB.getTeamPlayers(userProfile.teamID).then(function(playersData){

        var players = [];
        var playersMap = {};
        playersData.forEach(function(playerData){
          var player = playerData.data();
          if (!player.deleted) {
            var playerObj = {
              player: playerData.data(),
              id: playerData.id,
            }
            players.push(playerObj)
            playersMap[player.name] = playerObj;
          }
        });
        this.setState({
          players: players,
          playersMap: playersMap,
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

  addStat() {
    let stat = "";
    let teamID = this.props.userProfile.teamID
    let gameID = this.props.userProfile.game.id
    let type = document.getElementById("selectStat").value
    let player = document.getElementById("eventplayername").value;
    let playerInd = document.getElementById("eventplayername").key;
    //check what type of stat it is
    if (player === "" || type === "Choose Event" || type === ""){
      return false
    }
    else if (type === 'cornerKicks' || type === 'shotsOnGoal'){
      stat = player + " took a " + type
    }
    else if (type === 'yellowCards' || type === 'redCards') {
      stat = player + " received a " + type
    }
    else if (type === 'goals'){
      stat = player + " scored a goal"
    }
    else {
      stat = player + " made a " + type
    }

    if(!player.includes("Opponent")){
      var playerObject = this.state.playersMap[player];

      var playerObj = playerObject.player;
      playerObj[type] += 1;
      if (!gameSet) {
        gameSet = true;
        playerObj.gamesPlayed += 1;
      }
      firestoreDB.updatePlayer(teamID, playerObject.id, playerObj).then(function (){});
    }

    //reset the add event form
    //document.getElementById('addeventform').reset();

    firestoreDB.setStat(this.props.userProfile.teamID, this.props.userProfile.game.id, stat).then(function(){
      var stats = this.state.events;
      stats.push({
        stat: stat}
      );
      this.setState({
        events: stats,
      });
    }.bind(this));
  }

  render() {
    var playerOptions = this.state.players.map(function (player, i) {
      return (<option key={i}>{player.player.name}</option>)
    });

    var eventButtons = (<p id="emptyeventfeed">There are no events to show</p>);
    if (this.state.events.length > 0) {
      eventButtons = this.state.events.map(function (event, i) {
        return (<button type="button" className="eventfeedbutton" key={i}>{event.stat}</button>)
      })
    }

    return (
      <div className="team-container">
        <Header backButton history={this.props.history} homeLink="/team" logout/>
        <div className="outercontainer">
          <div id="addeventcontainer" hidden={!this.state.admin}>
            <h2>Add Event</h2>
            <form id="addeventform" name="addeventform">
                <select id="selectStat" name="eventdetail" className="addeventformfield" required>
                  <option value="default" disabled="disabled" defaultValue="default">Choose Event</option>
                  <option value="goals">Goal</option>
                  <option value="penalties">Penalty</option>
                  <option value="shotsOnGoal">Shot on Goal</option>
                  <option value="cornerKicks">Corner Kick</option>
                  <option value="redCards">Red Card</option>
                  <option value="yellowCards">Yellow Card</option>
                </select>
                <input type="text" id="eventplayername" className="addeventformfield" placeholder="Enter Player Name" list="playernames" required></input>
                <datalist id="playernames">
                  {playerOptions}
                  <option>{"(Opponent Player)"}</option>
                </datalist>
                <input type="button" className="addeventbutton" id="addeventbttn" value="Add Event" onClick={() => {this.addStat()}}></input>
                <p id="disabledaddeventmsg">Event adding disabled -- game already marked complete.</p>
              </form>
            <hr />
          </div>
          <div id="eventfeedcontainer">
            <h2>Event Feed</h2>
            {eventButtons}
            <div id="dynamicevents">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stateMap)(AddEvent);
