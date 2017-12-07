var config = {
    apiKey: "AIzaSyC5ELIjf0XaLwgtOHKPjijx_p9Ihcg2fWA",
    firedatabaseKey: "AIzaSyC5ELIjf0XaLwgtOHKPjijx_p9Ihcg2fWA",
    authDomain: "cse134-bfd99.firebaseapp.com",
    databaseURL: "https://cse134-bfd99.firebaseio.com",
    projectId: "cse134-bfd99",
    storageBucket: "cse134-bfd99.appspot.com",
    messagingSenderId: "793962632230"
  };
  firebase.initializeApp(config);

  var firedatabase = {}; // not necessary just to make it more obvious
  firedatabase.generateID = generateID;
  firedatabase.getUsers = getUsers;
  firedatabase.addUser = addUser;
  firedatabase.getUser = getUser;
  firedatabase.authenticateUser = authenticateUser;
  firedatabase.userExists = userExists;
  firedatabase.getTeams = getTeams;
  firedatabase.addTeam = addTeam;
  firedatabase.getTeam = getTeam;
  firedatabase.setTeam = setTeam;
  firedatabase.getTeamName = getTeamName;
  firedatabase.getTeamPlayers = getTeamPlayers;
  // firedatabase.setTeamPlayers = setTeamPlayers;
  firedatabase.getTeamPlayer = getTeamPlayer;
  // firedatabase.setTeamPlayer = setTeamPlayer;
  firedatabase.getTeamGames = getTeamGames;
  firedatabase.addNewGame = addNewGame;
  firedatabase.updateGame = updateGame
  // firedatabase.setTeamGames = setTeamGames;
  firedatabase.getTeamGame = getTeamGame;
  // firedatabase.setTeamGame = setTeamGame;
  firedatabase.getOpponents = getOpponents;
  firedatabase.setOpponents = setOpponents;
  // firedatabase.setStat = setStat
  firedatabase.setStats = setStats
  // firedatabase.getStats = getStats
  firedatabase.addNewPlayer = addNewPlayer;
  firedatabase.updatePlayer = updatePlayer;

  function generateID() {
    return Date.now().toString(36);
  }

  // USERS
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function getUsers() {
    var allUsersString = localStorage.getItem("users");
    var allUsers = [];
    if (allUsersString != null) {
      allUsers = JSON.parse(allUsersString);
    } else {
      saveUsers(allUsers);
    }
    return allUsers;
  }

  function addUser(userID, team) {
    return firebase.database().ref('users/' + userID).set({
      team: team,
    })
  }

  function getUser(userID) {
    return firebase.database().ref('users/' + userID).once('value');
  }

  function authenticateUser(username, password) {
    var allUsers = getUsers();
    return allUsers.find(function(user) {
      return user.name == username && user.pass == password;
    });
  }

  function userExists(username) {
    var allUsers = getUsers();
    return allUsers.find(function(user) {
      return user.name == username;
    });
  }

// TEAMS

function saveTeams(teams) {
  localStorage.setItem('teams', JSON.stringify(teams));
}

function getTeams() {
  var allTeamsString = localStorage.getItem("teams");
  var allTeams = {};
  if (allTeamsString != null) {
    allTeams = JSON.parse(allTeamsString);
  } else {
    saveTeams(allTeams);
  }
  return allTeams;
}

function addTeam(name, logo, callback) {
  var team = {
    name: name,
    logo: logo,
    games: {},
    players: {},
    opponents: {},
  };

  var newPostKey = firebase.database().ref().child('teams').push().key;

  var updates = {};
  updates['/teams/' + newPostKey] = team;
  var userTeams = {};
//  userTeams[newPostKey] = true;
  //updates['/users/teams' + userID] = userTeams;
  firebase.database().ref().update(updates).then(function() {
    callback(newPostKey);
  });
}

// TEAM SPECIFICS

function getTeam(teamID) {
  return firebase.database().ref('/teams/' + teamID).once('value');
}

function getTeamName(teamID){
  return firebase.database().ref('/teams/' + teamID).once('value').then(function(team) {
    return team.name;
  });
}

function setTeam(teamID, team){
 var updates={};
 updates['/teams/' + teamID] = team;
 return firebase.database().ref().update(updates);
}

// PLAYER DATA

function getTeamPlayers(teamID) {
  return firebase.database().ref('/players/' + teamID).once('value')
}

function getTeamPlayer(teamID, playerID) {
  return firebase.database().ref('/players/' + teamID + '/' + playerID).once('value').then(function(teamPlayer) {
    return teamPlayer;
  });
}

function addNewPlayer(teamID, player) {
  var newPostKey = firebase.database().ref().child('/players/' + teamID + '/').push().key;

  var updates = {};
  player.id = newPostKey;
  updates['/players/' + teamID + '/' + newPostKey] = player;
  return firebase.database().ref().update(updates);
}

function updatePlayer(teamID, playerID, player) {
  var updates = {};
  updates['/players/' + teamID + '/' + playerID] = player;
  return firebase.database().ref().update(updates);
}

  // GAMES DATA

function getTeamGames(teamID) {
  return firebase.database().ref('/games/' + teamID).once('value').then(function(teamGames) {
    return teamGames;
  });
}

function getTeamGame(teamID, gameID) {
  return firebase.database().ref('/games/' + teamID + '/' + gameID).once('value').then(function(teamGame) {
    return teamGame;
  });
}

function addNewGame(teamID, game) {
  var newPostKey = firebase.database().ref().child('/players/' + teamID + '/').push().key;

  var updates = {};
  updates['/games/' + teamID + '/' + newPostKey] = game;
  return firebase.database().ref().update(updates);
}

function updateGame(teamID, gameID, game) {
  var updates = {};
  updates['/games/' + teamID + '/' + gameID] = game;
  return firebase.database().ref().update(updates);
}

/* deprecated bc we will store player data in state?
  function getStats (teamID, gameID){
    let teams = getTeams()
    let games = teams[teamID].games;
    return games.find(function(game){
      return game.id == gameID;
    }).stats
  }

  function setStat (teamID, gameID, stat){
    let games = getTeamGames(teamID)
    let gameIndex = games.findIndex(function(game){
      return game.id == gameID
    })

    if(gameIndex >= 0){
      games[gameIndex].stats.push(stat)
      setStats(teamID, gameIndex, games[gameIndex].stats);
    }

  } */

  function setStats(teamID, gameID, stats){
    var updates = {};
    updates['/games/' + teamID + '/' + gameID + 'stats'] = stats;
    return firebase.database().ref().update(updates);
  }

  //OPPONENT DATA
  function getOpponents(teamID){
    return firebase.database().ref('/opponents/' + teamID).once('value').then(function(opponents) {
      return opponents;
    });
  }

  function setOpponents(teamID, opponentList){
    var updates = {};
    updates['/opponents/' + teamID] = opponentList;
    return firebase.database().ref().update(updates);
  }
