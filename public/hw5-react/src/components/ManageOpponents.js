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

class ManageOpponents extends Component {
  constructor(props){
    super(props);
    this.state={
      isAdmin : false,
      isEmpty: true,
      opponents: []
    }
    this.loadOpponentsList = this.loadOpponentsList.bind(this);
  }

  render() {
    // console.log(!this.state.isAdmin);
    var opponentsElementsList = this.loadOpponentsList(this.state.opponents);
    return (
      <div className="App">
      <Header history={this.props.history} backButton homeLink="/team" logout/>
       <h2>Opponents</h2>
       <p id="emptyopponents" hidden={!this.state.isEmpty}>There are no opponents added yet.</p>
       <div id="opponentscontainer">
        {opponentsElementsList}
       </div>
       <button type="button" id="addopponentbutton" onClick={()=>this.props.history.push('/addopponent')} hidden={!this.state.isAdmin}>+</button>
      </div>
    );
  }

  reduxLoaded(userProfile){
    if(userProfile.teamID != ""){
      var teamID = userProfile.teamID;
      var opponents = [];
      if(teamID !== ""){
        firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
          snapshot.forEach(function(opponent) {
              // console.log(opponent.data());
              if(opponent.data().active){
                opponents.push({
                  opID: opponent.id,
                  ...opponent.data(),
                });
              }
          });
          if(opponents.length == 0){
            this.setState({isEmpty : true});
          }
          else{
            this.setState({
              opponents: opponents,
            });
          }
        }.bind(this));
      }
    }
    this.setState({
      isAdmin: userProfile.admin,
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

  loadOpponentsList(opponents){
    // console.log(opponents);
    return opponents.map(function(opponent, i){
      var onClickFunc = function(){
        this.props.dispatch(setOpponent(opponent));
        this.props.history.push('/editopponent');
      }.bind(this);

      return(
        <div role="button" className="opListElement" key={i} onClick={onClickFunc}>
          <img className="opListImg" src={opponent.logo}/>
          <div className="opListName">{opponent.name}</div>
        </div>
      );
    }.bind(this));
  }
}

export default connect(stateMap)(ManageOpponents);

