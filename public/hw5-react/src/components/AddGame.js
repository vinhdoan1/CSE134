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
class AddGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opponents: []
    };

    this.reduxLoaded = this.reduxLoaded.bind(this);
    this.validateGameForm = this.validateGameForm.bind(this);
    this.loadOpponentImage = this.loadOpponentImage.bind(this);
  }

  reduxLoaded(userProfile) {
    if (userProfile.teamID) {
      firestoreDB.getAllOpponents(userProfile.teamID).then(function (opponentsData) {
        var opponents = [];
        opponentsData.forEach(function (opponent) {
          opponents.push({
            opponent: opponent.data(),
            id: opponent.id,
          })
        })
        this.setState({
          opponents: opponents,
        });
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

  uploadImage() {
    helper.uploadLogo('playerimagefield','playerbuttonimg');
    imageSet = true;
  }

  loadOpponentImage(selectid, logoid){
    var op = document.getElementById(selectid);
    var opname = op.value;
    var opponent = this.state.opponents.find(function(opteam){
      return opname === opteam.id;
    });

    var logo = document.getElementById(logoid);
    logo.src = opponent.opponent.logo;
    logo.style.height = "5rem";
  }

  validateGameForm(){
    //sanity check for validgame form
    var incomplete = false;

    var form = document.getElementById('addgameform');
    //game form to be addded to the database
    var game = {
      opponent:"",
      location: "",
      date: "",
      time: "",
      active: true
    }

    //checking the form for validations
    game.opponent = form.elements['gameopponent'].value;
    incomplete = game.opponent === "Choose Opponent" || game.opponent === "";
    game.location = form.elements['gamelocation'].value;
    incomplete = incomplete || game.location === "";
    game.date = form.elements['gamedate'].value;
    incomplete = incomplete ||  game.date === "";
    game.time = form.elements['gametime'].value;
    incomplete = incomplete || game.time === "";

    var error_msg = 'addgamemsg';
    if(incomplete){
      helper.displayMessage(error_msg, "error", "Please fill out all fields");
    }
    else{
      //check for adding or editing game
      game.active = true;
      firestoreDB.addNewGame(this.props.userProfile.teamID, game).then(function () {
          window.location='schedule';
      })
    }
  }

  render() {
    var opponentOptions = this.state.opponents.map(function(opponent, i) {
      return (<option key={i} value={opponent.id}>{opponent.opponent.name}</option>);
    })

    return (
      <div className="team-container">
        <Header history={this.props.history} backButton homeLink="/schedule" logout/>
          <div className="outercontainer2">
            <h2 id="h2">Add Game</h2>
            <div id="addgameopimgcontainer" className="teamimgcontainergame" style={{height:0}}>
              <img id="addgameopimg" className="teamimggame" src=""></img>
            </div>
            <form id="addgameform" className="gameform" name="addgameform">
                <select name="gameopponent" id="addgameopponent" defaultValue="default" className="gameformfield" onChange={() => {this.loadOpponentImage('addgameopponent','addgameopimg')}}>
                  <option disabled="disabled" value="default">Choose Opponent</option>
                  {opponentOptions}
                </select>
                <p style={{
                    margintop:'0.2rem',
                    marginbottom:'0.2rem',}}>OR</p>
                  <input type="button" id="gameformaddop" className="gameformbutton" value="Add New Opponent" onClick={() => {window.location='addopponent';}}/>
                <input type="text" name="gamelocation" id="addgamelocation" className="gameformfield" placeholder="Location"/>
                <input type="date" name="gamedate" id="addgamedate" className="gameformfield" placeholder="Date"/>
                <input type="time" name="gametime" id="addgametime" className="gameformfield" placeholder="Time"/>
                <input type="button" className="gameformbutton" value="Add Game" onClick={() => {this.validateGameForm(this.form, 'add');}}/>
                <div className="message" id="addgamemsg"></div>
              </form>
          </div>
      </div>
    );
  }
}

export default connect(stateMap)(AddGame);
