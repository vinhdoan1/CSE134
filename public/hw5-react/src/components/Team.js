import React, { Component } from 'react';
import Header from './Header';
import firestoreDB from '../js/database';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      teamLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
      teamWins: 0,
      teamLosses: 0,
      upcomingGames: "There are no upcoming games.",
    };
  }

  componentDidMount(){
    firestoreDB.getTeam("KTz7ok6zAsc7Xio6pTbV").then(function(teamData) {
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

    // change to check for actual upcoming game
    if(false) {
      this.setState({
        upcomingGames: "",
      });
    }
  }

  render() {
    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/" logout/>
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
              <p id="upcominggame_empty">{this.state.upcomingGames}</p>
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

export default Team;
