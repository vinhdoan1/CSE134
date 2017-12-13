import React, { Component } from 'react';
import Header from './Header';
import firestoreDB from '../js/database';
import { connect } from "react-redux";
import { setGame } from "../actions/";
import helper from '../js/helper.js';

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      sortFunc: 0,
      admin: false,
    };
    this.reduxLoaded = this.reduxLoaded.bind(this);
    this.generateGameButtons = this.generateGameButtons.bind(this);
  }

  reduxLoaded(userProfile) {
    if (userProfile.teamID !== "") {
      firestoreDB.getTeamGames(userProfile.teamID).then(function(gamesData){
        var emptyschedule = document.getElementById('emptyschedule');
        if(gamesData){
          var games = [];
          //go through all games and get the data for displaying
          gamesData.forEach(function(game){
            games.push({
              id: game.id,
              ...game.data()
            });
          });

          //sort the schedule of the game by date of occurance
          games.sort(function(a,b){
              return new Date(a.date) - new Date(b.date);
          });

          games = games.filter(function (game) {
            return game.active;
          })

          var gameOpponent = function(opponentID, i) {
            firestoreDB.getOpponent(userProfile.teamID, opponentID).then(function(opp){
              var stateGames = this.state.games;
              stateGames[i].opponent = opp.data();
              stateGames[i].opponent.id = opponentID;
              this.setState({games: stateGames});
            }.bind(this));
          }.bind(this);

          if(games.length === 0){
            emptyschedule.style.fontSize="1rem";
          }
          else{
            emptyschedule.style.fontSize="0rem";
          }

          this.setState({
            games: games,
          }, () => {
              for (var i = 0 ; i < games.length; i++){
                gameOpponent(games[i].opponent, i);
              }
          })
        }
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

  generateGameButtons(games) {
    return games.map(function(game, i) {
      var date = helper.parseDateAndTime(game.date, game.time);
      var hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
      var ampm = date.getHours() >= 12 ? "PM" : "AM";

      var gameButtonClick = function() {
        this.props.dispatch(setGame(game));
        this.props.history.push({
          pathname: 'gamedetails',
        });
      }.bind(this);

      var oppName = "";
      if (game.opponent.name) {
        oppName = game.opponent.name;
      }
      return (<div role="button" className="gamebuttonElement" key={i} onClick={gameButtonClick}>
                <div>
                  <span>{helper.months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " @ " +
                    hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm + " -  vs. " + oppName}
                  </span>
                </div>
              </div>);
    }.bind(this));
  }


  render() {
    var gameButtons = this.generateGameButtons(this.state.games);
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <div className="outercontainer2">
          <h2 id="h1">Schedule</h2>
          <p id="emptyschedule">There are no games scheduled.</p>
          <div id="schedulecontainer">
            {gameButtons}
          </div>
          <button type="button" id="addgamebutton" onClick={() => {window.location='addgame'}} hidden={!this.state.admin}>+</button>
        </div>
      </div>
    );
  }
}

export default connect(stateMap)(Schedule);
