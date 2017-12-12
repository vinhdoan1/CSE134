import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './../images/soccerball.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.logout = this.logout.bind(this);
    this.backClick = this.backClick.bind(this);
    this.homeClick = this.homeClick.bind(this);
  }

  logout(){
    /*
    mainState.setState('loggedIn', false);
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    */
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
};

export default Header;
