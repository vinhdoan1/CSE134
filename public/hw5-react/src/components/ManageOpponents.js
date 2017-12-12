import React, {Component} from 'react';
import { connect } from 'react-redux';
import { login, setOpponent } from "../actions/";
import firebase from '../js/firebase.js';
import firestoreDB from '../js/database.js';
import helper from '../js/helper.js';
import Header from './Header';

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
    }
    this.loadOpponents = this.loadOpponents.bind(this);
    this.createOpponentElement = this.createOpponentElement.bind(this);
    this.funToEditOpponent = this.funToEditOpponent.bind(this);
  }

  render() {
    return (
      <div className="App">
      <Header history={this.props.history} backButton homeLink="/team" logout/>
       <h2>Opponents</h2>
       <p id="emptyopponents" hidden={!this.state.isEmpty}>There are no opponents added yet.</p>
       <div id="opponentscontainer">
       </div>
       <button type="button" id="addopponentbutton" onClick={()=>console.log('hi')} hidden={!this.state.isAdmin}>+</button>
      </div>
    );
  }

  componentDidMount() {
    this.setState({isAdmin: this.props.userProfile.admin});
    this.loadOpponents(this.props.userProfile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userProfile !== nextProps.userProfile) {
      this.setState({isAdmin: nextProps.userProfile.admin});
      this.loadOpponents(nextProps.userProfile);
    }
  }

  loadOpponents(userProfile){
    var teamID = userProfile.teamID;
    if(teamID !== ""){
      firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
        var numOps = 0;
        snapshot.forEach(function(opponent) {
            var opListElement = this.createOpponentElement(opponent.id, opponent.data().name, opponent.data().logo);
            document.getElementById('opponentscontainer').appendChild(opListElement);
            numOps++;
        }.bind(this));
        if(numOps == 0){
          this.setState({isEmpty : true});
        }
      }.bind(this));
    }
  }
  
  createOpponentElement(opID, opName, opLogo){
    var div = document.createElement("div");
    div.setAttribute("class", "opListElement");
    div.onclick= this.funToEditOpponent(opID, opName, opLogo);
    var logo = document.createElement('img');
    logo.setAttribute("src", opLogo);
    logo.setAttribute("class", "opListImg");
    var name = document.createElement('div');
    name.setAttribute("class", "opListName")
    name.innerHTML = opName;
    div.appendChild(logo);
    div.appendChild(name);
    return div;
  }

  funToEditOpponent(opID, opName, opLogo){
    return function() {
      var opponent = {
        opID: opID,
        opName: opName,
        opLogo: opLogo,
      }
      this.props.dispatch(setOpponent(opponent));
      // this.props.history.push('/editopponent');
    }
  }


}

export default connect(stateMap)(ManageOpponents);

