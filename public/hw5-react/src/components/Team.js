import React, { Component } from 'react';
import Header from './Header';
import firestoreDB from '../js/database';
import { connect } from "react-redux";
import helper from '../js/helper.js';
import {setGame} from '../actions';

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      teamLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
      teamWins: 0,
      teamLosses: 0,
      loaded: false,
      upcomingGame: {},
      opponentName: "",
    };
  }

  reduxLoaded(userProfile) {
    if (userProfile.teamID !== "") {
      firestoreDB.getTeam(userProfile.teamID).then(function(teamData) {
        var team = teamData.data();
        var wins = 0;
        if (team.wins) {
          wins = team.wins;
        }
        var losses = 0;
        if (team.losses) {
          losses = team.losses;
        }
        this.setState({
          teamName: team.name,
          teamLogo: team.logo,
          teamWins: wins,
          teamLosses: losses,
        });
      }.bind(this));

      //get the upcoming game
      firestoreDB.getTeamGames(userProfile.teamID).then(function(games){
        if(games){
          var gamesArray = [];
          games.forEach(function(gameData){
            gamesArray.push({
              id: gameData.id,
              ...gameData.data()
            });
          });

          if(gamesArray.length > 0){
            gamesArray.sort(function(a,b){
                  return new Date(a.date) - new Date(b.date);
            });

            var j = 0;
            while(!gamesArray[j].active){
              j++;
            }
            if(gamesArray[j].active){
              this.setState({upcomingGame: gamesArray[j]});
              firestoreDB.getOpponent(this.props.userProfile.teamID, gamesArray[j].opponent).then(function(opponent){
                var opData = opponent.data();
                // this.setState({opponentName: opData.name});
                var newGame = {
                  opponent: {
                    id: opponent.id,
                    name: opData.name,
                    logo: opData.logo
                  },
                  id: gamesArray[j].id,
                  active: gamesArray[j].active,
                  date: gamesArray[j].date,
                  time: gamesArray[j].time,
                  location: gamesArray[j].location
                };
                this.setState({upcomingGame: newGame});
              }.bind(this))
              .catch(function(error){
                console.log(error);
              });
            }
            else{
              this.setState({upcomingGame: {}});
            }
          }
        }
      }.bind(this));
    }
  }

  componentDidMount() {
    this.reduxLoaded(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userProfile !== nextProps.userProfile) {
      this.reduxLoaded(nextProps.userProfile);
    }
  }

  createUpcomingGameButton(){
    var game = this.state.upcomingGame;
    // console.log(game);
    console.log(game.id);
    if(game.id!==undefined){
      var date = helper.parseDateAndTime(game.date, game.time);
      var hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
      var ampm = date.getHours() >= 12 ? "PM" : "AM";
  
      var gameButtonClick = function() {
        this.props.dispatch(setGame(game));
        this.props.history.push({
          pathname: 'gamedetails',
        });
      }.bind(this);

      var oppName = game.opponent.name;

      return(
        <div role="button" className="gamebuttonElement" onClick={gameButtonClick}>
        <div>
          <span>{helper.months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " @ " +
            hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm + " -  vs. " + oppName}
          </span>
        </div>
       </div>
      );
    }
    else{
      return(<p id="upcominggame_empty">There are no upcoming games.</p>);
    }

  }

  render() {
    var upcomingGame = this.createUpcomingGameButton();
    return (
      <div className="team-container">
        <Header history={this.props.history} homeLink="/team" logout/>
        <div className="outercontainer2">
          <div id="teamimgcontainerteam">
            <img id="teamimglogo" src={this.state.teamLogo} alt="Team Logo"></img>
          </div>
          <h1 id="h1">{this.state.teamName}&nbsp;</h1>
          <div id="stats">
            <p id="wins">
              {"Wins: " + this.state.teamWins}
            </p>
            <p id="loss">
              {"Losses: " + this.state.teamLosses}
            </p>
          </div>
          <hr />
          <div id="liveGame">
              <p id="corner">
                Upcoming Game:
              </p>
            <div id="upcominggamecontainer">
              {upcomingGame}
            </div>
          </div>
          <hr />
          <div id="dashboardoptions">
            <button type="button" className="gamebutton" onClick={() => {window.location='schedule'}}>
              Schedule
            </button>
            <button type="button" className="gamebutton" onClick={() => {window.location='players'}}>
              Players
            </button>
            <button type="button" className="gamebutton" onClick={() => {window.location='settings'}}>
              Settings
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stateMap)(Team);
