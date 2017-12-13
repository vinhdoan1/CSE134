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
      hideLogo: true
    }
  }

  render(){
    return(
      <div>
        <Header history={this.props.history} backButton homeLink="/team" logout/>
        <h2 id="h2">Edit Game</h2>
        <div id="editgameopimgcontainer" className="teamimgcontainergame" hidden={this.state.hideLogo}>
          <img id="editgameopimg" className="teamimggame" src=""/>
        </div>
        <form id="editgameform" className="gameform" name="gameform">
            <select value=" " name="gameopponent" id="editgameopponent" className="gameformfield" onChange={()=>console.log('hi')}>
              <option value=" " disabled="disabled">Choose Opponent</option>
            </select>
            <p id="addgameOR">OR</p>
            <input type="button" id="gameformaddop" className="gameformbutton" value="Add Opponent" onClick={()=>console.log('hi')}/>
            <input type="text" name="gamelocation" id="editgamelocation" className="gameformfield" placeholder="Location"/>
            <input type="date" name="gamedate" id="editgamedate" className="gameformfield" placeholder="Date"/>
            <input type="time" name="gametime" id="editgametime" className="gameformfield" placeholder="Time"/>
            <input type="button" className="gameformbutton" value="Edit Game" onClick={()=>console.log('hi')}/>
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
    console.log(userProfile);
    this.populateOpponentSelect(userProfile);
  }

  populateOpponentSelect(userProfile){
    console.log("POS:" + userProfile);
    // var teamID = userProfile.teamID;
    // if(teamID !== ""){
    //   firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
    //     snapshot.forEach(function(opponent) {
    //       var opt = document.createElement("option");
    //       opt.value = opponent.id;
    //       opt.text = opponent.data().name;
    //       document.getElementById(selectcontainer).appendChild(opt);
    //     });
    //   });
    // } 
  }

  // populateEditGameForm(userProfile){
  //   if(userProfile.game){
  //     var game = userProfile.game;
      
  //   }
  // }

  // validateEditGameForm(){
  //   var incomplete = false;

  // }

  /*
  validateGameForm(form, action){
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
  
    //checking the form for validations
    game.opponent = form.elements['gameopponent'].value;
    incomplete = game.opponent == "Choose Opponent" || game.opponent == "";
    game.location = form.elements['gamelocation'].value;
    incomplete = incomplete || game.location == "";
    game.date = form.elements['gamedate'].value;
    incomplete = incomplete ||  game.date == "";
    game.time = form.elements['gametime'].value;
    incomplete = incomplete || game.time == "";
  
    var error_msg = (action == "add") ? 'addgamemsg' : 'editgamemsg';
    if(incomplete){
      displayMessage(error_msg, "error", "Please fill out all fields");
    }
    else{
  
      //check for adding or editing game
      if(action == "add"){
        game.active = true;
      }
      else if(action == "edit"){
        var state = mainState.getState();
        var teamID = state.teamID
      }
      updateGame(game, action);
    }
  }

  updateGame(game);

  }

  //update the game by calling firebase
  updateGame(game, action){
    var state = mainState.getState();
    var teamID = state.teamID;
    var gameID = state.gameID

    //check for different action add or edit a game
    if(action == "edit"){

      //call to CRUD for editing the game
      firestoreDB.updateGame(teamID, gameID, game).then(function(){
        window.location='gamedetails.html';
      });
    }
    else if(action == "add"){

      //call to CRUD for adding a new game
      firestoreDB.addNewGame(teamID, game).then(function(){
        window.location='schedule.html';

      });
    }
    // updateUpcomingGame();
  }

  validateGameForm(form, action){
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
  
    //checking the form for validations
    game.opponent = form.elements['gameopponent'].value;
    incomplete = game.opponent == "Choose Opponent" || game.opponent == "";
    game.location = form.elements['gamelocation'].value;
    incomplete = incomplete || game.location == "";
    game.date = form.elements['gamedate'].value;
    incomplete = incomplete ||  game.date == "";
    game.time = form.elements['gametime'].value;
    incomplete = incomplete || game.time == "";
  
    var error_msg = (action == "add") ? 'addgamemsg' : 'editgamemsg';
    if(incomplete){
      displayMessage(error_msg, "error", "Please fill out all fields");
    }
    else{
  
      //check for adding or editing game
      if(action == "add"){
        game.active = true;
      }
      else if(action == "edit"){
        var state = mainState.getState();
        var teamID = state.teamID
      }
      updateGame(game, action);
    }
  }*/

}

export default connect(stateMap)(EditGame);