import React, {Component} from 'react';
import { connect } from 'react-redux';
import { login } from "../actions/";
import firebase from '../js/firebase.js';
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
import Header from './Header';
import { userInfo } from 'os';
import { firestore } from 'firebase';
import {setOpponent } from '../actions';

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};

class EditGame extends Component{
  constructor(props){
    super(props);
    this.state ={
      hideLogo: true,
      opponents: []
    }
    this.loadOpponentOptions = this.loadOpponentOptions.bind(this);
  }

  render(){

    var opponentOptions = this.loadOpponentOptions(this.state.opponents);
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <h2 id="h2">Edit Game</h2>
        <div id="editgameopimgcontainer" className="teamimgcontainergame" style={{height:0}}>
          <img id="editgameopimg" className="teamimggame" src=""/>
        </div>
        <form id="editgameform" className="gameform" name="gameform">
          <select name="gameopponent" id="editgameopponent" defaultValue="default" className="gameformfield" onChange={() => {this.loadOpponentImage('editgameopponent','editgameopimg')}}>
            <option disabled="disabled" value="default">Choose Opponent</option>
            {opponentOptions}
          </select>
          <p id="addgameOR">OR</p>
          <input type="button" id="gameformaddop" className="gameformbutton" value="Add Opponent" onClick={()=>this.props.history.push('/addopponent')}/>
          <input type="text" name="gamelocation" id="editgamelocation" className="gameformfield" placeholder="Location"/>
          <input type="date" name="gamedate" id="editgamedate" className="gameformfield" placeholder="Date"/>
          <input type="time" name="gametime" id="editgametime" className="gameformfield" placeholder="Time"/>
          <input type="button" className="gameformbutton" value="Edit Game" onClick={()=>this.validateGameForm(this)}/>
          <div className="message" id="editgamemsg"></div>
        </form>
      </div>
    );
  }

  componentDidMount(){
    this.reduxLoaded(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.userProfile !== nextProps.userProfile){
      this.reduxLoaded(nextProps.userProfile);
    }
  }

  reduxLoaded(userProfile){
    if(userProfile.teamID != ""){
      var teamID = userProfile.teamID;
      var opponents = [];
      if(teamID !== ""){
        firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
          snapshot.forEach(function(opponent) {
              opponents.push({
                opID: opponent.id,
                ...opponent.data(),
              });
          });
          if(opponents.length == 0){
            this.setState({isEmpty : true});
          }
          else{
            this.setState({
              opponents: opponents,
            });
          }
          document.getElementById('editgameopponent').value = userProfile.game.opponent.id;
          this.loadOpponentImage('editgameopponent','editgameopimg');
        }.bind(this));
      }
      document.getElementById('editgamelocation').value = userProfile.game.location;
      document.getElementById('editgamedate').value = userProfile.game.date;
      document.getElementById('editgametime').value = userProfile.game.time;
    }
    // this.populateOpponentSelect(userProfile);
  }

  loadOpponentOptions(opponents){
    return opponents.map(function(opponent, i){
      return(
        <option key={i} value={opponent.opID}>{opponent.name}</option>
      );
    }.bind(this));
  }

  loadOpponentImage(selectid, logoid){
    var op = document.getElementById(selectid);
    // console.log(this.state.opponents);
    var opID = op.value;
    var opponent = this.state.opponents.find(function(other){
      return opID === other.opID;
    });
    var logo = document.getElementById(logoid);
    logo.src = opponent.logo;
    logo.style.height = "5rem";
    document.getElementById("editgameopimgcontainer").style.height = "5rem";
  }

  validateGameForm(form){
    //sanity check for validgame form
    var incomplete = false;

    //game form to be addded to the database
    var game = {
      opponent:"",
      location: "",
      date: "",
      time: "",
      active: true
    }

    var opID = document.getElementById('editgameopponent').value;
    var opponent = this.state.opponents.find(function(other){
      return opID === other.opID;
    });
    game.opponent = opponent.name;
    console.log(game.opponent);
    incomplete = game.opponent == "Choose Opponent" || game.opponent == "";

    game.location = document.getElementById('editgamelocation').value;
    incomplete = incomplete || game.location == "";
    game.date = document.getElementById('editgamedate').value;
    incomplete = incomplete ||  game.date == "";
    game.time = document.getElementById('editgametime').value;
    incomplete = incomplete || game.time == "";

    if(incomplete){
      helper.displayMessage('editgamemsg', "error", "Please fill out all fields");
    }
    else{
      this.updateGame(game);
    }
  }

  //update the game by calling firebase
  updateGame(game){
    var teamID = this.props.userProfile.teamID;
    console.log(teamID);
    var game = this.props.userProfile.game;
    console.log(game);
    firestoreDB.updateGame(teamID, game.id, game).then(function(){
      this.props.history.push('/gamedetails');
    }.bind(this));

  }

}

export default connect(stateMap)(EditGame);
