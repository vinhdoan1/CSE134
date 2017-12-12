import React, { Component } from 'react';
import Header from './Header';
import firestoreDB from '../js/database';
import { connect } from "react-redux";
import { setPlayer } from "../actions/";

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class Players extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      sortFunc: 0,
      admin: false,
    };
    this.generatePlayerButtons = this.generatePlayerButtons.bind(this);
    this.onSortChosen = this.onSortChosen.bind(this);
    this.sortByFunc = this.sortByFunc.bind(this);
  }

  reduxLoaded(userProfile) {
    if (userProfile.teamID !== "") {
      firestoreDB.getTeamPlayers(userProfile.teamID).then(function (playersData) {
        if (!playersData) {
          return;
        }

        var players = [];
        playersData.forEach(function(doc) {
          players.push({
            id: doc.id,
            ...doc.data(),
          })
        });

        this.setState({
          players: players,
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

  onSortChosen(e) {
    var sortFunc = 0;
    switch(e.target.value) {
      case "goals": // goals
          sortFunc = 1;
          break;
      case "name": // name
          sortFunc = 2;
          break;
      default: // number
          sortFunc = 3;
          break;
    }
    this.setState({
      sortFunc: sortFunc,
    });
  }

  generatePlayerButtons(players) {
    return players.map(function(player, i) {
      var playerButtonClick = function() {
        this.props.dispatch(setPlayer(player));
        this.props.history.push({
          pathname: 'playerdetails',
        });
      }.bind(this);

      return (<div role="button" className="playerbutton" key={i} onClick={playerButtonClick}>
                <img className="playerbuttonimg" src={player.image} alt={player.name}></img>
                <ul className="playerdetails">
                  <li>{player.name + " #" + player.number}</li>
                  <li>{player.position}</li>
                  <li>{"Goals: " + player.goals}</li>
                </ul>
              </div>);
    }.bind(this));
  }

  sortByFunc(players) {
    if (this.state.sortFunc === 0)
      return players;
    var sortFunction;
    switch(this.state.sortFunc) {
      case 1: // goals
        sortFunction = function(player1, player2) {
          return player1.goals < player2.goals;
        }
        break;
      case 2: // name
        sortFunction = function(player1, player2) {
          return player1.name > player2.name;
        }
        break;
      default: // number
        sortFunction = function(player1, player2) {
          return player1.number > player2.number;
        }
    }
    return players.sort(sortFunction)
  }

  render() {
    var filteredPlayers = this.state.players.filter(function (player){
      return !player.deleted;
    })
    var sortedPlayers = this.sortByFunc(filteredPlayers);
    var playerButtons = this.generatePlayerButtons(sortedPlayers);
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/" logout/>
        <div className="outercontainer">
            <h2>Players</h2>
            <button type="button" id="addplayerbutton" onClick={() => {window.location='addplayer';}} hidden={!this.state.admin}>+</button>
            <form id="playersort" name="playersort" onChange={this.onSortChosen}>
                <select name="playersortselect" id="playersortselect" defaultValue="default">
                  <option disabled="disabled" value="default">Sort by...</option>
                  <option value="goals">Goals</option>
                  <option value="name">Name (Alphabetical)</option>
                  <option value="number">Number</option>
                </select>
            </form>
            {playerButtons}
        </div>
      </div>
    );
  }
}

export default connect(stateMap)(Players);
