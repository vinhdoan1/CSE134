import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './../images/soccerball.png';
import { connect } from "react-redux";
import { logout } from "../actions/";
import firebase from '../js/firebase.js'

const stateMap = (store) => {
  return {
    userProfile: store.user
  };
};
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.logout = this.logout.bind(this);
    this.backClick = this.backClick.bind(this);
    this.homeClick = this.homeClick.bind(this);
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
    console.log(this.props.noredirect);
    if(userProfile.loggedIn !== 'undefined'){
      if (!this.props.noredirect && userProfile.loggedIn === false) {
        window.location = 'login';
      }
    }
    // this.populateOpponentSelect(userProfile);
  }

  logout(){
    this.props.dispatch(logout());
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    this.props.history.push({
      pathname: 'login',
    });
  }

  backClick() {
    this.props.history.goBack();
  }

  homeClick() {
    if (!this.props.homeLink) {
      return;
    }
    this.props.history.push({
      pathname: this.props.homeLink,
    });
  }

  render() {
    return (
      <div className="header">
        {
          (this.props.backButton) &&
          <p className="headertext" id="backheadertext" onClick={this.backClick}>&lt; Back</p>
        }
        <div className="headerlogo" onClick={this.homeClick}>
          <img id="logoheaderimg" src={logo} alt="TeamWatch Logo"></img>
          <p id="logoheadertext">TeamWatch</p>
        </div>
        {
          (this.props.logout) &&
          <p className="headertext" id="logoutheadertext" onClick={this.logout}>Logout</p>
        }
      </div>
    );
  }
}

// different prop types
Header.propTypes = {
  history: PropTypes.any.isRequired, // for link routing
  backButton: PropTypes.bool, // link when back pressed
  homeLink: PropTypes.string, // link when home pressed
  logout: PropTypes.bool, // whether there is a logout button
  noredirect: PropTypes.bool, // whether to disable redirect
};

export default connect(stateMap)(Header);
