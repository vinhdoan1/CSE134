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

var enablePersistenceOn = false;

  /*
  Obtains reference to firestore database. On first call, it enables offline
  persistence, and then gets firestore directly on other occasions.
  */
  async function getDB() {
    if (enablePersistenceOn) {
      return firebase.firestore();
    } else {
      var db;
      enablePersistenceOn = true;
      await firebase.firestore().enablePersistence()
        .then(function() {
            // Initialize Cloud Firestore through firebase
            db = firebase.firestore();

        })
        .catch(function(err) {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        });
      return db;
    }
  }
  var firestoreDB = {};

  // USERS
  firestoreDB.addUser = async function(userID, team, admin) {
    var db = await getDB();
    return (db.collection("users").doc(userID).set({
      team: team,
      admin: admin,
    }))
  }

  firestoreDB.getUser = async function(userID) {
    var db = await getDB();
    return db.collection("users").doc(userID).get();
  }

  // TEAMS
  firestoreDB.addTeam = async function(name, logo) {
    var db = await getDB();
    return (db.collection("teams").add({
      name: name,
      logo: logo,
    }));
  }

  firestoreDB.getTeam = async function(teamID) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).get();
  }

  firestoreDB.setTeam = async function(teamID, teamData){
    var db = await getDB();
    return db.collection("teams").doc(teamID).set(teamData);
  }

  // OPPONENTS
  firestoreDB.addOpponent = async function(teamID, opName, logo) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").add({
      name: opName,
      logo: logo
    });
  }

  firestoreDB.getOpponent = async function(teamID, opID){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").doc(opID).get();
  }

  firestoreDB.getAllOpponents = async function(teamID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").get();
  }

  firestoreDB.setOpponent = async function(teamID, opID, opponent){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").doc(opID).set(opponent);
  }

  firestoreDB.getStats = async function(teamID, gameID){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").doc(gameID).collection("stats").get()
  }


  firestoreDB.setStat = async function(teamID, gameID, stat){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games")
    .doc(gameID).collection("stats").add({stat})
  }


  firestoreDB.getTeamGames = async function(teamID){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").get()
  }

  firestoreDB.getTeamGame = async function(teamID, gameID){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").doc(gameID).get()
  }


  firestoreDB.addNewGame = async function(teamID, game){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").add(game)
  }

  firestoreDB.updateGame = async function(teamID, gameID, game){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games")
    .doc(gameID).set(game)
  }

  // PLAYERS
  firestoreDB.getTeamPlayers = async function(teamID) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("players").get();
  }

  firestoreDB.getTeamPlayer = async function(teamID, playerID) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("players").doc(playerID).get();
  }

  firestoreDB.addNewPlayer = async function(teamID, player) {
    var db = await getDB();
    return (db.collection("teams").doc(teamID).collection("players").add(player));
  }

  firestoreDB.updatePlayer = async function(teamID, playerID, player) {
    var db = await getDB();
    return (db.collection("teams").doc(teamID).collection("players").doc(playerID).update(player));
  }

   // ------------------ OLD FIREBASE STUFF HERE ------------------------------//

  var firedatabase = {}; // not necessary just to make it more obvious
  // firedatabase.generateID = generateID;
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
  firedatabase.setStat = setStat
  //firedatabase.setStats = setStats
  firedatabase.getStats = getStats
  firedatabase.addNewPlayer = addNewPlayer;
  firedatabase.updatePlayer = updatePlayer;

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

  function getStats(teamID, gameID){

    return firebase.database().ref('/games/' + teamID + '/' + gameID + '/' + 'stats')
      .once('value').then(function(stats){

        return stats
    });
  }

  function setStat(teamID, gameID, stat){
    var refer = firebase.database().ref()
    return refer.child('/games/' + teamID + '/' + gameID + '/' + 'stats').push(stat);
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
